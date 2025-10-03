// mergedLoader.js - Service to load council data from JSON files
import proposalsData from "../data/council-proposals.json";
import votesData from "../data/council-votes.json";
import auditData from "../data/audit-log.json";

export async function loadCouncilData() {
  // Return the data in a format compatible with the Dashboard component
  return {
    proposals: proposalsData,
    votes: votesData,
    auditLog: auditData
  };
}
