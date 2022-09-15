pragma solidity ^0.8.0;

import './ERC1400.sol';


contract CBSToken is ERC1400 {

  constructor(string memory name,
    string memory symbol,
    uint256 granularity,
    address[] memory controllers,
    bytes32[] memory defaultPartitions,
    uint chainID) ERC1400(name, symbol, granularity, controllers, defaultPartitions, chainID) public {
  }
}