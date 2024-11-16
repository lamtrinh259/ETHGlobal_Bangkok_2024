// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {VoteDAO} from "../src/VoteDAO.sol";
import {VoteToken} from "../src/VoteToken.sol";
import {VoteType} from "../src/types.sol";

contract VoteScript is Script {
    VoteDAO voteDao;
    VoteToken voteToken;

    function setUp() public {
        voteDao = VoteDAO(vm.envAddress("VOTE_DAO_CONTRACT_ADDRESS"));
        voteToken = VoteToken(vm.envAddress("VOTE_TOKEN_CONTRACT_ADDRESS"));
    }
    function run() public {
        uint256 voterPrivKey = vm.envUint("VOTER_PRIV_KEY");
        uint256 proposalId = 0;

        vm.startBroadcast(voterPrivKey);
        voteDao.vote(proposalId, VoteType.NO);
    }
}
