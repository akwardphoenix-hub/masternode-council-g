# Offline Mode Guide

## Overview

This repository is fully configured to run **100% offline** after initial setup. All external network calls (Congress.gov, GitHub API, Ubuntu security mirrors, etc.) are automatically mocked when offline mode is enabled.

## Quick Start

### 1. Initial Setup (Requires Network Once)

```bash
# Install dependencies
npm ci

# Install Playwright browsers (optional, only if running E2E tests)
npx playwright install chromium
```

### 2. Enable Offline Mode

The repository includes a `.env.test` file that automatically enables offline mode:

```bash
# .env.test (already configured)
VITE_OFFLINE=true
VITE_USE_MOCKS=1
NODE_ENV=test
USE_MOCKS=1
```

### 3. Build and Test Offline

```bash
# Build the application (completely offline)
USE_MOCKS=1 VITE_OFFLINE=true npm run build

# Run E2E tests (completely offline)
USE_MOCKS=1 VITE_OFFLINE=true npm run test:e2e

# Run with CI reporter
USE_MOCKS=1 VITE_OFFLINE=true npm run test:ci

# Preview the built application
USE_MOCKS=1 VITE_OFFLINE=true npm run preview
```

## Environment Variables

| Variable | Purpose | Values | Required |
|----------|---------|--------|----------|
| `VITE_OFFLINE` | Master offline switch | `true` / `false` | Yes (for offline) |
| `USE_MOCKS` | Enable mock data | `0` / `1` | Yes (for offline) |
| `NODE_ENV` | Node environment | `test` / `development` / `production` | Recommended |
| `VITE_USE_MOCKS` | Vite-specific mocks | `0` / `1` | Optional |

## What Gets Mocked?

When offline mode is enabled, the following external services are automatically mocked:

### 1. Congress.gov API
- **Domain**: `api.congress.gov`
- **Purpose**: Legislative bill data
- **Mock Location**: `config/mock.config.ts` - `mockAPI.fetchBillData()`

### 2. GitHub API
- **Domain**: `api.github.com`
- **Purpose**: Repository and issue data
- **Mock Location**: `src/lib/fetchSafe.ts` + `config/mock.config.ts`

### 3. GitHub Runtime Services
- **Domain**: `runtime.github.com`
- **Purpose**: GitHub runtime APIs
- **Mock Location**: `src/lib/fetchSafe.ts`

### 4. GitHub AI Models
- **Domain**: `models.github.ai`
- **Purpose**: AI model services
- **Mock Location**: `src/lib/fetchSafe.ts` + `config/mock.config.ts`

### 5. Ubuntu Security Mirrors
- **Domains**: `esm.ubuntu.com`, `security.ubuntu.com`
- **Purpose**: Security updates (blocked in E2E tests)
- **Mock Location**: `src/lib/fetchSafe.ts`

## How It Works

### fetchSafe Wrapper

All external HTTP calls go through `src/lib/fetchSafe.ts`, which:

1. Detects test/offline mode from environment variables
2. Intercepts external URLs
3. Returns mock responses for known services
4. Blocks all other external calls with an error

```typescript
export async function fetchSafe(url: string, init?: RequestInit) {
  const isOffline = (import.meta as any)?.env?.VITE_OFFLINE === 'true';
  const isTest = mode === 'test' || mode === 'ci' || isCI || isOffline;

  if (isTest && isExternal) {
    // Return mocks for known services
    // Block all other external calls
    throw new Error(`External fetch blocked in test mode: ${url}`);
  }
  
  return fetch(url, init);
}
```

### Mock Configuration

All mock data is centralized in `config/mock.config.ts`:

```typescript
export const mockAPI = {
  getProposals: () => Promise.resolve(mockProposals),
  getVotes: () => Promise.resolve(mockVotes),
  getAuditLog: () => Promise.resolve(mockAuditLog),
  fetchBillData: () => Promise.resolve({ /* mock bill */ }),
  fetchBills: (limit) => Promise.resolve(mockBills.slice(0, limit)),
  fetchBillById: (id) => Promise.resolve(mockBills[0]),
  fetchGitHubAPI: () => Promise.resolve({ status: 'ok' }),
  fetchUbuntuSecurityUpdates: () => Promise.resolve({ updates: [] })
};
```

### Service Layer Integration

All API services check for offline mode before making real calls:

```javascript
import { shouldUseMocks, mockAPI } from '../../config/mock.config';

export async function fetchBills(limit = 10) {
  if (shouldUseMocks()) {
    return mockAPI.fetchBills(limit);
  }
  // ... real API call
}
```

## CI/CD Integration

Both GitHub Actions workflows are configured for offline operation:

### test.yml
```yaml
- name: Build app
  env:
    USE_MOCKS: '1'
    NODE_ENV: 'test'
    VITE_OFFLINE: 'true'
  run: npm run build

- name: Run E2E
  env:
    USE_MOCKS: '1'
    NODE_ENV: 'test'
    VITE_OFFLINE: 'true'
  run: npx playwright test
```

## Troubleshooting

### Issue: External network calls detected during tests

**Solution**: Ensure environment variables are set:
```bash
USE_MOCKS=1 VITE_OFFLINE=true npm run test:e2e
```

### Issue: Mock data not loading

**Solution**: Check that mock files exist in `dist/mocks/` after build:
```bash
ls -la dist/mocks/
# Should show: audit.json, proposals.json, votes.json
```

### Issue: Tests hang or loop

**Solution**: Verify tests use `domcontentloaded` instead of `networkidle`:
```typescript
// ✅ Good
await page.waitForLoadState('domcontentloaded');

// ❌ Bad (causes loops)
await page.waitForLoadState('networkidle');
```

### Issue: Build fails with module not found

**Solution**: Ensure dependencies are installed:
```bash
npm ci
```

## Adding New External Services

When adding a new external API:

1. **Add mock data** to `config/mock.config.ts`:
   ```typescript
   export const mockNewService = { /* data */ };
   ```

2. **Add mock method** to `mockAPI`:
   ```typescript
   export const mockAPI = {
     // ...
     fetchNewService: () => Promise.resolve(mockNewService)
   };
   ```

3. **Update service file**:
   ```typescript
   import { shouldUseMocks, mockAPI } from '../../config/mock.config';
   
   export async function fetchNewService() {
     if (shouldUseMocks()) {
       return mockAPI.fetchNewService();
     }
     // ... real API call
   }
   ```

4. **OR add to fetchSafe.ts** (for low-level blocking):
   ```typescript
   if (url.includes('newservice.com')) {
     return new Response(JSON.stringify({ /* mock */ }), {
       status: 200,
       headers: { 'Content-Type': 'application/json' }
     });
   }
   ```

5. **Verify**:
   ```bash
   USE_MOCKS=1 VITE_OFFLINE=true npm run build
   USE_MOCKS=1 VITE_OFFLINE=true npm run test:e2e
   ```

## Benefits

✅ **No Network Required**: Build and test completely offline  
✅ **Firewall Friendly**: Works behind corporate firewalls  
✅ **Fast Execution**: No network latency, instant responses  
✅ **Deterministic**: Same results every time, no flaky tests  
✅ **Security**: No external data leakage during tests  
✅ **Cost Effective**: No API rate limits or costs during development

## Related Documentation

- [OFFLINE-TESTING.md](./OFFLINE-TESTING.md) - Comprehensive testing guide
- [NETWORK-AUDIT.md](./NETWORK-AUDIT.md) - Network dependency audit report
- [IMPLEMENTATION-COMPLETE.md](./IMPLEMENTATION-COMPLETE.md) - Implementation details
- [README.md](./README.md) - Main project documentation

## Support

For questions or issues:
1. Check existing documentation
2. Review [TROUBLESHOOTING](./OFFLINE-TESTING.md#troubleshooting) section
3. Open an issue on GitHub
