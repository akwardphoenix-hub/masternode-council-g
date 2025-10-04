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

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
# Option 1: Standard installation
npx playwright install chromium

# Option 2: If standard installation fails, use our helper script
./scripts/install-playwright-browsers.sh

# Run all end-to-end tests
npm run test:e2e

# Run tests with UI (interactive)
npm run test:e2e:ui

# View test report
npm run test:report
```

**Note:** If you encounter issues installing Playwright browsers, see the [TESTING.md](./TESTING.md) troubleshooting guide.

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
- [e2e/README.md](./e2e/README.md) - End-to-End Test Documentation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run `npm run test:e2e` to verify
5. Submit a pull request

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
