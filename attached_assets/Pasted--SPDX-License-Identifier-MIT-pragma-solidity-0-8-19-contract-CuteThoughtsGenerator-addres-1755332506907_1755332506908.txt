//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CuteThoughtsGenerator {
    address public owner;
    uint256 public totalThoughts;
    uint256 public totalTips;
    
    string[] private cuteThoughts = [
        "You're like a warm hug on a cold day!",
        "Your smile could light up the entire blockchain!",
        "You're absolutely pawsome!",
        "Sending you virtual cookies and good vibes!",
        "You're a rare gem in this digital world!",
        "Your kindness creates ripples of joy!",
        "You're the reason someone smiles today!",
        "Like a butterfly, you bring beauty wherever you go!",
        "You're proof that magic exists!",
        "Your heart is made of pure stardust!",
        "You're a walking ray of sunshine!",
        "The world is brighter because you're in it!",
        "You're someone's favorite notification!",
        "Your laugh is music to the universe!",
        "You're a masterpiece in progress!"
    ];
    
    mapping(address => uint256) public userThoughtCount;
    mapping(address => uint256) public userTips;
    
    event ThoughtGenerated(address indexed user, string thought, uint256 thoughtNumber);
    event TipReceived(address indexed tipper, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    function generateCuteThought() public returns (string memory) {
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            totalThoughts
        ))) % cuteThoughts.length;
        
        string memory selectedThought = cuteThoughts[randomIndex];
        totalThoughts++;
        userThoughtCount[msg.sender]++;
        
        emit ThoughtGenerated(msg.sender, selectedThought, totalThoughts);
        return selectedThought;
    }
    
    function generateThoughtWithTip() public payable returns (string memory) {
        require(msg.value > 0, "Please send a tip to spread more joy!");
        
        totalTips += msg.value;
        userTips[msg.sender] += msg.value;
        
        emit TipReceived(msg.sender, msg.value);
        
        return generateCuteThought();
    }
    
    function addNewThought(string memory _newThought) public {
        require(msg.sender == owner, "Only owner can add new thoughts!");
        cuteThoughts.push(_newThought);
    }
    
    function getTotalThoughts() public view returns (uint256) {
        return cuteThoughts.length;
    }
    
    function getMyThoughtCount() public view returns (uint256) {
        return userThoughtCount[msg.sender];
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can withdraw!");
        require(address(this).balance > 0, "No tips to withdraw!");
        
        payable(owner).transfer(address(this).balance);
    }
    
    function emergencyWithdraw() public {
        require(msg.sender == owner, "Only owner can emergency withdraw!");
        require(address(this).balance > 0, "No balance to withdraw!");
        payable(owner).transfer(address(this).balance);
    }
}