import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

// Contract is an ERC20 token

contract WatchMe is ERC20 {

    string name = "WatchMe";
    string symbol = "WME";
    uint256 totalSupply = 1;    
    function mint(uint amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    // Set a variable to hold the address of the contract owner
    address owner;
    
}
