# Offline E2E Testing Mode

## Overview

This repository now supports a **firewall-safe offline mode** for running E2E tests in restricted environments like Copilot's sandbox. The implementation allows Playwright tests to run against a built SPA using `file://` URLs without requiring HTTP servers or external network access.

## Key Features

### 1. **Relative Asset Paths**
- Vite config uses `base: './'` to ensure assets work with `file://` URLs
- All assets (JS, CSS) resolve relatively in the `dist/` directory

### 2. **Bundled Fixtures**
- Fixture data stored in `src/fixtures/`:
  - `proposals.json` - Sample proposal data
  - `votes.json` - Sample vote records
  - `audit-log.json` - Sample audit entries
- Fixtures are bundled into the app at build time when `VITE_OFFLINE=1`

### 3. **Fetch Interception**
- `src/offline/shim.ts` intercepts fetch calls when `VITE_OFFLINE=1`
- Serves bundled fixtures for API routes:
  - `/api/proposals`
  - `/api/votes`
  - `/api/audit`
- Blocks external network calls (returns 204 for unknown URLs)

### 4. **Playwright Configuration**
- `playwright.config.ts` supports both normal and offline modes
- When `OFFLINE_E2E=1`:
  - No web server is started
  - Tests navigate to `file://dist/index.html`
  - baseURL is undefined (file:// URLs don't use it)

### 5. **Test Utilities**
- `e2e/utils.ts` provides helpers:
  - `indexUrl()` - Returns correct URL based on config metadata
  - `blockExternal(page)` - Blocks external requests in tests

## Usage

### Development (Normal Mode)

```bash
# Build normally
npm run build

# Run E2E tests with dev server
npm run test:e2e
```

### Offline Mode (Copilot/CI)

```bash
# Build with fixtures bundled
npm run build:offline

# Run E2E tests against file:// build
npm run test:e2e:offline

# Combined verification
npm run ci:verify
```

### Environment Variables

- `VITE_OFFLINE=1` - Activates offline mode at build time
  - Bundles fixtures
  - Activates fetch shim
  
- `OFFLINE_E2E=1` - Configures Playwright for offline testing
  - Skips web server
  - Uses file:// URLs
  - Targets `dist/index.html`

## Implementation Details

### Files Modified

1. **vite.config.ts**
   - Added `base: './'`
   - Added `define` for `VITE_OFFLINE` env var

2. **src/main.tsx**
   - Imports `src/offline/shim.ts` early

3. **playwright.config.ts**
   - Added `OFFLINE` constant checking `OFFLINE_E2E` env
   - Added `fileIndexUrl()` helper
   - Made `webServer` conditional on offline mode
   - Added `metadata.indexUrl` for test consumption

4. **All E2E test files**
   - Import utils from `./utils`
   - Use `blockExternal(page)` before navigation
   - Use `page.goto(indexUrl())` instead of hardcoded URLs

### Files Created

1. **src/fixtures/*** - Fixture JSON files
2. **src/offline/shim.ts** - Fetch interception logic
3. **e2e/utils.ts** - Test helper functions
4. **.github/workflows/test-offline.yml** - CI workflow for offline tests
5. **.github/copilot-setup-steps.yml** - Copilot pre-firewall setup

### Package Scripts

```json
{
  "build:offline": "VITE_OFFLINE=1 tsc -b --noCheck && VITE_OFFLINE=1 vite build",
  "test:e2e:offline": "OFFLINE_E2E=1 VITE_OFFLINE=1 playwright test",
  "ci:verify": "npm run build:offline && npm run test:e2e:offline"
}
```

## Verification

The offline build can be verified:

```bash
# 1. Build with offline mode
npm run build:offline

# 2. Check that dist/index.html exists
ls -l dist/index.html

# 3. Verify relative paths in HTML
grep "src=\"./assets/" dist/index.html

# 4. Check fixtures are bundled
grep "p-001" dist/assets/*.js

# 5. Check fetch shim is present
grep "OFFLINE.*fetch shim" dist/assets/*.js
```

## Testing Without Playwright

If Playwright browsers aren't available (network blocked), you can still verify:

```bash
# Test config in normal mode
node -e "const { default: c } = require('./playwright.config.ts'); console.log('webServer:', !!c.webServer); console.log('indexUrl:', c.metadata.indexUrl);"

# Test config in offline mode
OFFLINE_E2E=1 node -e "const { default: c } = require('./playwright.config.ts'); console.log('webServer:', c.webServer); console.log('indexUrl:', c.metadata.indexUrl);"
```

Expected output:
- Normal mode: `webServer: true`, `indexUrl: http://localhost:5000/`
- Offline mode: `webServer: undefined`, `indexUrl: file:///.../dist/index.html`

## Copilot Agent Instructions

When working in Copilot's sandbox:

1. **Always use offline mode** for builds and tests
2. **Never start HTTP servers** (vite dev, vite preview)
3. **Update fixtures** in `src/fixtures/` if adding new data dependencies
4. **Use test helpers** from `e2e/utils.ts` in all tests
5. **Run `npm run ci:verify`** to validate changes

## Troubleshooting

### Build fails with "dist/index.html not found"
- Run `npm run build:offline` before `npm run test:e2e:offline`

### Tests can't find indexUrl
- Check `OFFLINE_E2E=1` is set
- Verify `playwright.config.ts` metadata is configured

### Fetch calls fail in offline mode
- Ensure `VITE_OFFLINE=1` was set during build
- Check `src/offline/shim.ts` is imported in `src/main.tsx`
- Verify fixtures exist in `src/fixtures/`

### Assets fail to load with file:// URLs
- Verify `base: './'` is in `vite.config.ts`
- Check HTML has `./assets/` (relative) not `/assets/` (absolute)

## Benefits

✅ **Firewall-Safe**: No HTTP servers, no external network calls  
✅ **Hermetic**: Self-contained with bundled fixtures  
✅ **Fast**: No server startup time  
✅ **Portable**: Works in any environment with Node + Playwright  
✅ **CI-Ready**: Perfect for restricted CI/CD environments  
✅ **Dual-Mode**: Supports both normal dev and offline testing  

## Future Enhancements

- Add more fixture routes as the app grows
- Create fixture generators for complex test scenarios
- Add visual regression testing in offline mode
- Support multiple fixture sets for different test scenarios
