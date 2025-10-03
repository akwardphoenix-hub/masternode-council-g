// CouncilDashboard.jsx - Main dashboard for Spark Governance App
// Imports council.json and fetchBillData, manages navigation and state
import React, { useEffect, useState } from "react";
import councilData from "../data/council.json";
import proposalsData from "../data/council-proposals.json";
import votesData from "../data/council-votes.json";
import auditData from "../data/audit-log.json";
import { fetchBillData } from "../services/congressApi";
import ProposalCard from "./ProposalCard";
import VotingRecords from "./VotingRecords";

const API_KEY = "API_KEY"; // <-- Replace with real key if available

const TABS = ["Proposals", "Votes", "Audit Log"];

export default function CouncilDashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [proposals, setProposals] = useState([]);
  const [billMeta, setBillMeta] = useState({});

  useEffect(() => {
    // Load proposals - first try new format, fallback to old
    async function loadProposals() {
      const propList = proposalsData.length > 0 ? proposalsData : (councilData["council-proposals"] || []);
      setProposals(propList);
      // Fetch bill metadata for each proposal if they have bill info
      const meta = {};
      for (const p of propList) {
        if (p.bill) {
          const bill = p.bill;
          meta[p.proposal_id] = await fetchBillData(bill.congress, bill.billType, bill.billNumber, API_KEY);
        }
      }
      setBillMeta(meta);
    }
    loadProposals();
  }, []);

  // Helper: Format date safely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleString();
  };

  // Use new format votes if available, fallback to old format
  const votes = votesData.length > 0 ? votesData : (councilData["council-votes"]?.[0]?.votes || []);
  const stanceCounts = votes.reduce((acc, v) => {
    const stance = v.vote || v.stance;
    acc[stance] = (acc[stance] || 0) + 1;
    return acc;
  }, {});

  // Use new format audit log if available, fallback to old format
  const auditLog = auditData.length > 0 ? auditData : (councilData["audit-log"] || []);

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
          {proposals.map(p => {
            const key = p.id || p.proposal_id;
            return (
              <ProposalCard key={key} proposal={p} billMeta={billMeta[key]} />
            );
          })}
        </div>
      )}
      {activeTab === "Votes" && (
        <div className="bg-white rounded shadow p-4">
          <VotingRecords votes={votes} proposals={proposals} />
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Vote Summary</h3>
            <ul>
              {Object.entries(stanceCounts).map(([stance, count]) => (
                <li key={stance} className="mb-1">
                  <span className="font-semibold capitalize">{stance}:</span> {count}
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
            {auditLog.map((e, i) => {
              const action = e.action || e.event || "unknown";
              const actor = e.node || e.actor || "unknown";
              return (
                <li key={i} className="mb-2 text-sm">
                  <span className="font-semibold">{action.replace(/_/g, " ")}</span> - {actor} - {e.proposal_id || ""} {e.stance ? `- ${e.stance}` : ""} @ {formatDate(e.timestamp)}
                  {e.details && <div className="text-gray-600 ml-4">{e.details}</div>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
