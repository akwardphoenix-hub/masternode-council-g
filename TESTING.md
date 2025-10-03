# Testing Guide

This document provides comprehensive guidance on testing the Masternode Council Governance App.

## Table of Contents

- [Overview](#overview)
- [Test Infrastructure](#test-infrastructure)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Writing Tests](#writing-tests)
- [Debugging](#debugging)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

The application uses **Playwright** for end-to-end testing, providing comprehensive coverage of all user workflows and production readiness validation.

### Test Coverage

- **50 tests** across 7 test suites
- **Functional testing**: All user workflows and features
- **UI/UX testing**: Component rendering, navigation, and interactions
- **Production readiness**: Build artifacts, performance, and cross-device compatibility

## Test Infrastructure

### Tools

- **Playwright**: Browser automation and testing framework
- **TypeScript**: Type-safe test code
- **Vite**: Build tool and dev server

### Test Environment

- Tests run against a production build served by Vite's preview server
- Base URL: `http://localhost:4173`
- Browsers: Chromium (Desktop + Mobile Chrome)

## Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Install all dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Build the application (required for tests)
npm run build
```

## Running Tests

### Basic Commands

```bash
# Run all tests (headless)
npm run test:e2e

# Run tests with interactive UI (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# View last test report
npm run test:report
```

### Advanced Commands

```bash
# Run specific test file
npx playwright test e2e/01-app-loads.spec.ts

# Run tests matching pattern
npx playwright test --grep "proposal"

# Run tests in specific browser
npx playwright test --project=chromium

# Run with specific number of workers
npx playwright test --workers=2

# Update snapshots
npx playwright test --update-snapshots
```

## Test Suites

### 1. Application Loading (5 tests)

**File**: `e2e/01-app-loads.spec.ts`

Tests basic application functionality:
- Application loads without errors
- Main header displays correctly
- All navigation tabs render
- Tab navigation works
- Submit proposal button is visible

### 2. Proposal Management (6 tests)

**File**: `e2e/02-proposal-management.spec.ts`

Tests proposal creation and management:
- Dialog opens for proposal submission
- Form validation works
- Proposals are submitted successfully
- Proposal details display correctly
- Proposal creation can be cancelled
- Empty state displays when no proposals exist

### 3. Voting System (7 tests)

**File**: `e2e/03-voting-system.spec.ts`

Tests voting mechanisms:
- Approve votes can be cast
- Reject votes can be cast
- Abstain votes can be cast
- Duplicate voting is prevented
- Vote counts display correctly
- Votes appear in voting records
- Votes persist after page reload

### 4. Audit Trail (7 tests)

**File**: `e2e/04-audit-trail.spec.ts`

Tests audit logging:
- Proposal submission creates audit entry
- Vote casting creates audit entry
- Entries display with timestamps
- Entries display with actor information
- Entries are in chronological order
- Entries show action details
- Audit log persists after reload

### 5. Dashboard Statistics (8 tests)

**File**: `e2e/05-dashboard-stats.spec.ts`

Tests dashboard metrics:
- Total proposals count displays
- Active proposals count displays
- Statistics update on new proposal
- Vote statistics display
- Voting records count shows
- Audit log entry count shows
- Statistics update in real-time
- Dashboard overview displays

### 6. End-to-End Workflows (7 tests)

**File**: `e2e/06-end-to-end-workflows.spec.ts`

Tests complete user journeys:
- Complete workflow: create → vote → verify audit
- Multiple proposals with different outcomes
- Proposal cancellation and recreation
- Navigation between tabs with data persistence
- Page reload preserves all data
- Validation errors are handled properly
- User feedback through toast notifications

### 7. Production Build Validation (10 tests)

**File**: `e2e/07-build-production.spec.ts`

Tests production readiness:
- Valid build artifacts exist
- HTML structure is valid
- JavaScript bundles are present
- CSS bundles are present
- Proper meta tags exist
- No console errors on load
- Responsive on different viewports
- All critical resources load
- Reasonable page load time
- Interactive elements work

## Writing Tests

### Best Practices

#### 1. Use Descriptive Test Names

```typescript
// Good
test('should display error when submitting empty proposal', async ({ page }) => {
  // ...
});

// Bad
test('test 1', async ({ page }) => {
  // ...
});
```

#### 2. Use Role-Based Selectors

```typescript
// Good - Accessible and resilient
await page.getByRole('button', { name: /submit/i });
await page.getByLabel('Title');

// Bad - Fragile and not accessible
await page.locator('.submit-btn');
await page.locator('#title-input');
```

#### 3. Wait for Elements

```typescript
// Always wait for visibility before interaction
await expect(page.getByText('Success')).toBeVisible();

// Wait for network to settle
await page.waitForLoadState('networkidle');
```

#### 4. Clean State Between Tests

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Reset state if needed
});
```

#### 5. Test User Workflows, Not Implementation

```typescript
// Good - Tests user behavior
test('should submit proposal successfully', async ({ page }) => {
  await page.getByRole('button', { name: /submit/i }).click();
  await page.getByLabel('Title').fill('Test');
  await page.getByLabel('Description').fill('Description');
  await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByText('Test')).toBeVisible();
});

// Bad - Tests implementation details
test('should update state when handleSubmit is called', async ({ page }) => {
  // This tests React internals, not user behavior
});
```

### Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should perform expected behavior', async ({ page }) => {
    // Arrange
    // ... setup code

    // Act
    // ... user actions

    // Assert
    // ... verify results
  });
});
```

## Debugging

### UI Mode (Recommended)

```bash
npm run test:e2e:ui
```

Features:
- Interactive test execution
- Visual test picker
- Time travel through test steps
- DOM snapshot inspection
- Network request viewer
- Console log viewer

### Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Headed Mode

```bash
npm run test:e2e:headed
```

Runs tests in visible browser windows to see what's happening.

### Screenshots and Videos

On test failure, Playwright automatically captures:
- **Screenshots**: `test-results/` directory
- **Videos**: `test-results/` directory
- **Traces**: Can be viewed with `npx playwright show-trace`

### Console Debugging

Add `console.log` or use Playwright's debug methods:

```typescript
// Pause execution
await page.pause();

// Take screenshot
await page.screenshot({ path: 'debug.png' });

// Log page content
console.log(await page.content());

// Log element text
console.log(await page.locator('h1').textContent());
```

## CI/CD Integration

Tests run automatically via GitHub Actions on:
- Push to `main` branch
- Pull requests to `main` branch

### Workflow File

`.github/workflows/test.yml`

### Viewing Results

1. Go to the **Actions** tab in GitHub
2. Select the workflow run
3. View test results and artifacts
4. Download Playwright report for detailed results

### Local CI Simulation

```bash
# Run tests like CI does
CI=1 npm run test:e2e
```

## Troubleshooting

### Tests Fail on First Run

**Solution**: Ensure the project is built first:
```bash
npm run build
npm run test:e2e
```

### Port Already in Use

**Problem**: Port 4173 is already occupied

**Solution**:
```bash
# Find process using port
lsof -i :4173

# Kill the process
kill -9 <PID>

# Or use different port in playwright.config.ts
```

### Timeout Errors

**Problem**: Tests timeout waiting for elements

**Solutions**:

1. Increase timeout for specific test:
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

2. Increase default timeout in `playwright.config.ts`:
```typescript
export default defineConfig({
  timeout: 60000,
  // ...
});
```

3. Add explicit waits:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);
```

### Flaky Tests

**Problem**: Tests pass sometimes and fail other times

**Solutions**:

1. Add more specific waits:
```typescript
// Instead of
await page.waitForTimeout(1000);

// Use
await expect(element).toBeVisible();
```

2. Use more specific selectors:
```typescript
// Instead of
await page.locator('button').click();

// Use
await page.getByRole('button', { name: 'Submit Proposal' }).click();
```

3. Wait for network to settle:
```typescript
await page.waitForLoadState('networkidle');
```

### Browser Installation Issues

**Problem**: Playwright browsers won't install

**Solution**:
```bash
# Install with dependencies
npx playwright install chromium --with-deps

# Or install system dependencies separately
npx playwright install-deps chromium
npx playwright install chromium
```

### Tests Pass Locally but Fail in CI

**Common causes**:

1. **Missing build step**: Ensure `npm run build` runs before tests in CI
2. **Environment differences**: Check Node.js version matches
3. **Timing issues**: Add more explicit waits in tests
4. **Missing dependencies**: Ensure all deps are in `package.json`

## Pre-Publish Validation

Before publishing, run the comprehensive validation script:

```bash
./scripts/pre-publish-check.sh
```

This script validates:
1. Node.js and npm versions
2. Dependencies installation
3. TypeScript compilation
4. Code security (no secrets)
5. Code quality (no console.logs)
6. Configuration files
7. Build artifacts
8. HTML output
9. E2E test suite
10. Production readiness checklist

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [TEST-SUMMARY.md](./TEST-SUMMARY.md) - Test coverage overview
- [PUBLISH-CHECKLIST.md](./PUBLISH-CHECKLIST.md) - Pre-publish checklist
- [e2e/README.md](./e2e/README.md) - Quick test reference
