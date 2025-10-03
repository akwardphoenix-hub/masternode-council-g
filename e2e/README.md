# End-to-End Tests

This directory contains comprehensive end-to-end tests for the Masternode Council Governance App.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers (required first time)
npx playwright install chromium

# Run all tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug
```

## Test Files

- **01-app-loads.spec.ts** - Basic application loading and UI presence
- **02-proposal-management.spec.ts** - Proposal creation, editing, and display
- **03-voting-system.spec.ts** - Voting functionality (approve/reject/abstain)
- **04-audit-trail.spec.ts** - Audit log creation and display
- **05-dashboard-stats.spec.ts** - Dashboard statistics and counters
- **06-end-to-end-workflow.spec.ts** - Complete user workflows
- **07-build-production.spec.ts** - Production build validation

## What Gets Tested

### ✅ Functional Tests
- Proposal creation and validation
- Voting on proposals (approve, reject, abstain)
- Duplicate vote prevention
- Audit log generation
- Data persistence across page reloads
- Statistics updates

### ✅ UI/UX Tests
- Component rendering
- Navigation between tabs
- Dialog interactions
- Button states and feedback
- Toast notifications
- Responsive design

### ✅ Production Readiness
- Build artifacts validation
- No console errors
- Asset loading
- Accessibility basics
- Performance benchmarks
- Cross-viewport testing

## Test Results

Tests automatically generate a report. View it with:

```bash
npm run test:report
```

## Troubleshooting

### Playwright Not Installed

```bash
npx playwright install chromium
```

### Port Already in Use

```bash
npm run kill  # Kill process on port 5000
```

### Tests Timing Out

Increase timeout in `playwright.config.ts` or individual tests.

### Debugging Failed Tests

```bash
# Run with debug mode
npm run test:e2e:debug

# Or run specific test
npx playwright test e2e/01-app-loads.spec.ts --debug
```

## CI/CD Integration

For GitHub Actions or other CI systems, see [TESTING.md](../TESTING.md) for complete setup instructions.

## Writing New Tests

Follow these patterns:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Your test code
    await expect(page.getByText('Something')).toBeVisible();
  });
});
```

See [Playwright Documentation](https://playwright.dev/) for more details.
