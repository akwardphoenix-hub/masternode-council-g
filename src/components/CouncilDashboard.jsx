// CouncilDashboard.jsx - Main dashboard for Spark Governance App
// Imports council.json and fetchBillData, manages navigation and state
import React, { useEffect, useState } from "react";
import councilData from "../data/council.json";
import { fetchBillData } from "../services/congressApi";
import ProposalCard from "./ProposalCard";

const API_KEY = "API_KEY"; // <-- Replace with real key if available

const TABS = ["Proposals", "Votes", "Audit Log"];

export default function CouncilDashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [proposals, setProposals] = useState([]);
  const [votes, setVotes] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    // Load proposals
    const propList = councilData["council-proposals"] || [];
    setProposals(propList);
    
    // Load votes and audit log
    setVotes(councilData["council-votes"] || []);
    setAuditLog(councilData["audit-log"] || []);
  }, []);

  // Helper: Format date safely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleString();
  };

  // Handle vote casting
  const handleVote = (proposalId, vote) => {
    const newVote = {
      proposalId,
      voter: "node-alpha", // replace with real user context later
      vote,
      timestamp: new Date().toISOString()
    };

    // Update votes
    setVotes(prev => [...prev, newVote]);

    // Update audit log
    const newAuditEntry = {
      logId: `log-${Date.now()}`,
      action: "vote_cast",
      actor: "node-alpha",
      proposalId,
      timestamp: new Date().toISOString(),
      details: `Vote recorded as ${vote.toUpperCase()}`
    };
    setAuditLog(prev => [...prev, newAuditEntry]);
  };

  // Votes stance counts
  const allVotes = votes.flatMap(v => v.votes || []);
  const stanceCounts = allVotes.reduce((acc, v) => {
    acc[v.stance] = (acc[v.stance] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold border-b-2 ${activeTab === tab ? "border-blue-500 text-blue-700" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Proposals" && (
        <div>
          {proposals.map(p => (
            <ProposalCard key={p.id} proposal={p} onVote={handleVote} />
          ))}
        </div>
      )}
      {activeTab === "Votes" && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-2">Votes</h2>
          <ul>
            {Object.entries(stanceCounts).map(([stance, count]) => (
              <li key={stance} className="mb-1">
                <span className="font-semibold capitalize">{stance}:</span> {count}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Vote Details</h3>
            <ul>
              {allVotes.map((v, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {v.node}: <span className="capitalize">{v.stance}</span> @ {formatDate(v.timestamp)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {activeTab === "Audit Log" && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-2">Audit Log</h2>
          <ul>
            {auditLog.map((e, i) => (
              <li key={i} className="mb-2 text-sm">
                <span className="font-semibold">{e.event.replace("_", " ")}</span> - {e.actor} - {e.proposal_id} - {e.stance ? e.stance : ""} @ {formatDate(e.timestamp)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
