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
    CBSToken public cBSToken;

    constructor(address _cBToken, address _cBSToken) {
        _grantRole(SWAP_ROLE, msg.sender);
        cbToken = CBToken(_cBToken);
        cBSToken = CBSToken(_cBSToken);
    }

    function swapNok(uint256 amountNok)
        public
        onlyRole(SWAP_ROLE)
        returns (uint256)
    {
        require(amountNok > 0, "amountNok must be greater then zero");
        require(
            cbToken.balanceOf(msg.sender) >= amountNok,
            "sender doesn't have enough Tokens"
        );
        require(
            cbToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cBSToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cBSToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(cbToken.transferFrom(msg.sender, address(this), amountNok));
        cBSToken.mint(msg.sender, amountNok);
        return amountNok;
    }

    function swapNokS(uint256 amountNokS)
        public
        onlyRole(SWAP_ROLE)
        returns (uint256)
    {
        require(amountNokS > 0, "amountNok must be greater then zero");
        require(
            cBSToken.balanceOf(msg.sender) >= amountNokS,
            "sender doesn't have enough Tokens"
        );
        require(
            cbToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cBSToken.hasRole(MINTER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cbToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        require(
            cBSToken.hasRole(BURNER_ROLE, msg.sender),
            "You are not an admin"
        );
        cBSToken.burn(msg.sender, amountNokS);
        require(cbToken.transfer(msg.sender, amountNokS));
        return amountNokS;
    }
}
