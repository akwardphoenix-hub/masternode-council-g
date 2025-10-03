import { useEffect, useState } from "react";
import { loadCouncilData } from "./services/mergedLoader";

function Dashboard() {
  const [data, setData] = useState({ proposals: [], votes: [], auditLog: [] });

  useEffect(() => {
    loadCouncilData().then(setData);
  }, []);

  return (
    <div>
      <h1>Masternode Council</h1>
      <p>Total Proposals: {data.proposals.length}</p>
      <p>Total Votes: {data.votes.length}</p>
      <p>Audit Entries: {data.auditLog.length}</p>
    </div>
  );
}

export default Dashboard;
