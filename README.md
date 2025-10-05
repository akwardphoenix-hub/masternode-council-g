# Masternode Council Governance App

[![Build Status](https://github.com/akwardphoenix-hub/masternode-council-g/workflows/e2e/badge.svg)](https://github.com/akwardphoenix-hub/masternode-council-g/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)

A professional-grade, decentralized governance platform for managing proposals, voting mechanisms, and maintaining transparent audit trails across distributed nodes.

> **Ethical & Open Source**: Built with transparency, community collaboration, and educational purposes in mind. See [LEGAL.md](./LEGAL.md) for full details.

## Offline Dev / Tests
- This repo is configured for **offline-first** development.
- All data loads from `/public/data/*.json`.
- To run:
  - `npm ci`
  - `npx playwright install chromium`
  - `npm run build && npm run test:e2e`

If you see firewall blocks (esm.ubuntu.com, api.github.com), that's expected in the agent sandbox. The **copilot-setup-steps** pre-installs what it needs before firewall rules apply.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

All E2E tests run **fully offline** using mocked data - zero external network calls required.

#### Quick Start (Always Offline)

```bash
# 1. Install dependencies (one-time, requires network)
npm install
npx playwright install chromium

# 2. Build with mocks (offline)
USE_MOCKS=1 npm run build

# 3. Run E2E tests (offline)
USE_MOCKS=1 npm run test:e2e
```

#### Test Environment Configuration

The repository includes a `.env.test` file that automatically enables offline mode:

```bash
# .env.test
VITE_OFFLINE=true
VITE_USE_MOCKS=1
NODE_ENV=test
USE_MOCKS=1
```

This ensures all external network calls (including `esm.ubuntu.com`, `api.github.com`, and Congress.gov) are automatically mocked.

#### All Test Commands (Always use `USE_MOCKS=1`)

```bash
# Run all E2E tests (offline)
USE_MOCKS=1 npm run test:e2e

# Run tests for CI with dot reporter (offline)
USE_MOCKS=1 npm run test:ci

# Run tests with interactive UI (offline)
USE_MOCKS=1 npm run test:ui

# View test report
npm run test:report
```

**Testing Approach:**
- **Always offline**: Set `USE_MOCKS=1` or `VITE_OFFLINE=true` for all builds and tests
- Tests run against the built `/dist` folder (not dev server)
- All external API calls are mocked via `/config/mock.config.ts`
- Zero network requests to Congress.gov, GitHub API, esm.ubuntu.com, or any external services
- Tests use `domcontentloaded` instead of `networkidle` to prevent loops
- Works perfectly behind firewalls after initial setup
- See [OFFLINE-TESTING.md](./OFFLINE-TESTING.md) for detailed documentation

## 📋 Features

### ✅ Proposal Management
- Submit governance proposals with detailed descriptions
- Track proposal status (pending, active, approved, rejected)
- View complete proposal history

### ✅ Voting System
- Cast votes: Approve, Reject, or Abstain
- Real-time vote counting
- Duplicate vote prevention
- Transparent voting records

### ✅ Audit Trail
- Immutable log of all council actions
- Timestamp tracking for every event
- Actor information for accountability
- Complete governance history

### ✅ Council Dashboard
- Overview of active proposals
- Statistics and metrics
- Recent votes display
- Quick access to all features

## 🧪 Testing

This project includes comprehensive end-to-end tests covering:
- Proposal creation and management
- Complete voting workflows
- Audit log generation and display
- Dashboard functionality
- Production build validation
- Accessibility and performance

See [TESTING.md](./TESTING.md) for detailed testing documentation.

### E2E Testing Configuration

All tests run **completely offline** without any external network dependencies:

**Standard Test Run:**
```bash
npm ci
npx playwright install chromium
npm run build
USE_MOCKS=1 npm run test:e2e
```

**CI Mode (faster feedback):**
```bash
USE_MOCKS=1 npm run test:ci
```

**Interactive Mode:**
```bash
USE_MOCKS=1 npm run test:ui
```

**View Reports:**
```bash
npm run test:report
```

**Mock Configuration:**
- Mock data is defined in `/config/mock.config.ts`
- Mocks are activated by setting `USE_MOCKS=1` environment variable
- Mock files are served from `/public/mocks/*.json` (copied to `/dist/mocks/` during build)
- All API services check `shouldUseMocks()` before making external calls

## 🏗️ Pre-Publish Validation

Before publishing, run the comprehensive validation:

```bash
./scripts/pre-publish-check.sh
```

This validates:
- TypeScript compilation
- Build artifacts
- Security checks
- End-to-end tests
- Production readiness

## 📁 Project Structure

```
├── e2e/                    # End-to-end tests
├── src/
│   ├── components/        # React components
│   │   └── ui/           # UI components
│   ├── services/         # API services
│   ├── hooks/            # Custom React hooks
│   └── App.tsx           # Main application
├── scripts/              # Build and validation scripts
├── playwright.config.ts  # Test configuration
└── TESTING.md           # Testing documentation
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **UI**: Radix UI, Tailwind CSS
- **State**: GitHub Spark KV Storage
- **Testing**: Playwright
- **Build**: Vite

## 📚 Documentation

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and standards
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** - Community standards
- **[SECURITY.md](./SECURITY.md)** - Security policy and reporting
- **[LEGAL.md](./LEGAL.md)** - Legal information, licensing, and disclaimers
- [PRD.md](./PRD.md) - Product Requirements Document
- [TESTING.md](./TESTING.md) - Comprehensive Testing Guide
- [OFFLINE-TESTING.md](./OFFLINE-TESTING.md) - Offline Testing Guide
- [e2e/README.md](./e2e/README.md) - End-to-End Test Documentation

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:
- Code of Conduct
- Development workflow
- Coding standards
- Testing requirements
- Pull request process

Quick start:
1. Fork and create a feature branch
2. Make your changes following our [coding standards](./CONTRIBUTING.md#coding-standards)
3. Write/update tests: `npm run test:e2e`
4. Lint your code: `npm run lint`
5. Submit a pull request with clear description

## ⚖️ Governance Philosophy

This project follows **Harmonic Math** principles for collaborative development:
- **1 = Self**: Individual contributions and agency
- **2 = Other**: Mutual respect and collaboration
- **3 = We**: Community consensus building
- **4 = Council**: Structured decision-making

We believe in **transparency**, **accountability**, and **ethical open-source development**.

## 🌟 Ethical Stance

- **100% Open Source** - All code is publicly available
- **Non-Commercial Philosophy** - Built for community benefit and education
- **Privacy First** - No data collection, no tracking, no cookies
- **Transparent Governance** - All decisions documented and public
- **Educational Mission** - Designed to teach and demonstrate governance concepts

See [LEGAL.md](./LEGAL.md) for complete details on licensing, privacy, and ethical commitments.

## 📄 License

MIT License - Copyright © 2024

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

See [LICENSE](./LICENSE) and [LEGAL.md](./LEGAL.md) for full legal information.
