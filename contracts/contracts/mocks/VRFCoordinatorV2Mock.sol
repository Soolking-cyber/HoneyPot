// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFCoordinatorV2Mock as ChainlinkVRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2Mock.sol";

contract VRFCoordinatorV2Mock is ChainlinkVRFCoordinatorV2Mock {
    constructor(uint96 baseFee, uint96 gasPriceLink) ChainlinkVRFCoordinatorV2Mock(baseFee, gasPriceLink) {}
}
