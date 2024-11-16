// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {VoteDAO} from "../src/VoteDAO.sol";
import {VoteToken} from "../src/VoteToken.sol";

contract CreateProposalScript is Script {
    VoteDAO voteDao;
    VoteToken voteToken;

    function setUp() public {
        voteDao = VoteDAO(vm.envAddress("VOTE_DAO_CONTRACT_ADDRESS"));
        voteToken = VoteToken(vm.envAddress("VOTE_TOKEN_CONTRACT_ADDRESS"));
    }
    function run() public {
        uint256 deployerPrivkey = vm.envUint("DEPLOYER_PRIV_KEY");
        string memory descriptionCID = "0x000111";
        uint256 duration = 12 hours;

        vm.startBroadcast(deployerPrivkey);
        uint256 proposalId = voteDao.createProposal(descriptionCID, duration);
        console.log("Proposal created with ID: ", proposalId);
    }
}
