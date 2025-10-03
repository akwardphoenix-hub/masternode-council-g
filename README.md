# Masternode Council Governance App ⚖️

A decentralized governance application for masternode councils to manage proposals, voting, and maintain an audit trail of all governance actions.

## 🚀 Features

- **Proposal Management**: Submit, review, and manage governance proposals
- **Voting System**: Cast votes (approve/reject/abstain) on proposals with duplicate prevention
- **Audit Trail**: Complete audit log of all governance actions with timestamps
- **Dashboard Statistics**: Real-time metrics and voting statistics
- **Data Persistence**: All data persists across sessions using local storage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Playwright** for E2E testing

## 📦 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

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

## 🧪 Testing

The app includes a comprehensive E2E test suite with **50 tests** across 7 test files.

### Run Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run all tests
npm run test:e2e

# Run tests with interactive UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:report
```

### Pre-Publish Validation

Before deploying, run the comprehensive validation script:

```bash
./scripts/pre-publish-check.sh
```

This validates:
- Dependencies and build
- Code quality and security
- All E2E tests (50 tests)
- Production readiness

### Test Coverage

- ✅ Application loading and navigation
- ✅ Proposal creation and management
- ✅ All voting mechanisms
- ✅ Audit trail logging
- ✅ Dashboard statistics
- ✅ Complete user workflows
- ✅ Production build validation

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 📚 Documentation

- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide
- **[TEST-SUMMARY.md](./TEST-SUMMARY.md)** - Test coverage overview
- **[PUBLISH-CHECKLIST.md](./PUBLISH-CHECKLIST.md)** - Pre-publish validation checklist
- **[e2e/README.md](./e2e/README.md)** - Quick E2E test reference

## 🏗️ Project Structure

```
masternode-council-g/
├── src/
│   ├── App.tsx              # Main application component
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions
│   └── styles/              # Global styles
├── e2e/                     # E2E test suites (50 tests)
│   ├── 01-app-loads.spec.ts
│   ├── 02-proposal-management.spec.ts
│   ├── 03-voting-system.spec.ts
│   ├── 04-audit-trail.spec.ts
│   ├── 05-dashboard-stats.spec.ts
│   ├── 06-end-to-end-workflows.spec.ts
│   ├── 07-build-production.spec.ts
│   └── README.md
├── scripts/
│   └── pre-publish-check.sh # Validation script
├── .github/
│   └── workflows/
│       └── test.yml         # CI/CD pipeline
├── playwright.config.ts     # Test configuration
└── README.md
```

## 🔄 Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Make your changes**

3. **Run tests**
   ```bash
   npm run test:e2e:ui
   ```

4. **Build and validate**
   ```bash
   npm run build
   ./scripts/pre-publish-check.sh
   ```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Deployment Checklist

Use the [PUBLISH-CHECKLIST.md](./PUBLISH-CHECKLIST.md) to ensure production readiness:

- [ ] All tests pass (50/50)
- [ ] Build completes successfully
- [ ] No console errors
- [ ] Performance validated
- [ ] Responsive design tested
- [ ] Documentation updated

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add/update tests as needed
4. Run test suite: `npm run test:e2e`
5. Submit a pull request

All pull requests must:
- Pass all E2E tests
- Include tests for new features
- Follow existing code style
- Update documentation

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🔗 CI/CD

Tests run automatically via GitHub Actions on:
- Push to `main` branch
- Pull requests

View build status and test results in the [Actions](https://github.com/akwardphoenix-hub/masternode-council-g/actions) tab.

---

**Production Ready**: This application has been thoroughly tested with 50 automated E2E tests covering all critical workflows. 🚀
