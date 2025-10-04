// mergedLoader.js - Service for loading council data
import councilProposals from "../data/council-proposals.json";
import councilData from "../data/council.json";
import auditLog from "../data/audit-log.json";

export async function loadCouncilData() {
  // Merge data from different JSON files
  const proposals = councilProposals || [];
  const votes = councilData["council-votes"] || [];
  const audit = auditLog || [];

  return {
    proposals,
    votes,
    auditLog: audit
  };
}
