
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./tools/ERC1820Client.sol";

 interface IERC1400 is IERC20 {
 // *********************** Transfers ************************
  function transferWithData(address to, uint256 value, bytes calldata data) external;
  function transferFromWithData(address from, address to, uint256 value, bytes calldata data) external;
} 



contract DisperseWithData is ERC1820Client {
    bytes[] public messageData;

    string constant internal DISPERSE_WITH_DATA_INTERFACE_NAME = "DisperseWithData";

    constructor() {
    // Register contract in ERC1820 registry
    ERC1820Client.setInterfaceImplementation(DISPERSE_WITH_DATA_INTERFACE_NAME, address(this));
    }

    function getDataLength() public view returns (uint256) {
        return messageData.length;
    }
    function disperseEther(address[] memory recipients, uint256[] memory values)
        external
        payable
    {
        for (uint256 i = 0; i < recipients.length; i++)
            payable(recipients[i]).transfer(values[i]);
        uint256 balance = address(this).balance;
        if (balance > 0) payable(msg.sender).transfer(balance);
    }

    function disperseToken(
        IERC1400 token,
        address[] memory recipients,
        uint256[] memory values
    ) external {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) total += values[i];
        require(token.transferFrom(msg.sender, address(this), total));
        for (uint256 i = 0; i < recipients.length; i++)
            require(token.transfer(recipients[i], values[i]));
    }

    function disperseTokenSimple(
        IERC1400 token,
        address[] memory recipients,
        uint256[] memory values
    ) external {
        for (uint256 i = 0; i < recipients.length; i++)
            require(token.transferFrom(msg.sender, recipients[i], values[i]));
    }

    function disperseTokenWithData(
        IERC1400 token,
        address[] memory recipients,
        uint256[] memory values,
        bytes[] calldata data
    ) external {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) total += values[i];
        require(token.transferFrom(msg.sender, address(this), total));
        for (uint256 i = 0; i < recipients.length; i++) {
            if(interfaceAddr(address(token), "ERC1400Token") == address(0)) {
                require(token.transfer(recipients[i], values[i]));
            } else {
                token.transferWithData(recipients[i], values[i], data[i]);
              
            }
            messageData.push(data[i]);
           
        }
          
    }

    function disperseTokenWithDataSimple(
        IERC1400 token, 
        address[] memory recipients, 
        uint256[] memory values, 
        bytes[] calldata data) external 
    {
         for (uint256 i = 0; i < recipients.length; i++) {
            if(interfaceAddr(address(token), "ERC1400Token") == address(0)) {
               require(token.transferFrom(msg.sender, recipients[i], values[i]));
            } else {
                token.transferFromWithData(msg.sender, recipients[i], values[i], data[i]);
            }
            messageData.push(data[i]);   
         }
    }

}
