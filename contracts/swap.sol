//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CBToken.sol";
import "./CBSToken.sol";

contract TokenSwap is AccessControl {
    bytes32 public constant SWAP_ROLE = keccak256("SWAP_ROLE");
    CBToken public cbToken;
    CBSToken public cBSToken;

    constructor(address _cBToken, address _cBSToken) {
        _grantRole(SWAP_ROLE, msg.sender);
        cbToken = CBToken(_cBToken);
        cBSToken = CBSToken(_cBSToken);
    }
}
