# Copilot Repo Instructions — Cascade Pack

**Project**: Masternode Council / Harmonizer / Uppercut City  
**Stack**: Vite + React + TypeScript + Tailwind/shadcn/ui + Playwright E2E  
**Policy**: No external network during tests. Use local fixtures/mocks only.

## Build & Test
- Install: `npm ci`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Unit (if present): `npm test`
- E2E (Chromium): `npm run test:e2e` (installs: `npx playwright install chromium`)
- Preview for E2E: `npm run preview` (baseURL http://localhost:4173)

## Conventions
- TypeScript strict. Functional React components. Avoid any.
- UI: shadcn/ui, Tailwind; accessible by default (roles, labels).
- State: keep components pure; move io/network to `/src/services`.
- Logging: Use `/src/lib/audit.ts` helpers; every vote/action writes an entry `{tsISO, actor, action, refId}`.
- Harmonic Math handling: never return raw NaN/∞; return `{ state: "pause"|"diverge"|"ok", value? }`.

## UI/UX Guidelines
- Dates: format with `toLocaleString()`.
- Buttons: Green ✅ Approve, Red ❌ Reject, Gray ⚪ Abstain.
- Always show counts and summary.

## Network Policy
- Tests/E2E must NOT depend on remote APIs. If a fetch is required, route to `/src/mocks/*` fixtures.
- Feature flag `VITE_OFFLINE=1` must force local JSON: `/public/data/*.json`.
- **Do not** add real network calls inside runtime code or tests.
  - Use local JSON files in `/data/` as stubs.
  - For package installs, use `devDependencies` only and lock versions.
- **When E2E or CI/CD tests need external URLs**, replace with mocks:
  - Example: `esm.ubuntu.com` → `mockSecurityUpdates.json`
  - `api.github.com` → `mockRuntime.json`

## Files to trust
- `/src/lib/config.ts` (flags + constants)
- `/src/services/*` (data layer)
- `/public/data/*.json` (local fixtures)
- `/e2e/*.spec.ts` (browser E2E)

## File Layout
- `src/components/ProposalCard.jsx` – proposal rendering & voting.
- `src/components/CouncilDashboard.jsx` – dashboard aggregation.
- `src/lib/audit.ts` – audit log helper.
- `public/data/*.json` – council data (proposals, votes, audit log).

## Test Checklist
- Rendering shows proposals without errors.
- Clicking vote updates both `votes.json` and `audit-log.json`.
- Audit entries always have `ISO` timestamp + unique ID.
- Build must pass without warnings.
- All tests must run with `--offline` mode.
- Add `VITE_OFFLINE=true` to `.env.test` to ensure no outbound requests.

## Done Definition (PRs)
- All scripts green: typecheck, lint, build, e2e
- No `console.log` left in app code
- Updated docs if behavior changed
- Summarize any added dependencies and network calls in a "Dependencies Added" section.

⚖️ Principle: **Repair before build.** If schema mismatch → fix JSON before adding features.

# 📝 Copilot Meta-Instructions for Masternode Council Repo

## Context
This repository implements a two-layer "masternode" system:
- Outer layer = public API & UI.
- Inner layer = user's node holding preferences/data.
- All runtime network calls must be mocked or stubbed in tests.

## Security Model
Treat each masternode like a sandbox. Don't assume shared state.

## Goal
Make the repo fully self-contained and pass all E2E tests in an offline environment.
