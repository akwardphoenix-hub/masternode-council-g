# Network Configuration Changes Summary

## Overview

This document describes the network configuration changes made to fix CI/E2E test issues related to blocked domains and firewall restrictions.

## Problem Statement

The original issue was that GitHub Copilot agents were failing because:
1. Attempts to connect to `127.0.0.1` in GitHub Actions environments
2. Blocked access to `runtime.github.com` and `models.github.ai`
3. Network calls during E2E tests causing failures in firewall-restricted environments

## Solutions Implemented

### 1. Server Binding Changes (0.0.0.0 instead of 127.0.0.1)

**Modified Files:**
- `package.json`: Updated preview command to use `--host 0.0.0.0`
- `playwright.config.ts`: Changed baseURL and webServer url to `http://0.0.0.0:4173`
- `.github/workflows/e2e.yml`: Updated preview server and base URL to use `0.0.0.0`

**Rationale:**
- `0.0.0.0` binds to all network interfaces, making the server accessible in container/CI environments
- `127.0.0.1` only binds to localhost, which can have issues in some CI/container setups
- Maintains backward compatibility as `0.0.0.0` is accessible via localhost, 127.0.0.1, and other interfaces

### 2. GitHub Domain Mocking

**Modified Files:**
- `src/lib/fetchSafe.ts`: Added automatic mocking for `runtime.github.com` and `models.github.ai` in test mode
- `config/mock.config.ts`: Added `fetchGitHubRuntime()` and `fetchGitHubModels()` mock handlers

**Behavior:**
- When `NODE_ENV=test` or `USE_MOCKS=1`, all calls to GitHub domains return mock data
- Mock responses are proper JSON with status 200, preventing test failures
- Blocks all other external calls in test mode with clear error messages

**Example Response:**
```javascript
// runtime.github.com mock
{
  status: 'ok',
  message: 'Mocked runtime.github.com response',
  version: '1.0.0-mock'
}

// models.github.ai mock
{
  status: 'ok',
  model: 'mock-copilot-model',
  response: 'Mocked models.github.ai response',
  capabilities: ['code-completion', 'chat']
}
```

### 3. Enhanced Local Address Support

**Modified:** `src/lib/fetchSafe.ts`

**Added Support For:**
- `http://0.0.0.0` - All interfaces binding
- `http://[::1]` - IPv6 localhost
- `http://127.0.0.1` - IPv4 localhost (existing)
- `http://localhost` - Standard localhost (existing)

All these addresses are now recognized as local and allowed in test mode.

### 4. CI/CD Workflow Updates

**Modified Files:**
- `.github/workflows/test.yml`: Added `USE_MOCKS=1` and `NODE_ENV=test` to build and test steps
- `.github/workflows/e2e.yml`: Updated to use `0.0.0.0` binding and proper environment variables

**Environment Variables Set:**
- `USE_MOCKS=1` - Enables mock data in all services
- `NODE_ENV=test` - Activates test mode across the application

**Benefits:**
- All builds are fully offline after initial dependency installation
- No external network calls during testing
- Firewall-friendly CI/CD execution

### 5. Documentation

**New Files:**
- `COPILOT-ALLOWLIST.md` - Instructions for configuring GitHub Copilot allowlist
- `scripts/verify-network-config.sh` - Automated verification script
- `NETWORK-CONFIG-CHANGES.md` - This document

**Updated Files:**
- `OFFLINE-TESTING.md` - Added sections about new domain handling and 0.0.0.0 binding

## Verification

Run the verification script to ensure all changes are working correctly:

```bash
./scripts/verify-network-config.sh
```

This script checks:
- ✅ Required files exist
- ✅ Environment variable support
- ✅ GitHub domain mocking implementation
- ✅ 0.0.0.0 binding in config files
- ✅ Proper workflow configuration
- ✅ Successful build with mocks

## Testing

### Local Testing

```bash
# Build with mocks
USE_MOCKS=1 NODE_ENV=test npm run build

# Start preview server (binds to 0.0.0.0)
USE_MOCKS=1 NODE_ENV=test npm run preview

# Run E2E tests (requires Playwright browsers installed)
USE_MOCKS=1 NODE_ENV=test npm run test:e2e
```

### CI Testing

The GitHub Actions workflows automatically:
1. Install dependencies
2. Install Playwright browsers
3. Build with mocks (`USE_MOCKS=1 NODE_ENV=test`)
4. Run tests offline with mocked network calls

## Copilot Allowlist Configuration

**Repository admins must configure the Copilot allowlist:**

1. Go to repository Settings
2. Navigate to Code security and analysis → Copilot section
3. Add to allowlist:
   - `runtime.github.com`
   - `models.github.ai`

See `COPILOT-ALLOWLIST.md` for detailed instructions.

## Backward Compatibility

All changes maintain backward compatibility:
- ✅ Tests work without `USE_MOCKS=1` (uses real APIs)
- ✅ Server still accessible via `localhost` and `127.0.0.1`
- ✅ Existing test scripts continue to work
- ✅ No breaking changes to API or functionality

## Expected Behavior

### Development Mode
- Server binds to `0.0.0.0` for maximum compatibility
- Accessible via localhost, 127.0.0.1, container IPs, etc.

### Test Mode (NODE_ENV=test or USE_MOCKS=1)
- All GitHub domain calls return mock data
- All Congress.gov API calls return mock data
- All other external calls are blocked with clear errors
- Server accessible on all local addresses

### Production Mode
- Normal external API calls (not mocked)
- GitHub domains require allowlist configuration
- Server binds according to deployment configuration

## Troubleshooting

### Tests Still Failing on Network Issues
1. Verify `USE_MOCKS=1` is set
2. Check `NODE_ENV=test` is set
3. Ensure `fetchSafe.ts` is being used for all external calls
4. Add new domains to mock handlers if needed

### Server Not Accessible in CI
1. Verify workflows use `0.0.0.0` binding
2. Check port 4173 is not blocked
3. Ensure wait-on uses correct URL (`http://0.0.0.0:4173`)

### Copilot Features Not Working
1. Repository admin must configure allowlist (see COPILOT-ALLOWLIST.md)
2. In test mode, mocks are returned automatically
3. Check for firewall/network policy restrictions

## Related Documentation

- `COPILOT-ALLOWLIST.md` - Allowlist configuration guide
- `OFFLINE-TESTING.md` - Complete offline testing guide
- `IMPLEMENTATION-SUMMARY.md` - Original offline testing implementation
- `NETWORK-AUDIT.md` - Network dependency audit report

## Summary

These changes enable the application to run completely offline in test/CI environments while supporting GitHub Copilot features in production through proper allowlist configuration. The use of `0.0.0.0` binding ensures maximum compatibility across different execution environments.
