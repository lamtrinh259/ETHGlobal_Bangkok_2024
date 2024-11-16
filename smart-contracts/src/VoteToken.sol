// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteToken is ERC20, Ownable {
    address public votingContract;
    address public airdropper;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, 200 ether);
    }

    function setAirdropper(address _airdropper) external onlyOwner {
        airdropper = _airdropper;
    }

    function setVotingContract(address _votingContract) external onlyOwner {
        votingContract = _votingContract;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == votingContract, "Only voting contract can burn");
        _burn(from, amount);
    }

     function airdrop(address to, uint256 amount) external {
        require(msg.sender == airdropper || msg.sender == owner(), "Only airdropper can airdrop");
        _mint(to, amount);
    }
}