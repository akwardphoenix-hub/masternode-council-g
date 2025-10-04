// Offline fetch shim: when VITE_OFFLINE=1, intercept fetch requests that
// would normally call APIs and serve bundled fixtures instead.

// @ts-ignore: Vite supports JSON imports
import proposals from '../fixtures/proposals.json'
// @ts-ignore
import votes from '../fixtures/votes.json'
// @ts-ignore
import audit from '../fixtures/audit-log.json'

if (import.meta.env.VITE_OFFLINE === '1') {
  // Import fixtures from src so they are bundled.
  // Point to your real fixture shapes if different.
  // If your repo already has these JSONs elsewhere, adjust paths here accordingly.
  // Minimal safe defaults:
  //  - proposals: array of { id, title, description, createdAt, votingEndsAt }
  //  - votes: array of { proposalId, voter, choice, createdAt }
  //  - audit: array of { id, actor, action, targetId, createdAt }

  const routes: Record<string, any> = {
    '/api/proposals': proposals,
    '/api/votes': votes,
    '/api/audit': audit,
  }

  const originalFetch = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = typeof input === 'string' ? input : input.toString()
      const path = url.replace(/^https?:\/\/[^/]+/, '') // strip origin
      if (routes[path]) {
        return new Response(JSON.stringify(routes[path]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } catch {
      // fallthrough to original
    }
    // Block true network calls in OFFLINE mode to avoid firewall errors
    // by returning a 204 for any unknown external fetch.
    if (/^https?:\/\//.test(String(input))) {
      return new Response(null, { status: 204 })
    }
    return originalFetch(input, init)
  }

  console.log('[OFFLINE] fetch shim active: serving bundled fixtures.')
}
