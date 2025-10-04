# E2E Tests

This directory contains end-to-end tests for the Masternode Council application using Playwright.

## Test Structure

Tests are organized by feature area:
- `smoke.spec.ts` - Basic smoke tests to verify app loads

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run in headed mode (see the browser)
npm run test:e2e:headed

# Run with CI reporter
npm run test:e2e:ci

# View last test report
npm run test:e2e:report
```

## Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- **Web Server**: Automatically starts Vite dev server before tests
- **Base URL**: `http://localhost:5173`
- **Browsers**: Tests run on Chromium, Firefox, and WebKit
- **Retries**: 1 retry for flaky tests
- **Timeout**: 30 seconds per test
- **Artifacts**: Screenshots, videos, and traces on failure

## Writing Tests

Tests should follow Playwright best practices:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

## CI/CD

The E2E tests run automatically on:
- Push to main branch
- Pull requests to main branch

The workflow:
1. Checks out code
2. Installs dependencies
3. Installs Playwright browsers with system dependencies
4. Runs tests (dev server starts automatically)
5. Uploads test artifacts on failure

## Troubleshooting

### Server doesn't start
- Check that port 5173 is not already in use
- Ensure `npm run dev` works locally
- Check `webServer` configuration in `playwright.config.ts`

### Tests fail in CI but pass locally
- Verify browser dependencies are installed
- Check for timing issues (increase timeout if needed)
- Review CI logs for specific errors

### Cannot connect to server
- The `webServer` configuration should handle starting the server
- If manually starting, ensure server is running on port 5173
- Check that `reuseExistingServer` is set correctly for your environment
