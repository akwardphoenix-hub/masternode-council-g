import { useEffect, useState } from "react";
import { loadCouncilData } from "../services/mergedLoader";

function Dashboard() {
  const [data, setData] = useState({
    proposals: [],
    votes: [],
    auditLog: []
  });

  useEffect(() => {
    loadCouncilData().then(setData);
  }, []);

  return (
    <div className="dashboard">
      <h1>Masternode Council</h1>

      <div className="stats">
        <div className="card">
          <h3>Total Proposals</h3>
          <p>{data.proposals.length}</p>
        </div>
        <div className="card">
          <h3>Total Votes</h3>
          <p>{data.votes.length}</p>
        </div>
        <div className="card">
          <h3>Audit Entries</h3>
          <p>{data.auditLog.length}</p>
        </div>
      </div>

      <h2>Council Proposals</h2>
      <ul>
        {data.proposals.map((p) => (
          <li key={p.proposal_id}>
            <strong>{p.title}</strong> <br />
            {p.description} <br />
            <em>
              By {p.author} on{" "}
              {p.date_submitted
                ? new Date(p.date_submitted).toLocaleDateString()
                : "Unknown date"}
            </em>
            <br />
            {p.congress_url && (
              <a href={p.congress_url} target="_blank" rel="noreferrer">
                View on Congress.gov
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
