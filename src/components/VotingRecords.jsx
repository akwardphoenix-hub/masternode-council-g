import React from "react";

function VotingRecords({ votes, proposals }) {
  return (
    <div className="voting-records">
      <h2>Voting Records</h2>
      {votes.length === 0 ? (
        <p>No votes recorded yet.</p>
      ) : (
        votes.map((vote, idx) => {
          const proposal = proposals.find(p => p.id === vote.proposalId);
          return (
            <div key={idx} className="vote-card">
              <p>
                <strong>{proposal ? proposal.title : "Unknown Proposal"}</strong>
              </p>
              <p>{new Date(vote.timestamp).toLocaleString()}</p>
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
