// Congress API Service for Spark Governance App
// Replace API_KEY with your actual key if available
export async function fetchBillData(congress, billType, billNumber, apiKey = "API_KEY") {
  const endpoint = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}`;
  try {
    const res = await fetch(endpoint, {
      headers: {
        "X-Api-Key": apiKey
      }
    });
    if (!res.ok) {
      // Graceful error handling: return minimal fallback
      return { error: `Congress.gov API error: ${res.status}` };
    }
    const data = await res.json();
    // Congress.gov returns nested bill data; extract useful fields
    return {
      title: data.title || "N/A",
      sponsor: data.sponsor || "N/A",
      introducedDate: data.introducedDate || "N/A",
      latestAction: data.latestAction || "N/A"
    };
  } catch (err) {
    // Fallback for network/API issues
    return { error: err.message || "Unknown error" };
  }
}
