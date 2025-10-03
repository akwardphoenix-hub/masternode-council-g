// ProposalCard.jsx - Displays individual proposal details
// Expand props and Congress.gov fields as needed
import React from "react";

export default function ProposalCard({ proposal, billMeta }) {
  // Format date safely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString();
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow mb-4">
      <h3 className="text-lg font-bold mb-1">{proposal.title}</h3>
      <div className="text-sm text-gray-600 mb-2">By {proposal.author} | Submitted: {formatDate(proposal.date_submitted)}</div>
      <div className="mb-2">Status: <span className="font-semibold">{proposal.status}</span></div>
      <div className="mb-2">
        <span className="font-semibold">Congress.gov Bill:</span> <a href={proposal.bill.api_endpoint} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{proposal.bill.billType.toUpperCase()} {proposal.bill.billNumber} ({proposal.bill.congress})</a>
      </div>
      {/* Congress.gov Metadata */}
      <div className="bg-gray-50 p-2 rounded">
        <div><span className="font-semibold">Title:</span> {billMeta?.title || "N/A"}</div>
        <div><span className="font-semibold">Sponsor:</span> {billMeta?.sponsor || "N/A"}</div>
        <div><span className="font-semibold">Introduced:</span> {formatDate(billMeta?.introducedDate)}</div>
        <div><span className="font-semibold">Latest Action:</span> {billMeta?.latestAction || "N/A"}</div>
      </div>
    </div>
  );
}
