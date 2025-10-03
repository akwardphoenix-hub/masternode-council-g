// src/services/congressService.js
// Service layer for fetching data from Congress.gov API

const BASE_URL = "https://api.congress.gov/v3";
const API_KEY = import.meta.env.VITE_CONGRESS_API_KEY; // keep your key in .env

// Fetch bills
export async function fetchBills(limit = 10) {
  try {
    const response = await fetch(`${BASE_URL}/bill?api_key=${API_KEY}&limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch bills");
    const data = await response.json();
    return data.bills || [];
  } catch (err) {
    console.error("Error fetching bills:", err);
    return [];
  }
}

// Fetch a single bill by ID
export async function fetchBillById(billId) {
  try {
    const response = await fetch(`${BASE_URL}/bill/${billId}?api_key=${API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch bill details");
    return await response.json();
  } catch (err) {
    console.error(`Error fetching bill ${billId}:`, err);
    return null;
  }
}

// Example: hook to map Congress.gov data into your council-proposals JSON format
export function mapBillToProposal(bill) {
  return {
    proposal_id: `bill-${bill.number}`,
    title: bill.title || "Untitled Bill",
    author: bill.sponsor?.name || "Unknown",
    date_submitted: bill.introducedDate || new Date().toISOString(),
    description: bill.title || "No description available",
    status: bill.latestAction?.text || "pending",
    congress_url: bill.url || "",
  };
}
