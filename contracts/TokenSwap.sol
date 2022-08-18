//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CBToken.sol";
import "./CBSToken.sol";

contract TokenSwap is AccessControl {
    bytes32 public constant SWAP_ROLE = keccak256("SWAP_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    CBToken public cbToken;
    CBSToken public cbsToken;

    constructor(address _cbToken, address _cbsToken) {
        _grantRole(SWAP_ROLE, msg.sender);
        cbToken = CBToken(_cbToken);
        cbsToken = CBSToken(_cbsToken);
    }

    function swapNok(uint256 amount)
        public
        onlyRole(SWAP_ROLE)
        returns (uint256)
    {
        require(amount > 0, "Amount must be greater than zero");
        require(
            cbToken.balanceOf(msg.sender) >= amount,
            "Sender doesn't have enough tokens"
        );
        require(
            cbToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbsToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbsToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(cbToken.transferFrom(msg.sender, address(this), amount));
        cbsToken.mint(msg.sender, amount);
        return amount;
    }

    function swapNokS(uint256 amount)
        public
        onlyRole(SWAP_ROLE)
        returns (uint256)
    {
        require(amount > 0, "Amount must be greater than zero");
        require(
            cbsToken.balanceOf(msg.sender) >= amount,
            "Sender doesn't have enough tokens"
        );
        require(
            cbToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbsToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbsToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        cbsToken.burn(msg.sender, amount);
        require(cbToken.transfer(msg.sender, amount));
        return amount;
    }
}
