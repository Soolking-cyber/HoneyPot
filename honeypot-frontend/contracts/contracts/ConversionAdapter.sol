// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

interface ILineaBridge {
    function deposit(address token, uint256 amount) external;
}

contract ConversionAdapter is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    IERC20 public immutable depositAsset;
    IERC20 public immutable payoutAsset;
    address public immutable potTreasury;
    ILineaBridge public bridge;

    event BridgeUpdated(address indexed bridge);
    event SwapExecuted(uint256 amountIn, uint256 amountOut, address indexed executor);
    event PotFunded(uint256 amount);

    constructor(address depositAsset_, address payoutAsset_, address potTreasury_) {
        require(depositAsset_ != address(0) && payoutAsset_ != address(0) && potTreasury_ != address(0), "Zero address");
        depositAsset = IERC20(depositAsset_);
        payoutAsset = IERC20(payoutAsset_);
        potTreasury = potTreasury_;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setBridge(address bridge_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        bridge = ILineaBridge(bridge_);
        emit BridgeUpdated(bridge_);
    }

    function pushToBridge(uint256 amount) external onlyRole(OPERATOR_ROLE) {
        require(address(bridge) != address(0), "Bridge unset");
        payoutAsset.forceApprove(address(bridge), amount);
        bridge.deposit(address(payoutAsset), amount);
        emit PotFunded(amount);
    }

    function recordSwap(uint256 amountIn, uint256 amountOut) external onlyRole(OPERATOR_ROLE) {
        emit SwapExecuted(amountIn, amountOut, msg.sender);
    }
}
