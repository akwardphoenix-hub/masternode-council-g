# End-to-End Tests

This directory contains comprehensive end-to-end tests for the Masternode Council Governance App using Playwright.

## Test Suites

- **01-app-loads.spec.ts** (5 tests) - Application loading and component rendering
- **02-proposal-management.spec.ts** (6 tests) - Proposal creation, validation, and display
- **03-voting-system.spec.ts** (7 tests) - Voting mechanisms and duplicate prevention
- **04-audit-trail.spec.ts** (7 tests) - Audit log validation and tracking
- **05-dashboard-stats.spec.ts** (8 tests) - Dashboard metrics and statistics
- **06-end-to-end-workflows.spec.ts** (7 tests) - Complete user journeys
- **07-build-production.spec.ts** (10 tests) - Production build validation

**Total: 50 tests**

## Quick Start

### Install Dependencies

```bash
# Install test dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Run Tests

```bash
# Run all tests (headless)
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/01-app-loads.spec.ts

# View test report
npm run test:report
```

## Test Configuration

Tests are configured in `playwright.config.ts`:

- Base URL: `http://localhost:4173` (Vite preview server)
- Browsers: Chromium (Desktop + Mobile)
- Timeout: 30 seconds per test
- Retries: 2 on CI, 0 locally
- Screenshots: On failure
- Videos: On failure

## Writing Tests

### Best Practices

1. **Use meaningful test descriptions** that explain what is being tested
2. **Use role-based selectors** when possible (e.g., `getByRole('button')`)
3. **Wait for elements** to be visible before interacting
4. **Clean up state** between tests using `beforeEach` hooks
5. **Test user workflows**, not implementation details

### Example Test

```typescript
test('should submit a proposal', async ({ page }) => {
  await page.goto('/');
  
  await page.getByRole('button', { name: /submit proposal/i }).click();
  await page.getByLabel(/title/i).fill('Test Proposal');
  await page.getByLabel(/description/i).fill('Test description');
  await page.getByRole('button', { name: /submit/i }).click();
  
  await expect(page.getByText('Test Proposal')).toBeVisible();
});
```

## Debugging Tests

### UI Mode (Recommended)

```bash
npm run test:e2e:ui
```

This opens an interactive UI where you can:
- Run tests one by one
- See test execution in real-time
- Inspect DOM and network requests
- Step through test actions

### Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Headed Mode

```bash
npm run test:e2e:headed
```

Runs tests in visible browser windows.

## CI/CD

Tests run automatically on:
- Pull requests
- Pushes to main branch

See `.github/workflows/test.yml` for configuration.

## Troubleshooting

### Tests fail on first run
- Ensure you've built the project: `npm run build`
- Ensure Playwright browsers are installed: `npx playwright install chromium`

### Port already in use
- The preview server uses port 4173
- Stop any existing processes on that port
- Or configure a different port in `playwright.config.ts`

### Timeout errors
- Increase timeout in individual tests: `{ timeout: 60000 }`
- Or globally in `playwright.config.ts`

### Flaky tests
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use more specific selectors
- Increase wait times for async operations

## Documentation

For more detailed information, see:
- [TESTING.md](../TESTING.md) - Comprehensive testing guide
- [TEST-SUMMARY.md](../TEST-SUMMARY.md) - Test coverage overview
- [Playwright Documentation](https://playwright.dev/)
