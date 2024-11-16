// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./VoteToken.sol";
import "./types.sol";

contract VoteDAO {
    address public admin;
    VoteToken public voteToken;
    Proposal[] public proposals;

    event ProposalCreated(
        uint256 proposalId,
        string descriptionCID,
        uint256 endTime
    );
    
    event Voted(uint256 proposalId, address voter, VoteType vote);
    event ProposalExecuted(uint256 proposalId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier proposalExists(uint256 proposalId) {
        require(proposalId < proposals.length, "Invalid proposal ID");
        _;
    }

    constructor(address tokenAddress) {
        admin = msg.sender;
        voteToken = VoteToken(tokenAddress);
    }

    function createProposal(
        string calldata descriptionCID,
        uint256 duration
    ) external onlyAdmin returns (uint256) {
        Proposal storage newProposal = proposals.push();
        newProposal.descriptionCID = descriptionCID;
        newProposal.endTime = block.timestamp + duration;
        uint256 proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, descriptionCID, newProposal.endTime);
        return proposalId;
    }

    function vote(
        uint256 proposalId,
        VoteType voteType
    ) external proposalExists(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.voters[msg.sender], "Already voted");
        require(
            voteToken.balanceOf(msg.sender) >= 1 ether,
            "Insufficient voting tokens"
        );

        voteToken.burn(msg.sender, 1 ether);

        proposal.voters[msg.sender] = true;
        proposal.votes[msg.sender] = voteType;

        if (voteType == VoteType.YES) {
            proposal.yesVotes++;
        } else if (voteType == VoteType.NO) {
            proposal.noVotes++;
        } else if (voteType == VoteType.ABSTAIN) {
            proposal.abstainVotes++;
        }

        emit Voted(proposalId, msg.sender, voteType);
    }

    function executeProposal(
        uint256 proposalId
    ) external onlyAdmin proposalExists(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");

        proposal.executed = true;

        emit ProposalExecuted(proposalId);
    }

    function getProposal(
        uint256 proposalId
    )
        external
        view
        proposalExists(proposalId)
        returns (
            string memory descriptionCID,
            uint256 yesVotes,
            uint256 noVotes,
            uint256 abstainVotes,
            uint256 endTime,
            bool executed
        )
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.descriptionCID,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.abstainVotes,
            proposal.endTime,
            proposal.executed
        );
    }

    function getUserVote(
        uint256 proposalId,
        address user
    ) external view proposalExists(proposalId) returns (VoteType) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.voters[user], "User has not voted");
        return proposal.votes[user];
    }
}
