# Offline Testing Guide

This project is configured to run **completely offline** without any external network dependencies during E2E testing.

## Overview

All E2E tests run against the built `/dist` folder using mocked data, eliminating the need for:
- External API calls (Congress.gov, GitHub API, runtime.github.com, models.github.ai, etc.)
- Live development servers
- Network connectivity during test execution

### Network Configuration

The application now supports both `127.0.0.1` and `0.0.0.0` binding:
- **Development**: Server binds to `0.0.0.0` for container/CI compatibility
- **Testing**: Mock responses for GitHub runtime/AI endpoints in test mode
- **CI/CD**: All workflows use `USE_MOCKS=1` and `NODE_ENV=test`

## Quick Start - Always Offline

**All commands use `USE_MOCKS=1` for fully offline operation:**

### 1. Install Dependencies (one-time, requires network)

```bash
npm ci
npx playwright install chromium
```

> **Note**: This is the only step requiring network access. After installation, all development and testing is fully offline.

### 2. Build the Application (offline)

```bash
USE_MOCKS=1 npm run build
```

This creates the `/dist` folder with:
- Compiled application code
- Mock data files from `/public/mocks/` → `/dist/mocks/`
- All static assets

### 3. Run Tests (offline)

```bash
USE_MOCKS=1 npm run test:e2e
```

Or for CI environments:

```bash
USE_MOCKS=1 npm run test:ci
```

### 4. Preview Build (offline)

```bash
USE_MOCKS=1 npm run preview
```

**Key Point**: Always prefix commands with `USE_MOCKS=1` to ensure fully offline operation with no external network calls.

## How It Works

### Mock Configuration

All mock data and API responses are centralized in `/config/mock.config.ts`:

```typescript
export const mockProposals = [/* ... */];
export const mockVotes = [/* ... */];
export const mockAuditLog = [/* ... */];

export const mockAPI = {
  getProposals: () => Promise.resolve(mockProposals),
  getVotes: () => Promise.resolve(mockVotes),
  getAuditLog: () => Promise.resolve(mockAuditLog),
  fetchBillData: () => Promise.resolve({/* mock bill data */})
};

export const shouldUseMocks = (): boolean => {
  return process.env.NODE_ENV === 'test' || process.env.USE_MOCKS === '1';
};
```

### Service Integration

All API services check the mock flag before making external calls:

```javascript
// src/services/congressApi.js
import { shouldUseMocks, mockAPI } from '../../config/mock.config';

export async function fetchBillData(congress, billType, billNumber, apiKey) {
  if (shouldUseMocks()) {
    return mockAPI.fetchBillData();
  }
  // ... real API call
}
```

### Test Configuration

Playwright is configured to avoid network loops:

- Uses `domcontentloaded` instead of `networkidle` to prevent hanging
- Starts preview server with `USE_MOCKS=1` and `NODE_ENV=test`
- Tests run against static `/dist` build, not live dev server

## Test Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `test:e2e` | Standard E2E tests with detailed output | `USE_MOCKS=1 npm run test:e2e` |
| `test:ci` | CI-optimized tests with dot reporter | `USE_MOCKS=1 npm run test:ci` |
| `test:ui` | Interactive test UI | `USE_MOCKS=1 npm run test:ui` |
| `test:report` | View last test report | `npm run test:report` |

## CI/CD Integration

The `.github/workflows/test.yml` and `.github/workflows/e2e.yml` workflows:

1. Installs dependencies (`npm ci`)
2. Installs Playwright browsers (`npx playwright install chromium`)
3. Builds the app with mocks (`USE_MOCKS=1 NODE_ENV=test npm run build`)
4. Runs tests offline (`USE_MOCKS=1 NODE_ENV=test npm run test:ci`)

**Key Configuration:**
- Server binds to `0.0.0.0` for container/CI compatibility (not `127.0.0.1`)
- All external network calls are mocked including GitHub domains
- Environment variables ensure offline operation throughout pipeline

## Firewall-Friendly Setup

The `.github/copilot-setup-steps.yml` ensures:

1. Dependencies are pre-installed
2. Playwright browsers are downloaded ahead of time
3. Application is pre-built with mocks enabled
4. All network-dependent setup happens during pre-warm phase

## Troubleshooting

### Tests Hang or Loop

**Symptom**: Tests timeout or loop indefinitely

**Solution**: Ensure all tests use `domcontentloaded` instead of `networkidle`:

```typescript
// ❌ Bad - can cause loops
await page.waitForLoadState('networkidle');

// ✅ Good - loads quickly
await page.waitForLoadState('domcontentloaded');
```

### Playwright Browsers Not Found

**Symptom**: `Executable doesn't exist` error

**Solution**: Install browsers before running tests:

```bash
npx playwright install chromium
```

### External Network Calls Detected

**Symptom**: Tests fail due to blocked network requests

**Solution**: 

1. Check that `USE_MOCKS=1` is set
2. Verify service files import and use `shouldUseMocks()`
3. Add new API endpoints to `/config/mock.config.ts`

### GitHub Copilot Domains Blocked

**Symptom**: Errors related to `runtime.github.com` or `models.github.ai`

**Solution**:

1. In test mode, these domains are automatically mocked by `fetchSafe.ts`
2. For production use, add domains to Copilot allowlist (see `COPILOT-ALLOWLIST.md`)
3. Verify `NODE_ENV=test` or `USE_MOCKS=1` is set in CI/CD

### Mock Data Not Loading

**Symptom**: Tests fail because data isn't available

**Solution**:

1. Ensure `/public/mocks/*.json` files exist
2. Run `npm run build` to copy mocks to `/dist/mocks/`
3. Verify mock files are included in `/dist` after build

## Best Practices

1. **Always build before testing**: Tests run against `/dist`, not source files
2. **Use environment variables**: Set `USE_MOCKS=1` for all test runs
3. **Keep mocks updated**: When adding API endpoints, update `/config/mock.config.ts`
4. **Avoid networkidle**: Use `domcontentloaded` in Playwright tests
5. **Pre-install browsers**: Include browser installation in CI setup steps

## Adding New Mock Data

1. Add mock data to `/config/mock.config.ts`:

```typescript
export const mockNewData = [/* ... */];
export const mockAPI = {
  // ... existing mocks
  getNewData: () => Promise.resolve(mockNewData)
};
```

2. Update service file to use mocks:

```typescript
import { shouldUseMocks, mockAPI } from '../../config/mock.config';

export async function fetchNewData() {
  if (shouldUseMocks()) {
    return mockAPI.getNewData();
  }
  // ... real API call
}
```

3. Optionally add JSON file to `/public/mocks/` if needed for fetch calls

## Validation

### Verify No External Network Calls

To ensure your changes work completely offline:

1. **Build with mocks**:
   ```bash
   USE_MOCKS=1 npm run build
   ```

2. **Check console output** - should show no external URLs being fetched

3. **Run tests with mocks**:
   ```bash
   USE_MOCKS=1 npm run test:e2e
   ```

4. **Monitor network** (optional) - all requests should be to localhost only

### Services Covered by Mocks

All these services respect `USE_MOCKS=1`:

- ✅ `congressApi.js` - Congress.gov bill data
- ✅ `congressService.js` - Congress.gov bills listing
- ✅ `mergedLoader.js` - Local council data
- ✅ `mockServer.ts` - Static file fetching
- ✅ `fetchSafe.ts` - GitHub runtime.github.com and models.github.ai mocking

### Pre-Publish Validation

Run the pre-publish check script to validate everything:

```bash
./scripts/pre-publish-check.sh
```

This validates:
- TypeScript compilation
- Build artifacts
- Mock data files presence
- E2E tests (if browsers installed)
- Production readiness

## Summary

✅ All tests run **completely offline**  
✅ No external API dependencies  
✅ No network loops or hanging  
✅ Fast, deterministic test execution  
✅ Works behind corporate firewalls  
✅ CI/CD friendly  
