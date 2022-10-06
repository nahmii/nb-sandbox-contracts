// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@consensys/universal-token/contracts/ERC1400.sol";

contract CBSToken is ERC1400 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 granularity,
        address[] memory controllers,
        bytes32[] memory defaultPartitions
    ) public ERC1400(name, symbol, granularity, controllers, defaultPartitions) {} // solhint-disable-line no-empty-blocks
}
