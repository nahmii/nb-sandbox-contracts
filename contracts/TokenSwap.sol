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
        require(amount > 0, string.concat("Amount of ", cbToken.symbol(), " must be greater than zero"));
        require(
            cbToken.balanceOf(msg.sender) >= amount,
            string.concat("Sender does not have enough ", cbToken.symbol())
        );
        require(
            cbsToken.hasRole(MINTER_ROLE, msg.sender),
            string.concat("Sender is not a minter of ", cbsToken.symbol())
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
        require(amount > 0, string.concat("Amount of ", cbsToken.symbol(), " must be greater than zero"));
        require(
            cbsToken.balanceOf(msg.sender) >= amount,
            string.concat("Sender does not have enough ", cbsToken.symbol())
        );
        require(
            cbsToken.hasRole(BURNER_ROLE, msg.sender),
            string.concat("Sender is not a burner of ", cbsToken.symbol())
        );
        cbsToken.burn(msg.sender, amount);
        require(cbToken.transfer(msg.sender, amount));
        return amount;
    }
}
