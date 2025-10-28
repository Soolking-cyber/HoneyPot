// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {HoneyPotBee} from "./HoneyPotBee.sol";

contract HoneyPotGame is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");

    uint256 public constant TOTAL_DAYS = 420;
    uint256 public constant DEPOSIT_WINDOW = 1 days;

    IERC20 public immutable stakeToken;
    HoneyPotBee public immutable beeNft;

    uint256 public immutable dailyAmount;
    uint256 public immutable seasonStart;

    uint256 public totalDeposited;
    uint256 public survivors;
    bool public seasonClosed;

    struct PlayerProgress {
        uint40 lastDepositAt;
        uint16 daysCompleted;
        bool eliminated;
        bool rewardClaimed;
    }

    mapping(uint256 => PlayerProgress) public progressByBee;

    event DepositRecorded(address indexed bee, uint256 indexed beeId, uint16 dayNumber, uint256 depositedAmount, uint256 deadline);
    event BeeEliminated(uint256 indexed beeId, uint40 lastDepositAt);
    event SeasonClosed(uint256 timestamp, uint256 survivors);
    event RewardClaimed(address indexed bee, uint256 indexed beeId, uint256 payout);

    error NotBeeOwner();
    error BeeEliminatedError();
    error DepositLocked();
    error SeasonRunning();
    error SeasonFinalized();
    error RewardAlreadyClaimed();

    constructor(
        address stakeToken_,
        address beeNft_,
        uint256 dailyAmount_
    ) {
        require(stakeToken_ != address(0) && beeNft_ != address(0), "Zero address");
        stakeToken = IERC20(stakeToken_);
        beeNft = HoneyPotBee(beeNft_);
        dailyAmount = dailyAmount_;
        seasonStart = block.timestamp;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function deposit(uint256 beeId) external nonReentrant {
        PlayerProgress storage progress = progressByBee[beeId];
        if (progress.eliminated) revert BeeEliminatedError();
        if (!_isOwner(msg.sender, beeId)) revert NotBeeOwner();
        if (progress.daysCompleted >= TOTAL_DAYS) revert DepositLocked();

        uint256 deadline = getCurrentDeadline(beeId);
        if (block.timestamp > deadline) {
            progress.eliminated = true;
            emit BeeEliminated(beeId, progress.lastDepositAt);
            revert BeeEliminatedError();
        }

        progress.lastDepositAt = uint40(block.timestamp);
        progress.daysCompleted += 1;
        totalDeposited += dailyAmount;

        if (progress.daysCompleted == TOTAL_DAYS) {
            survivors += 1;
        }

        stakeToken.safeTransferFrom(msg.sender, address(this), dailyAmount);

        emit DepositRecorded(msg.sender, beeId, progress.daysCompleted, dailyAmount, block.timestamp + DEPOSIT_WINDOW);
    }

    function forceEliminate(uint256 beeId) external {
        PlayerProgress storage progress = progressByBee[beeId];
        if (progress.eliminated) revert BeeEliminatedError();

        uint256 deadline = getCurrentDeadline(beeId);
        if (block.timestamp <= deadline) revert DepositLocked();

        progress.eliminated = true;
        emit BeeEliminated(beeId, progress.lastDepositAt);
    }

    function getCurrentDeadline(uint256 beeId) public view returns (uint256) {
        PlayerProgress memory progress = progressByBee[beeId];
        if (progress.daysCompleted == 0) {
            return seasonStart + DEPOSIT_WINDOW;
        }
        return uint256(progress.lastDepositAt) + DEPOSIT_WINDOW;
    }

    function closeSeason() external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (seasonClosed) revert SeasonFinalized();
        if (block.timestamp < seasonStart + (TOTAL_DAYS * DEPOSIT_WINDOW)) revert SeasonRunning();
        seasonClosed = true;
        emit SeasonClosed(block.timestamp, survivors);
    }

    function claimReward(uint256 beeId, address recipient) external nonReentrant {
        PlayerProgress storage progress = progressByBee[beeId];
        if (!_isOwner(msg.sender, beeId)) revert NotBeeOwner();
        if (!seasonClosed) revert SeasonRunning();
        if (progress.daysCompleted < TOTAL_DAYS) revert BeeEliminatedError();
        if (progress.rewardClaimed) revert RewardAlreadyClaimed();
        require(survivors > 0, "No survivors");

        uint256 share = totalDeposited / survivors;
        progress.rewardClaimed = true;
        stakeToken.safeTransfer(recipient, share);
        emit RewardClaimed(recipient, beeId, share);
    }

    function registerEarlyDeposit(uint256 beeId, uint40 timestamp, uint16 dayCount) external onlyRole(KEEPER_ROLE) {
        PlayerProgress storage progress = progressByBee[beeId];
        progress.lastDepositAt = timestamp;
        progress.daysCompleted = dayCount;
    }

    function _isOwner(address account, uint256 beeId) internal view returns (bool) {
        return beeNft.ownerOf(beeId) == account;
    }
}
