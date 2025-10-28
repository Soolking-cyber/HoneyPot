// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {HoneyPotBee} from "./HoneyPotBee.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

/// @title TreasurySplitter
/// @notice Splits mint proceeds between the pot, the creator and a randomly selected Bee holder.
contract TreasurySplitter is AccessControl, VRFConsumerBaseV2 {
    using SafeERC20 for IERC20;

    uint16 private constant TOTAL_BPS = 10_000;
    uint16 public constant POT_BPS = 5_000; // 50%
    uint16 public constant CREATOR_BPS = 4_000; // 40%
    uint16 public constant BEAR_BPS = 1_000; // 10%

    enum BearState {
        Idle,
        Requested,
        Selected
    }

    address public immutable pot;
    address public immutable creator;
    HoneyPotBee public immutable beeCollection;

    VRFCoordinatorV2Interface public immutable coordinator;
    bytes32 public keyHash;
    uint64 public subscriptionId;
    uint16 public requestConfirmations;
    uint32 public callbackGasLimit;

    BearState public bearState;
    uint256 public vrfRequestId;
    uint256 public bearTokenId;
    address public bearWinner;

    uint256 public bearNativeBalance;
    mapping(address token => uint256) public bearTokenBalances;

    address[] private trackedBearTokens;
    mapping(address token => bool) private isTrackedToken;

    event NativeSplit(uint256 value);
    event TokenSplit(address indexed token, uint256 value);
    event BearSelectionRequested(uint256 indexed requestId, uint256 indexed mintedSupply);
    event BearSelected(uint256 indexed tokenId, address indexed winner, uint256 randomWord, uint256 requestId);
    event BearNativePayout(address indexed winner, uint256 amount);
    event BearTokenPayout(address indexed winner, address indexed token, uint256 amount);
    event VRFConfigUpdated(bytes32 keyHash, uint16 requestConfirmations, uint32 callbackGasLimit);
    event VRFSubscriptionUpdated(uint64 subscriptionId);

    error BearSelectionInFlight();
    error BearAlreadySelected();
    error BearNotSelected();
    error BearSelectionNotRequested();
    error BearWinnerUnavailable();
    error UnexpectedVRFRequest(uint256 expected, uint256 received);

    constructor(
        address pot_,
        address creator_,
        address beeCollection_,
        address vrfCoordinator_,
        bytes32 keyHash_,
        uint64 subscriptionId_,
        uint16 requestConfirmations_,
        uint32 callbackGasLimit_
    ) VRFConsumerBaseV2(vrfCoordinator_) {
        require(pot_ != address(0) && creator_ != address(0) && beeCollection_ != address(0), "Zero address");
        require(vrfCoordinator_ != address(0), "Coordinator required");
        require(keyHash_ != bytes32(0), "Key hash required");
        require(subscriptionId_ != 0, "Subscription required");
        require(callbackGasLimit_ > 0, "Gas limit required");

        pot = pot_;
        creator = creator_;
        beeCollection = HoneyPotBee(beeCollection_);
        coordinator = VRFCoordinatorV2Interface(vrfCoordinator_);
        keyHash = keyHash_;
        subscriptionId = subscriptionId_;
        requestConfirmations = requestConfirmations_ == 0 ? 3 : requestConfirmations_;
        callbackGasLimit = callbackGasLimit_;
        bearState = BearState.Idle;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    receive() external payable {
        _disperseNative(msg.value);
    }

    /// @notice Splits native currency deposits according to the configured basis points.
    function splitNative() external payable {
        _disperseNative(msg.value);
    }

    /// @notice Splits ERC-20 deposits according to the configured basis points.
    function splitToken(address token, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != address(0), "Token zero");
        require(amount > 0, "Amount zero");

        IERC20 erc20 = IERC20(token);
        erc20.safeTransferFrom(msg.sender, address(this), amount);

        uint256 potShare = (amount * POT_BPS) / TOTAL_BPS;
        uint256 creatorShare = (amount * CREATOR_BPS) / TOTAL_BPS;
        uint256 bearShare = amount - potShare - creatorShare;

        if (potShare > 0) {
            erc20.safeTransfer(pot, potShare);
        }

        if (creatorShare > 0) {
            erc20.safeTransfer(creator, creatorShare);
        }

        if (bearShare > 0) {
            if (bearState == BearState.Selected && bearWinner != address(0)) {
                erc20.safeTransfer(bearWinner, bearShare);
                emit BearTokenPayout(bearWinner, token, bearShare);
            } else {
                bearTokenBalances[token] += bearShare;
                _trackToken(token);
            }
        }

        emit TokenSplit(token, amount);
    }

    /// @notice Initiates a VRF request to select the bear winner.
    function requestBearSelection() external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256 requestId) {
        if (bearState == BearState.Requested) revert BearSelectionInFlight();
        if (bearState == BearState.Selected) revert BearAlreadySelected();

        uint256 mintedSupply = beeCollection.beeMinted();
        require(mintedSupply > 0, "No bees minted");

        requestId = coordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            1
        );

        bearState = BearState.Requested;
        vrfRequestId = requestId;

        emit BearSelectionRequested(requestId, mintedSupply);
    }

    /// @notice Exposes the tracked ERC-20 tokens carrying pending bear rewards.
    function getTrackedBearTokens() external view returns (address[] memory) {
        return trackedBearTokens;
    }

    /// @notice Allows anyone to distribute any pending bear rewards after the winner has been selected.
    function distributeBearRewards() public {
        if (bearState != BearState.Selected) revert BearNotSelected();
        address winner = bearWinner;
        if (winner == address(0)) revert BearWinnerUnavailable();
        _payoutBearRewards(winner);
    }

    /// @notice Updates the VRF parameters (key hash, confirmations, callback gas limit).
    function updateVRFConfig(bytes32 keyHash_, uint16 requestConfirmations_, uint32 callbackGasLimit_)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(keyHash_ != bytes32(0), "Key hash required");
        require(callbackGasLimit_ > 0, "Gas limit required");
        keyHash = keyHash_;
        requestConfirmations = requestConfirmations_ == 0 ? 3 : requestConfirmations_;
        callbackGasLimit = callbackGasLimit_;
        emit VRFConfigUpdated(keyHash, requestConfirmations, callbackGasLimit);
    }

    /// @notice Updates the VRF subscription ID used for randomness funding.
    function updateVRFSubscription(uint64 subscriptionId_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(subscriptionId_ != 0, "Subscription required");
        subscriptionId = subscriptionId_;
        emit VRFSubscriptionUpdated(subscriptionId);
    }

    /// @dev Handles the VRF callback with the requested random words.
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        if (bearState != BearState.Requested) revert BearSelectionNotRequested();
        if (requestId != vrfRequestId) revert UnexpectedVRFRequest(vrfRequestId, requestId);
        uint256 randomWord = randomWords[0];
        uint256 tokenId = _normalizeTokenId(randomWord);
        address winner = beeCollection.ownerOf(tokenId);
        require(winner != address(0), "Winner missing");

        bearTokenId = tokenId;
        bearWinner = winner;
        bearState = BearState.Selected;

        emit BearSelected(tokenId, winner, randomWord, requestId);

        _payoutBearRewards(winner);
    }

    function _disperseNative(uint256 amount) internal {
        if (amount == 0) return;

        uint256 potShare = (amount * POT_BPS) / TOTAL_BPS;
        uint256 creatorShare = (amount * CREATOR_BPS) / TOTAL_BPS;
        uint256 bearShare = amount - potShare - creatorShare;

        (bool s1, ) = pot.call{value: potShare}("");
        (bool s2, ) = creator.call{value: creatorShare}("");
        require(s1 && s2, "Native transfer failed");

        if (bearShare > 0) {
            if (bearState == BearState.Selected && bearWinner != address(0)) {
                (bool s3, ) = bearWinner.call{value: bearShare}("");
                require(s3, "Bear transfer failed");
                emit BearNativePayout(bearWinner, bearShare);
            } else {
                bearNativeBalance += bearShare;
            }
        }

        emit NativeSplit(amount);
    }

    function _trackToken(address token) internal {
        if (!isTrackedToken[token]) {
            isTrackedToken[token] = true;
            trackedBearTokens.push(token);
        }
    }

    function _normalizeTokenId(uint256 randomWord) internal view returns (uint256) {
        uint256 mintedSupply = beeCollection.beeMinted();
        require(mintedSupply > 0, "No bees minted");
        return (randomWord % mintedSupply) + 1;
    }

    function _payoutBearRewards(address winner) internal {
        uint256 nativeAmount = bearNativeBalance;
        if (nativeAmount > 0) {
            bearNativeBalance = 0;
            (bool success, ) = winner.call{value: nativeAmount}("");
            require(success, "Native payout failed");
            emit BearNativePayout(winner, nativeAmount);
        }

        uint256 length = trackedBearTokens.length;
        for (uint256 i = 0; i < length; i++) {
            address tokenAddr = trackedBearTokens[i];
            uint256 balance = bearTokenBalances[tokenAddr];
            if (balance == 0) continue;
            bearTokenBalances[tokenAddr] = 0;
            IERC20(tokenAddr).safeTransfer(winner, balance);
            emit BearTokenPayout(winner, tokenAddr, balance);
        }
    }
}
