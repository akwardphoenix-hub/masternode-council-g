# Masternode Council Governance App

A decentralized governance platform for managing proposals, voting mechanisms, and maintaining transparent audit trails across distributed nodes.

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
- **Always offline**: Set `USE_MOCKS=1` for all builds and tests
- Tests run against the built `/dist` folder (not dev server)
- All external API calls are mocked via `/config/mock.config.ts`
- Zero network requests to Congress.gov, GitHub API, or any external services
- Tests use `domcontentloaded` instead of `networkidle` to prevent loops
- Works perfectly behind firewalls after initial setup

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

- [PRD.md](./PRD.md) - Product Requirements Document
- [TESTING.md](./TESTING.md) - Comprehensive Testing Guide
- [OFFLINE-TESTING.md](./OFFLINE-TESTING.md) - **Offline Testing Guide (No External Network Required)**
- [e2e/README.md](./e2e/README.md) - End-to-End Test Documentation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run `npm run test:e2e` to verify
5. Submit a pull request

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
