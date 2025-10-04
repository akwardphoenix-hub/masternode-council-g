# Copilot Repo Instructions – Brave Codex / Harmonic Math

## Project Context
This repo implements the **Council App** with proposals, votes, and audit logs.  
Architecture is inspired by **Brave Codex** and **Harmonic Math**:
- Proposals = nodes
- Votes = flows
- Audit log = council memory

## Development Flow
- Run: `npm run dev` (Vite)
- Build: `npm run build`
- Build (offline mode): `npm run build:offline`
- Test: `npm run test:e2e`
- Test (offline mode): `npm run test:e2e:offline`

## Offline Mode for Copilot Agent
**Environment:**
- Use Node 20, Playwright Chromium.
- Prefer OFFLINE mode inside agent sandboxes:
  - Build: `VITE_OFFLINE=1 npm run build`
  - Test: `OFFLINE_E2E=1 VITE_OFFLINE=1 npm run test:e2e`
- Do **not** start HTTP servers in sandboxes (firewall). Never run `vite preview` or `vite dev` in CI tasks.

**Code Conventions:**
- TypeScript strict.
- React (function components) + Vite.
- E2E: Use `e2e/utils.ts` helpers:
  - `await blockExternal(page)` then `await page.goto(indexUrl())`.

**Fixtures & Data:**
- When `VITE_OFFLINE=1`, the app uses `src/offline/shim.ts` to serve:
  - `/api/proposals`, `/api/votes`, `/api/audit` from bundled JSON in `src/fixtures/*`.
- When online, use normal data service code paths.

**Tasks Examples:**
- Add new E2E tests → **don't** rely on HTTP servers; target `indexUrl()`.
- Update fixtures → modify `src/fixtures/*.json` and keep shape consistent with UI.
- Add more routes to the offline shim if the app fetches additional endpoints.

**Do not:**
- Attempt to fetch external URLs in tests.
- Depend on runtime package installs after firewall activates.

## Coding Standards
1. Always align JSON schemas with TypeScript interfaces.
   - Proposal fields: `id`, `createdAt` (ISO 8601), `votingEndsAt`, `description`.
   - Vote fields: `proposalId`, `actor`, `vote`, `timestamp`.
   - Audit fields: `id`, `action`, `actor`, `timestamp`, `details`.

2. Every action (vote, new proposal) must create an audit log entry.

3. Apply **Harmonic Math** principle:
   - 1 = self, 2 = other, 3 = we, 4 = council.
   - Build features around collaboration, not isolation.

4. UI/UX
   - Dates: format with `toLocaleString()`.
   - Buttons: Green ✅ Approve, Red ❌ Reject, Gray ⚪ Abstain.
   - Always show counts and summary.

## File Layout
- `src/components/ProposalCard.jsx` – proposal rendering & voting.
- `src/components/CouncilDashboard.jsx` – dashboard aggregation.
- `src/utils/audit.ts` – audit log helper.
- `public/data/*.json` – council data (proposals, votes, audit log).

## Test Checklist
- Rendering shows proposals without errors.
- Clicking vote updates both `votes.json` and `audit-log.json`.
- Audit entries always have `ISO` timestamp + unique ID.
- Build must pass without warnings.

⚖️ Principle: **Repair before build.** If schema mismatch → fix JSON before adding features.
