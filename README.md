# Masternode Council Governance System

**Powered by the Brave Codex** — A decentralized governance platform for managing proposals, voting, and transparent audit trails across distributed nodes.

## 🎯 Core Philosophy

This system is built on the principles of the **Brave Codex**:
- **Harmony Math**: Balance between all proposals, votes, and nodes
- **Repair-First**: Prefer fixes and audit trails over deletions
- **Transparency**: Complete audit trail for every action
- **Democratic Governance**: Equal voting rights with structured processes
- **Resilience**: Graceful degradation under failure

→ **Read [`BRAVE_CODEX.md`](./BRAVE_CODEX.md) for the complete philosophical foundation**

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm (comes with Node.js)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Commands
```bash
npm run dev      # Start dev server with hot reload (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
masternode-council-g/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Dashboard.jsx
│   │   ├── ProposalCard.jsx
│   │   └── ...
│   ├── services/         # Data loaders & API bridges
│   └── App.tsx          # Main application
├── public/
│   └── data/            # Local JSON data (temporary)
├── .github/
│   ├── instructions/    # Path-specific Copilot instructions
│   │   ├── react-components.instructions.md
│   │   └── tests.instructions.md
│   ├── copilot-instructions.md
│   └── copilot-setup-steps.yml
├── BRAVE_CODEX.md       # System philosophy & math
├── PRD.md               # Product requirements
└── README.md            # This file
```

## 🤖 For AI Assistants & Copilot

This repository has comprehensive instructions for AI-assisted development:

1. **General Instructions**: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)
   - Core logic and coding standards
   - Development flow
   - Audit integrity requirements

2. **Path-Specific Instructions**:
   - React Components: [`.github/instructions/react-components.instructions.md`](./.github/instructions/react-components.instructions.md)
   - Testing: [`.github/instructions/tests.instructions.md`](./.github/instructions/tests.instructions.md)

3. **System Philosophy**: [`BRAVE_CODEX.md`](./BRAVE_CODEX.md)
   - Harmony math formulas
   - Repair-first patterns
   - Implementation examples

4. **Environment Setup**: [`.github/copilot-setup-steps.yml`](./.github/copilot-setup-steps.yml)
   - Dependency installation
   - Troubleshooting guide
   - Validation checklist

## 🛠 Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Phosphor Icons
- **State Management**: @github/spark hooks (useKV)
- **Notifications**: Sonner

## 📊 Core Features

### Proposal Management
- Submit, view, and track governance proposals
- Detailed descriptions with Congress.gov bill integration
- Status tracking: pending → active → approved/rejected/closed

### Voting System
- Democratic voting: approve, reject, or abstain
- All votes carry equal weight
- Abstentions are logged and respected
- Real-time vote tallies

### Audit Trail
- Immutable log of all council actions
- Every action includes: timestamp, actor, action, details
- Complete transparency and accountability

## 🧪 Testing

```bash
npm test              # Run tests
npm test -- --watch   # Run tests in watch mode
npm test -- --coverage # Run tests with coverage
```

See [`.github/instructions/tests.instructions.md`](./.github/instructions/tests.instructions.md) for testing conventions.

## 🎨 Styling Conventions

- **Mobile-first**: Responsive design with Tailwind
- **Component-based**: shadcn/ui for consistent UI
- **Card layouts**: Visual hierarchy with Card components
- **Icons**: Phosphor Icons for all iconography

See [`.github/instructions/react-components.instructions.md`](./.github/instructions/react-components.instructions.md) for detailed styling rules.

## 📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
