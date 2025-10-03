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

## Path-Specific Instructions

When editing specific types of files, refer to these detailed instructions:

- **React Components** (`src/components/*.tsx`, `src/components/*.jsx`):
  → See `.github/instructions/react-components.instructions.md`
  - Props and state management conventions
  - Tailwind CSS and shadcn/ui styling rules
  - Phosphor icons usage
  - Audit logging patterns

- **Tests** (`src/**/*.test.tsx`, `src/__tests__/**`):
  → See `.github/instructions/tests.instructions.md`
  - Unit and integration test structure
  - Testing user interactions and state changes
  - Mocking patterns and fixtures
  - Brave Codex-specific test cases

## Brave Codex Integration

**CRITICAL**: The soul of this system is documented in `BRAVE_CODEX.md` at the repository root.

Always align your code with these core principles:

1. **Harmony Math**: Balance between proposals, votes, and nodes
   - Calculate vote distributions (approve/reject/abstain)
   - Respect abstentions as valid participation
   - Maintain equal weight for all nodes

2. **Repair-First Ethic**: Prefer fixes and audit trails over deletions
   - Archive instead of delete
   - Validate before mutating
   - Provide fallback states
   - Log all state changes

3. **Transparency**: Complete audit trail for all actions
   - Every vote/proposal creates an audit entry
   - Include timestamp, actor, and action details
   - Make history queryable and visible

4. **Council Governance**: Democratic yet structured
   - All nodes have equal voting rights
   - Abstentions are logged and respected (don't affect approve/reject ratio)
   - Proposals follow: pending → active → (approved|rejected|closed)

5. **Resilience**: Graceful degradation under failure
   - Handle errors without crashing
   - Provide clear recovery paths
   - Continue core functionality even when ancillary features fail

→ **Read `BRAVE_CODEX.md` for detailed examples, math formulas, and implementation patterns**

## Environment Setup

For complete environment setup instructions, see `.github/copilot-setup-steps.yml`:
- Node.js and dependency installation
- Development and build commands
- Project structure requirements
- Troubleshooting common issues
- Validation checklist
