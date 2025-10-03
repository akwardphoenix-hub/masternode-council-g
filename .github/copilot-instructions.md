# Masternode Council Governance System – Copilot Instructions

This repository is the **Brave Codex + Masternode Council Governance System**, powered by harmonizer math and modular node logic.

## Development Flow
- Build: `npm run build`
- Dev server: `npm run dev`
- Test: `npm test`
- Lint: `npm run lint`

## Core Logic
- **Nodes & Masternodes**: Every proposal/vote/audit maps to a node. Masternodes arbitrate balance + fairness.
- **Brave Codex Harmonic Math**: Always apply repair-first + harmonic balance when resolving conflicts. Favor transparency (audit logs) and resilience (fallback states).
- **Audit Integrity**: Every vote or proposal submission must also generate an `audit-log` entry with timestamp + actor.
- **UI/UX**: Minimalist, modular, cards-based React components.

## Coding Standards
1. Use TypeScript for type safety (`src/*.tsx`).
2. Proposals: must include `id`, `title`, `description`, `author`, `status`, `createdAt`.
3. Votes: must include `proposalId`, `voter`, `vote`, `timestamp`.
4. AuditLog: must include `action`, `actor`, `timestamp`, `details`.

## File Structure
- `src/components/` → UI components (`Dashboard.jsx`, `ProposalCard.jsx`, etc.)
- `src/services/` → Data loaders + API bridges
- `public/data/*.json` → Local proposal, vote, audit log data (temporary)
