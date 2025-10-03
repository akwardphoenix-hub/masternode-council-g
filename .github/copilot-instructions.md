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
- Test: `npm run test`

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
