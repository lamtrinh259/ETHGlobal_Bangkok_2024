// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {VoteDAO} from "../src/VoteDAO.sol";
import {VoteToken} from "../src/VoteToken.sol";

contract AirdropScript is Script {
    VoteToken voteToken;

    function setUp() public {
        voteToken = VoteToken(vm.envAddress("VOTE_TOKEN_CONTRACT_ADDRESS"));
    }
    function run() public {
        uint256 deployerPrivkey = vm.envUint("DEPLOYER_PRIV_KEY");
        address voterAddress =  vm.envAddress("VOTER_ADDRESS");

        vm.startBroadcast(deployerPrivkey);
        voteToken.airdrop(voterAddress, 5 ether);
        console.log("Airdropped to: ", voterAddress);
    }
}
