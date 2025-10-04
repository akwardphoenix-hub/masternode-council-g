// ProposalCard.jsx - Displays individual proposal details
// Expand props and Congress.gov fields as needed
import React from "react";

export default function ProposalCard({ proposal, onVote }) {
  // Format date safely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString();
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow mb-4">
      <h3 className="text-lg font-bold mb-1">{proposal.title}</h3>
      <p className="text-gray-700 mb-2">{proposal.description}</p>
      <p className="text-sm text-gray-600 mb-1"><strong>Author:</strong> {proposal.author}</p>
      <p className="text-sm text-gray-600 mb-1"><strong>Status:</strong> {proposal.status}</p>
      <p className="text-sm text-gray-600 mb-3"><strong>Created:</strong> {formatDate(proposal.createdAt)}</p>

      {onVote && (
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => onVote(proposal.id, 'approve')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            ✅ Approve
          </button>
          <button 
            onClick={() => onVote(proposal.id, 'reject')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            ❌ Reject
          </button>
          <button 
            onClick={() => onVote(proposal.id, 'abstain')}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            ⚪ Abstain
          </button>
        </div>
      )}
    </div>
  );
}
