// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IOpenEditionBurnable is IERC721 {
    function burn(uint256 tokenId) external;
}

interface ILineaSwapAdapter {
    function swap(address tokenIn, address tokenOut, uint256 amountIn, bytes calldata data) external returns (uint256 amountOut);
}

contract HoneyPotPot is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");

    uint16 public seasonDays;
    uint40 public depositWindow;
    uint256 public dailyDepositAmount;
    uint256 public totalBeeSupply;

    IERC20 public immutable musd;
    IERC20 public immutable lineaToken;
    IOpenEditionBurnable public immutable beeCollection;

    ILineaSwapAdapter public swapAdapter;
    address public bearWallet;
    address public musdLineaPool;

    uint40 public seasonStart;
    uint256 public bearTokenId;
    bool public bearSelected;
    bool public initialPotProcessed;

    uint256 public totalDepositedMusd;
    uint256 public totalLineaRecorded;
    uint256 public survivors;
    uint256 public seasonIdentifier;

    uint256 private constant BPS_DENOMINATOR = 10_000;
    uint256 private constant BEAR_SHARE_BPS = 1_000; // 10%
    uint256 private constant CREATOR_SHARE_BPS = 4_000; // 40%

    // Configurable addresses & amounts for new seasons.
    address public creatorWallet;

    struct BeePosition {
        uint40 lastDepositAt;
        uint16 daysPaid;
        bool eliminated;
        bool rewardClaimed;
    }

    mapping(uint256 => BeePosition) public beeState;

    event BearSelected(uint256 indexed tokenId, uint256 randomWord);
    event InitialPotProcessed(uint256 indexed amountIn, uint256 bearPayout, uint256 creatorPayout, uint256 lineaReceived);
    event SwapAdapterUpdated(address indexed adapter);
    event SwapPoolUpdated(address indexed pool);
    event BearWalletUpdated(address indexed wallet);
    event CreatorWalletUpdated(address indexed wallet);
    event DepositRecorded(
        uint256 indexed tokenId,
        address indexed beeOwner,
        uint16 dayNumber,
        uint256 amountMusd,
        uint256 amountLinea,
        uint256 nextDeadline
    );
    event BeeEliminated(uint256 indexed tokenId, address indexed executor);

    error BeeAlreadyEliminated();
    error BearProtected();
    error DepositClosed();
    error DepositWindowActive();
    error NotBeeOwner();
    error SeasonCompleted();

    constructor(
        address musd_,
        address lineaToken_,
        address beeCollection_,
        address bearWallet_,
        address creatorWallet_,
        uint16 seasonDays_,
        uint40 depositWindow_,
        uint256 dailyDepositAmount_,
        uint256 totalBeeSupply_
    ) {
        require(musd_ != address(0) && lineaToken_ != address(0) && beeCollection_ != address(0), "Zero address");
        require(bearWallet_ != address(0) && creatorWallet_ != address(0), "Reward wallets required");
        require(seasonDays_ > 0, "Season days");
        require(depositWindow_ > 0, "Window");
        require(dailyDepositAmount_ > 0, "Deposit amount");
        require(totalBeeSupply_ > 0, "Supply");

        musd = IERC20(musd_);
        lineaToken = IERC20(lineaToken_);
        beeCollection = IOpenEditionBurnable(beeCollection_);

        bearWallet = bearWallet_;
        creatorWallet = creatorWallet_;
        seasonDays = seasonDays_;
        depositWindow = depositWindow_;
        dailyDepositAmount = dailyDepositAmount_;
        totalBeeSupply = totalBeeSupply_;
        seasonStart = uint40(block.timestamp);
        seasonIdentifier = 1;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TREASURER_ROLE, msg.sender);
        _grantRole(KEEPER_ROLE, msg.sender);
    }

    function setSwapAdapter(address adapter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        swapAdapter = ILineaSwapAdapter(adapter);
        emit SwapAdapterUpdated(adapter);
    }

    /// @notice Registers the public Linea mUSD/LINEA pool (eg. 0x76e5D2033268F053CBE8B65aBbD00DB66Fa6D39B) used for on-chain swaps.
    function setSwapPool(address pool) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(pool != address(0), "Zero pool");
        musdLineaPool = pool;
        emit SwapPoolUpdated(pool);
    }

    function updateBearWallet(address wallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(wallet != address(0), "Zero wallet");
        bearWallet = wallet;
        emit BearWalletUpdated(wallet);
    }

    function updateCreatorWallet(address wallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(wallet != address(0), "Zero wallet");
        creatorWallet = wallet;
        emit CreatorWalletUpdated(wallet);
    }

    function configureSeason(
        uint16 seasonDays_,
        uint40 depositWindow_,
        uint256 dailyDepositAmount_,
        uint256 totalBeeSupply_,
        uint40 newSeasonStart,
        uint256 newSeasonIdentifier
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(seasonDays_ > 0 && depositWindow_ > 0 && dailyDepositAmount_ > 0 && totalBeeSupply_ > 0, "Invalid config");
        seasonDays = seasonDays_;
        depositWindow = depositWindow_;
        dailyDepositAmount = dailyDepositAmount_;
        totalBeeSupply = totalBeeSupply_;
        seasonStart = newSeasonStart;
        seasonIdentifier = newSeasonIdentifier;
    }

    /// @notice Accepts a randomness input (eg. Chainlink VRF) and locks in the Bear NFT token id for the season.
    function selectBear(uint256 randomWord) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!bearSelected, "Bear set");
        bearTokenId = _normalizeTokenId(randomWord);
        bearSelected = true;
        emit BearSelected(bearTokenId, randomWord);
    }

    /// @notice Splits the initial mint proceeds, rewarding the Bear wallet and swapping the remainder into LINEA.
    /// @param amountIn Total mUSD being seeded from mint revenue.
    /// @param randomWord Optional randomness source when the Bear id has not been set yet.
    /// @param swapCalldata Adapter-specific calldata used to route the swap for LINEA liquidity.
    function seedInitialPot(uint256 amountIn, uint256 randomWord, bytes calldata swapCalldata)
        external
        onlyRole(TREASURER_ROLE)
        nonReentrant
        returns (uint256 lineaReceived)
    {
        require(!initialPotProcessed, "Pot seeded");
        require(amountIn > 0, "No amount");
        if (!bearSelected) {
            bearTokenId = _normalizeTokenId(randomWord);
            bearSelected = true;
            emit BearSelected(bearTokenId, randomWord);
        }
        require(bearWallet != address(0), "Bear wallet missing");
        require(creatorWallet != address(0), "Creator wallet missing");
        require(address(swapAdapter) != address(0), "Swap adapter missing");
        require(musdLineaPool != address(0), "Pool missing");

        musd.safeTransferFrom(msg.sender, address(this), amountIn);

        uint256 bearShare = (amountIn * BEAR_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 creatorShare = (amountIn * CREATOR_SHARE_BPS) / BPS_DENOMINATOR;
        require(bearShare + creatorShare <= amountIn, "Split overflow");

        if (bearShare > 0) {
            musd.safeTransfer(bearWallet, bearShare);
            if (bearTokenId != 0) {
                try beeCollection.ownerOf(bearTokenId) returns (address owner) {
                    if (owner != address(0)) {
                        beeCollection.burn(bearTokenId);
                    }
                } catch {}
            }
        }

        if (creatorShare > 0) {
            musd.safeTransfer(creatorWallet, creatorShare);
        }

        uint256 amountForSwap = amountIn - bearShare - creatorShare;
        if (amountForSwap > 0) {
            musd.forceApprove(address(swapAdapter), amountForSwap);
            lineaReceived = swapAdapter.swap(address(musd), address(lineaToken), amountForSwap, swapCalldata);
            totalLineaRecorded += lineaReceived;
        }

        initialPotProcessed = true;
        emit InitialPotProcessed(amountIn, bearShare, creatorShare, lineaReceived);
    }

    function deposit(uint256 tokenId, bytes calldata swapCalldata) external nonReentrant {
        BeePosition storage position = beeState[tokenId];
        if (position.eliminated) revert BeeAlreadyEliminated();
        if (position.daysPaid >= seasonDays) revert SeasonCompleted();
        _assertBeeOwner(msg.sender, tokenId);

        uint256 deadline = getCurrentDeadline(tokenId);
        if (block.timestamp > deadline) revert DepositClosed();

        require(address(swapAdapter) != address(0), "Swap adapter missing");
        require(musdLineaPool != address(0), "Pool missing");

        position.lastDepositAt = uint40(block.timestamp);
        position.daysPaid += 1;
        totalDepositedMusd += dailyDepositAmount;

        if (position.daysPaid == seasonDays) {
            survivors += 1;
        }

        musd.safeTransferFrom(msg.sender, address(this), dailyDepositAmount);
        musd.forceApprove(address(swapAdapter), dailyDepositAmount);
        uint256 lineaReceived = swapAdapter.swap(address(musd), address(lineaToken), dailyDepositAmount, swapCalldata);
        require(lineaReceived > 0, "Swap failed");
        totalLineaRecorded += lineaReceived;

        emit DepositRecorded(tokenId, msg.sender, position.daysPaid, dailyDepositAmount, lineaReceived, deadline + depositWindow);
    }

    function forceEliminate(uint256 tokenId) external onlyRole(KEEPER_ROLE) {
        BeePosition storage position = beeState[tokenId];
        if (position.eliminated) revert BeeAlreadyEliminated();
        if (tokenId == bearTokenId) revert BearProtected();

        uint256 deadline = getCurrentDeadline(tokenId);
        if (block.timestamp <= deadline) revert DepositWindowActive();

        position.eliminated = true;
        beeCollection.burn(tokenId);
        emit BeeEliminated(tokenId, msg.sender);
    }

    function getCurrentDeadline(uint256 tokenId) public view returns (uint256) {
        BeePosition memory position = beeState[tokenId];
        if (position.daysPaid == 0) {
            return uint256(seasonStart) + depositWindow;
        }
        return uint256(position.lastDepositAt) + depositWindow;
    }

    function _normalizeTokenId(uint256 randomWord) internal view returns (uint256) {
        uint256 candidate = (randomWord % totalBeeSupply) + 1;
        return candidate;
    }

    function _assertBeeOwner(address account, uint256 tokenId) internal view {
        if (beeCollection.ownerOf(tokenId) != account) {
            revert NotBeeOwner();
        }
    }
}
