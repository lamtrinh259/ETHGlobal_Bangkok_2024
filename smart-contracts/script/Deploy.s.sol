// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {VoteDAO} from "../src/VoteDAO.sol";
import {VoteToken} from "../src/VoteToken.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivkey = vm.envUint("DEPLOYER_PRIV_KEY");

        vm.startBroadcast(deployerPrivkey);
        VoteToken votingToken = new VoteToken("DAO VOTE Token", "VOTE");
        VoteDAO voteDao = new VoteDAO(address(votingToken));
        votingToken.setVotingContract(address(voteDao));
        console.log("Voting Token Address: ", address(votingToken));
        console.log("VoteDAO Address: ", address(voteDao));
    }
}
