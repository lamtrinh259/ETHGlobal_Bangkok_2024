// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

enum VoteType {
    YES,
    NO,
    ABSTAIN
}

struct Proposal {
    string descriptionCID;
    uint256 yesVotes;
    uint256 noVotes;
    uint256 abstainVotes;
    uint256 endTime;
    bool executed;
    mapping(address => bool) voters;
    mapping(address => VoteType) votes;
}
