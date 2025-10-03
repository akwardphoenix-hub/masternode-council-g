---
applyTo: "src/components/*.jsx"
---

## React Component Guidelines
1. All components must be functional (React hooks, not class components).
2. Props should be typed with TypeScript interfaces.
3. Prefer small composable components over monoliths.
4. Handle async state updates safely (`useEffect`, `useState`).
5. Write clear UI states: loading, error, success.
6. When modifying ProposalCard, always ensure votes → audit integration.
