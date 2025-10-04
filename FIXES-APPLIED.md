# E2E Test Infrastructure Fixes

This document summarizes the fixes applied to resolve E2E test failures and dependency issues.

## Issues Identified

1. **npm ci Failure**: The `prepublish` hook was running build and E2E tests during `npm ci`, before Playwright browsers were installed
2. **Playwright Browser Download Failures**: Network/download issues when trying to install Playwright's chromium browser
3. **Wrong Component Rendered**: `main.tsx` was importing `App.jsx` (old Dashboard) instead of `App.tsx` (new app with tabs)
4. **Test Selector Issues**: E2E test selectors didn't match the actual UI structure

## Fixes Applied

### 1. Fixed package.json prepublish Hook
**File**: `package.json`

**Problem**: The deprecated `prepublish` hook runs during `npm install/ci`, causing tests to run before dependencies are fully set up.

**Solution**: 
- Replaced `prepublish` with `prepublishOnly` (only runs before `npm publish`)
- Added `validate` script for manual build+test validation
- Pointed `prepublishOnly` to existing `pre-publish-check.sh` script

```json
"scripts": {
  "validate": "npm run build && npm run test:e2e",
  "prepublishOnly": "./scripts/pre-publish-check.sh"
}
```

**Result**: ✅ `npm ci` now completes successfully without running tests

### 2. Configured Playwright to Use System Chrome
**File**: `playwright.config.ts`

**Problem**: Playwright was trying to download its own chromium browser, which was failing due to network/download issues.

**Solution**: Configured Playwright to use the system's already-installed Google Chrome browser.

```typescript
projects: [
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      channel: 'chrome', // Use system Chrome
    },
  },
],
```

**Result**: ✅ No browser download needed, tests run with system Chrome

### 3. Fixed App Component Import
**File**: `src/main.tsx`

**Problem**: App was importing `App.jsx` which renders the old Dashboard component without tabs, but tests expected the new `App.tsx` with tabs.

**Solution**: Changed import to use `App.tsx`

```typescript
import App from './App.tsx'
```

**Result**: ✅ Correct app component with tabs is now rendered

### 4. Fixed E2E Test Selectors
**File**: `e2e/01-app-loads.spec.ts`

**Problem**: Test selectors were too generic and matched multiple elements or wrong elements.

**Solutions**:
- Changed `/council/i` to `/masternode council/i` (more specific)
- Changed `/proposals/i` to `/total proposals/i` (unique selector)
- Changed `/votes/i` to `/total votes/i` (unique selector)
- Changed `/audit/i` to `/audit entries/i` (unique selector)

**Result**: ✅ All 5 tests in first test file passing

## Verification

### npm ci Test
```bash
$ npm ci
# Completes successfully without running tests ✅
```

### Build Test
```bash
$ npm run build
# dist/index.html     0.67 kB │ gzip:   0.39 kB
# dist/assets/*.css  340.75 kB │ gzip:  64.91 kB
# dist/assets/*.js   391.66 kB │ gzip: 120.72 kB
# ✓ built in 8.75s ✅
```

### E2E Test
```bash
$ npx playwright test e2e/01-app-loads.spec.ts --project=chromium
# Running 5 tests using 1 worker
# ·····
# 5 passed (28.6s) ✅
```

## Key Achievements

1. ✅ **Dependency Installation**: `npm ci` works without errors
2. ✅ **Build Process**: Production build completes successfully
3. ✅ **E2E Infrastructure**: Playwright configured and running with system Chrome
4. ✅ **UI Rendering**: Correct app component with tabs is displayed
5. ✅ **Test Execution**: E2E tests can run and pass

## Usage

### For Development
```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run E2E tests (in another terminal)
npm run test:e2e
```

### For CI/CD
```bash
# Install and build
npm ci
npm run build

# Run E2E tests (Playwright starts its own server)
npm run test:e2e
```

### For Pre-Publish Validation
```bash
# Manual validation
npm run validate

# Or use the comprehensive script
./scripts/pre-publish-check.sh
```

## Files Modified

1. `package.json` - Fixed prepublish hook
2. `playwright.config.ts` - Use system Chrome
3. `src/main.tsx` - Import correct App component
4. `e2e/01-app-loads.spec.ts` - Fixed test selectors

## Next Steps

The E2E test infrastructure is now working correctly. Individual test files may need selector updates to match the actual UI, but the core infrastructure issues have been resolved.
