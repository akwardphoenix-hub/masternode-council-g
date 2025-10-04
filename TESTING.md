# E2E Testing Setup

## Problem

The E2E tests in PR branches were failing with:
```
Error: connect ECONNREFUSED 127.0.0.1:5173
```

This occurred because Playwright tests expected a dev server running on `http://localhost:5173`, but no server was started before the tests ran.

## Solution

Added `webServer` configuration to Playwright that automatically:
1. Starts the Vite dev server before tests begin
2. Waits for the server to be ready (up to 120 seconds)
3. Runs all tests against the live server
4. Stops the server after tests complete

## Configuration

### playwright.config.ts
```typescript
webServer: {
  command: 'npm run dev',              // Starts Vite
  url: 'http://localhost:5173',        // Wait for this URL to respond
  reuseExistingServer: !process.env.CI, // Reuse locally, restart in CI
  timeout: 120 * 1000,                 // Max 120s to start
}
```

### Key Features
- **Automatic server management**: No manual steps needed
- **CI-friendly**: Always starts fresh server in CI environment
- **Dev-friendly**: Reuses existing server when developing locally
- **Timeout protection**: Fails fast if server won't start

## Usage

```bash
# Run all E2E tests (server starts automatically)
npm run test:e2e

# Run in headed mode to see browser
npm run test:e2e:headed

# Run with CI reporter
npm run test:e2e:ci

# View HTML report from last run
npm run test:e2e:report
```

## CI Integration

The `.github/workflows/test.yml` workflow:
1. Installs dependencies
2. Installs Playwright browsers with system deps
3. Runs `npm run test:e2e:ci`
   - Playwright starts dev server automatically
   - Tests run across Chromium, Firefox, WebKit
   - Server stops when complete
4. Reports results

## Files Added

- `playwright.config.ts` - Playwright configuration with webServer
- `.github/workflows/test.yml` - CI workflow for E2E tests
- `e2e/smoke.spec.ts` - Basic smoke tests
- `e2e/README.md` - Detailed testing documentation
- Updated `package.json` with test scripts and Playwright dependency
- Updated `.gitignore` to exclude test artifacts
- Updated `README.md` with testing section

## Benefits

✅ **No manual server management** - Playwright handles it  
✅ **Consistent across environments** - Same behavior locally and in CI  
✅ **Fast feedback** - Tests fail quickly if server won't start  
✅ **Ready for scale** - Can easily add more test suites  
✅ **Developer-friendly** - Clear documentation and examples  

## Migration Notes

Existing E2E test suites from other PRs will work immediately with this configuration. The only change needed was adding the `webServer` block - all test code remains the same.

## Troubleshooting

### Port already in use
If port 5173 is in use, either:
- Stop the existing server
- Or set `reuseExistingServer: true` to use it

### Server won't start
- Check `npm run dev` works independently
- Increase `webServer.timeout` if startup is slow
- Check for build errors in the output

### Tests pass locally but fail in CI
- Ensure all dependencies are in `package.json`
- Check for environment-specific issues
- Review CI logs for specific error messages
