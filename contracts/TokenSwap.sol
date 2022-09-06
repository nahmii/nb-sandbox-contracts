//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CBToken.sol";
import "./CBSToken.sol";
import "./ERC1400.sol";
import "hardhat/console.sol";

contract TokenSwap is AccessControl {
    bytes32 public constant SWAP_CB_TO_CBS_ROLE = keccak256("SWAP_CB_TO_CBS_ROLE");
    bytes32 public constant SWAP_CBS_TO_CB_ROLE = keccak256("SWAP_CBS_TO_CB_ROLE");
    CBToken public cbToken;
    CBSToken public cbsToken;
    ERC1400 public erc1400Token;

    constructor(address _cbToken, address _erc1400Token) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SWAP_CB_TO_CBS_ROLE, msg.sender);
        _grantRole(SWAP_CBS_TO_CB_ROLE, msg.sender);
        cbToken = CBToken(_cbToken);
       erc1400Token = ERC1400(_erc1400Token);
    }

    function swapCbToCbs(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data)
    public
    onlyRole(SWAP_CB_TO_CBS_ROLE)
    returns (uint256)
    {
        require(value > 0, string.concat("Amount of ", cbToken.symbol(), "must be greater than zero"));
        require(
            cbToken.balanceOf(msg.sender) >= value,
            string.concat("Sender does not have enough ", cbToken.symbol())
        );
        require(
            erc1400Token.isMinter(address(this)),
            "TokenSwap is not a minter of CBSToken"
        );
        require(cbToken.transferFrom(msg.sender, address(this), value), "CBToken Transfer failed");
        erc1400Token.issueByPartition(partition, msg.sender, value, data);
        return value;
    }

    function swapCbsToCb(bytes32 partition, uint256 value, bytes calldata operatorData)
    public
    onlyRole(SWAP_CBS_TO_CB_ROLE)
    returns (uint256)
    {
        require(value > 0, "Amount of CBSToken must be greater than zero");
        require(
            cbToken.balanceOf(address(this)) >= value,
            string.concat("Contract does not have enough ", cbToken.symbol())
        );
        erc1400Token.operatorRedeemByPartition(partition, msg.sender, value, operatorData);
        require(cbToken.transfer(msg.sender, value));
        return value;
    }
}