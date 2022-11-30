import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// SPDX-License-Identifier: MIT
// This is a garbage coin with a lot of stuff that mempool watcher should be able to monitor

pragma solidity 0.8.17;

// Contract is an ERC20 token

contract WatchMe is ERC20 {

  
    function mint(uint amount) external {
        require(!paused, "Contract is paused");
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        require(!paused, "Contract is paused");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    // Set a variable to hold the address of the contract owner
    address owner;
    // function to set the owner address
    constructor() {
        owner = msg.sender;
        string name = "WatchMe";
        string symbol = "WME";
        uint256 totalSupply = 1;  
    }
    // modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    // function to transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(!paused, "Contract is paused");
        owner = newOwner;
    }

    // function to withdraw all the funds from the contract
    function withdraw() external onlyOwner {
        require(!paused, "Contract is paused");
        payable(msg.sender).transfer(address(this).balance);
    }
    // function to burn all the tokens from the contract
    function burnAll() external onlyOwner {
        require(!paused, "Contract is paused");
        totalSupply = 0;
    }
    // function to confiscate tokens from a specific address
    function confiscate(address _address) external onlyOwner {
        require(!paused, "Contract is paused");
        balanceOf[_address] = 0;
    }
    // function to pause the contract
    function pause() external onlyOwner {
        paused = true;
    }

}
