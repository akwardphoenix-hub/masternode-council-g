# Testing Documentation

This document describes the comprehensive end-to-end testing suite for the Masternode Council Governance App.

## Overview

The testing suite uses [Playwright](https://playwright.dev/) for end-to-end testing, covering all critical user workflows and ensuring the application is production-ready.

## Test Structure

Tests are organized in the `e2e/` directory:

```
e2e/
├── 01-app-loads.spec.ts           # Basic application loading tests
├── 02-proposal-management.spec.ts # Proposal creation and management
├── 03-voting-system.spec.ts       # Voting functionality tests
├── 04-audit-trail.spec.ts         # Audit log tracking tests
├── 05-dashboard-stats.spec.ts     # Dashboard statistics tests
├── 06-end-to-end-workflow.spec.ts # Complete user workflows
└── 07-build-production.spec.ts    # Production build validation
```

## Running Tests

### First Time Setup

**⚠️ IMPORTANT:** Before running tests for the first time:

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (REQUIRED)
npx playwright install chromium
```

> If you try to run tests without installing Playwright browsers, you'll get an error about missing browser executables. Simply run the `npx playwright install chromium` command to fix it.

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests with UI

```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (see browser)

```bash
npm run test:e2e:headed
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### View Test Report

```bash
npm run test:report
```

## Test Coverage

### 1. Application Loading (`01-app-loads.spec.ts`)
- ✅ Application loads successfully
- ✅ Main dashboard components are visible
- ✅ Navigation tabs are present
- ✅ Responsive layout works correctly
- ✅ Page title is set properly

### 2. Proposal Management (`02-proposal-management.spec.ts`)
- ✅ Create proposal button is displayed
- ✅ Proposal creation dialog opens
- ✅ Empty proposal validation works
- ✅ New proposals can be created successfully
- ✅ Proposal details are displayed correctly
- ✅ Proposal creation can be cancelled

### 3. Voting System (`03-voting-system.spec.ts`)
- ✅ Voting buttons are displayed on proposals
- ✅ Approve votes can be cast
- ✅ Reject votes can be cast
- ✅ Abstain votes can be cast
- ✅ Duplicate voting is prevented
- ✅ Vote counts are displayed correctly
- ✅ Voting records tab works

### 4. Audit Trail (`04-audit-trail.spec.ts`)
- ✅ Audit log tab navigation works
- ✅ Audit entries created when submitting proposals
- ✅ Audit entries created when casting votes
- ✅ Timestamps are displayed correctly
- ✅ Actor information is shown
- ✅ Entry details are visible
- ✅ Entries appear in chronological order

### 5. Dashboard Statistics (`05-dashboard-stats.spec.ts`)
- ✅ Statistics cards are displayed
- ✅ Numeric values are shown
- ✅ Proposal count updates after creation
- ✅ Vote count updates after voting
- ✅ Audit entries count updates after actions
- ✅ Status badges are displayed
- ✅ Icons are present
- ✅ Layout is consistent

### 6. End-to-End Workflows (`06-end-to-end-workflow.spec.ts`)
- ✅ Complete proposal lifecycle (create → vote → audit)
- ✅ Multiple proposals workflow
- ✅ Voting on multiple proposals
- ✅ Data consistency across tabs
- ✅ Rapid successive actions
- ✅ UI feedback for all actions
- ✅ Data persistence on page refresh

### 7. Production Build Validation (`07-build-production.spec.ts`)
- ✅ Proper meta tags
- ✅ CSS loads correctly
- ✅ No console errors on load
- ✅ 404 pages handled gracefully
- ✅ Basic accessibility features
- ✅ All required assets load
- ✅ Content security is proper
- ✅ Responsive design works
- ✅ Navigation functions correctly
- ✅ Performance is acceptable

## Pre-Publish Validation

Before publishing, run the comprehensive validation script:

```bash
./scripts/pre-publish-check.sh
```

This script performs:
1. ✅ Node.js and npm version checks
2. ✅ Dependency installation
3. ✅ TypeScript type checking and build
4. ✅ Security issue scanning
5. ✅ .gitignore configuration validation
6. ✅ package.json validation
7. ✅ Build artifacts verification
8. ✅ HTML output validation
9. ✅ End-to-end test execution
10. ✅ Final checklist verification

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npx playwright install chromium --with-deps

- name: Build
  run: npm run build

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Test Data Management

Tests use the Spark KV storage system which persists data across sessions. To reset test data:

1. Clear browser storage in the test
2. Or restart the development server

## Troubleshooting

### Tests Fail to Start

```bash
# Reinstall Playwright browsers
npx playwright install chromium --with-deps
```

### Timeout Issues

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 30000 // 30 seconds
```

### Port Already in Use

```bash
# Kill existing process on port 5173
npm run kill
# Or manually: fuser -k 5173/tcp
```

### Headless vs Headed Mode

For debugging, always use headed mode to see what's happening:
```bash
npm run test:e2e:headed
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Wait for State**: Always wait for `networkidle` or specific elements
3. **Meaningful Assertions**: Assert on user-visible behavior
4. **Error Messages**: Use descriptive test names and error messages
5. **Timeouts**: Add appropriate timeouts for async operations
6. **Cleanup**: Tests clean up after themselves when using KV storage

## Performance Benchmarks

Expected test execution times:
- Single test: 2-5 seconds
- Full suite: 3-5 minutes
- Pre-publish validation: 5-8 minutes

## Contributing

When adding new features:
1. Write E2E tests for new functionality
2. Ensure tests pass locally before submitting PR
3. Update this documentation with new test coverage

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
