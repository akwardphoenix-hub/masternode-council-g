import React from "react";

function VotingRecords({ votes, proposals }) {
  return (
    <div className="voting-records">
      <h2>Voting Records</h2>
      {votes.length === 0 ? (
        <p>No votes recorded yet.</p>
      ) : (
        votes.map((vote, idx) => {
          // Support both old and new format for proposal matching
          const proposal = proposals.find(p => 
            (p.id === vote.proposalId) || (p.proposal_id === vote.proposalId)
          );
          const voter = vote.voter || vote.node || "Unknown";
          return (
            <div key={idx} className="vote-card">
              <p>
                <strong>{proposal ? proposal.title : "Unknown Proposal"}</strong>
              </p>
              <p>{voter} • {new Date(vote.timestamp).toLocaleString()}</p>
              <p>
                <span
                  style={{
                    backgroundColor:
                      vote.vote === "approve"
                        ? "green"
                        : vote.vote === "reject"
                        ? "red"
                        : "gray",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "8px"
                  }}
                >
                  {vote.vote}
                </span>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default VotingRecords;
