# Testing Documentation

This document describes the comprehensive end-to-end testing suite for the Masternode Council Governance App.

## Overview

The testing suite uses [Playwright](https://playwright.dev/) for end-to-end testing, covering all critical user workflows and ensuring the application is production-ready.

### System Chrome Configuration

**Important**: This project is configured to use **system-installed Chrome** instead of downloading Playwright's bundled browsers. This approach:
- ✅ Avoids network/firewall issues during browser installation
- ✅ Works reliably in CI environments (GitHub Actions has Chrome pre-installed)
- ✅ Eliminates the need for `npx playwright install` commands
- ✅ Reduces setup time and disk space usage

The configuration is in `playwright.config.ts` with `channel: 'chrome'`.

## Test Structure

Tests are organized in the `e2e/` directory:

```
e2e/
├── 01-app-loads.spec.ts           # Basic application loading tests
├── 02-proposal-management.spec.ts # Proposal creation and management
├── 03-voting-system.spec.ts       # Voting functionality tests
├── 04-audit-trail.spec.ts         # Audit log tracking tests
├── 05-dashboard-stats.spec.ts     # Dashboard statistics tests
├── 06-end-to-end-workflow.spec.ts # Complete user workflows
└── 07-build-production.spec.ts    # Production build validation
```

## Quick Start

### Prerequisites

This project is configured to use **system-installed Chrome** to avoid network/firewall issues with downloading Playwright browsers.

1. Verify Chrome is installed:
```bash
google-chrome --version  # Should show Chrome 90+ (or any modern Chrome version)
```

2. Install dependencies:
```bash
npm install
```

That's it! No need to download Playwright browsers.

### Running Tests

#### Run All Tests

```bash
npm run test:e2e
```

**Note**: The test suite is configured to:
- Use system Chrome browser (no download required)
- Run tests sequentially in CI for stability
- Automatically start the dev server on port 5000
- Retry failed tests 2 times in CI

### Run Tests with UI

```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (see browser)

```bash
npm run test:e2e:headed
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### View Test Report

```bash
npm run test:report
```

## Test Coverage

### 1. Application Loading (`01-app-loads.spec.ts`)
- ✅ Application loads successfully
- ✅ Main dashboard components are visible
- ✅ Navigation tabs are present
- ✅ Responsive layout works correctly
- ✅ Page title is set properly

### 2. Proposal Management (`02-proposal-management.spec.ts`)
- ✅ Create proposal button is displayed
- ✅ Proposal creation dialog opens
- ✅ Empty proposal validation works
- ✅ New proposals can be created successfully
- ✅ Proposal details are displayed correctly
- ✅ Proposal creation can be cancelled

### 3. Voting System (`03-voting-system.spec.ts`)
- ✅ Voting buttons are displayed on proposals
- ✅ Approve votes can be cast
- ✅ Reject votes can be cast
- ✅ Abstain votes can be cast
- ✅ Duplicate voting is prevented
- ✅ Vote counts are displayed correctly
- ✅ Voting records tab works

### 4. Audit Trail (`04-audit-trail.spec.ts`)
- ✅ Audit log tab navigation works
- ✅ Audit entries created when submitting proposals
- ✅ Audit entries created when casting votes
- ✅ Timestamps are displayed correctly
- ✅ Actor information is shown
- ✅ Entry details are visible
- ✅ Entries appear in chronological order

### 5. Dashboard Statistics (`05-dashboard-stats.spec.ts`)
- ✅ Statistics cards are displayed
- ✅ Numeric values are shown
- ✅ Proposal count updates after creation
- ✅ Vote count updates after voting
- ✅ Audit entries count updates after actions
- ✅ Status badges are displayed
- ✅ Icons are present
- ✅ Layout is consistent

### 6. End-to-End Workflows (`06-end-to-end-workflow.spec.ts`)
- ✅ Complete proposal lifecycle (create → vote → audit)
- ✅ Multiple proposals workflow
- ✅ Voting on multiple proposals
- ✅ Data consistency across tabs
- ✅ Rapid successive actions
- ✅ UI feedback for all actions
- ✅ Data persistence on page refresh

### 7. Production Build Validation (`07-build-production.spec.ts`)
- ✅ Proper meta tags
- ✅ CSS loads correctly
- ✅ No console errors on load
- ✅ 404 pages handled gracefully
- ✅ Basic accessibility features
- ✅ All required assets load
- ✅ Content security is proper
- ✅ Responsive design works
- ✅ Navigation functions correctly
- ✅ Performance is acceptable

## Pre-Publish Validation

Before publishing, run the comprehensive validation script:

```bash
./scripts/pre-publish-check.sh
```

This script performs:
1. ✅ Node.js and npm version checks
2. ✅ Dependency installation
3. ✅ TypeScript type checking and build
4. ✅ Security issue scanning
5. ✅ .gitignore configuration validation
6. ✅ package.json validation
7. ✅ Build artifacts verification
8. ✅ HTML output validation
9. ✅ End-to-end test execution
10. ✅ Final checklist verification

## Continuous Integration

### Using System Chrome (Recommended)

This project is configured to use system-installed Chrome, avoiding browser download issues:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Chrome dependencies (optional)
  run: npx playwright install-deps chromium

- name: Verify Chrome
  run: google-chrome --version

- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

### Traditional Playwright Browser Download (Alternative)

If you want to use Playwright's bundled browsers instead of system Chrome:

```yaml
- name: Install dependencies
  run: npm ci

- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}

- name: Install Playwright browsers
  run: npx playwright install chromium --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

**Note**: The first approach (system Chrome) is more reliable in restricted network environments.

## Test Data Management

Tests use the Spark KV storage system which persists data across sessions. To reset test data:

1. Clear browser storage in the test
2. Or restart the development server

## Troubleshooting

### Tests Fail to Start

**Issue**: Playwright browsers not installed or download fails

**Solution**:
```bash
# Try installing Playwright browsers
npx playwright install chromium --with-deps

# If download fails due to network/firewall issues:
# The configuration is already set to use system Chrome as fallback
# Verify Chrome is available:
google-chrome --version

# If Chrome is installed, tests should work automatically
# The playwright.config.ts uses channel: 'chrome' to use system Chrome
```

### Browser Download Failures (Network/Firewall Issues)

**Issue**: `EPIPE`, `Download failed`, or timeout errors during `npx playwright install`

**Solutions**:
1. **Use System Chrome** (Default in this project):
   - The `playwright.config.ts` is already configured to use system Chrome
   - No manual Playwright browser installation needed
   - Just ensure Chrome/Chromium is installed on your system

2. **Manual Chrome Installation** (if needed):
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install google-chrome-stable
   
   # Or use Chromium
   sudo apt-get install chromium-browser
   ```

3. **For CI Environments**:
   - GitHub Actions runners have Chrome pre-installed
   - The `.github/workflows/test.yml` uses system Chrome automatically
   - No special configuration needed

### Timeout Issues

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 30000 // 30 seconds
```

Or run individual tests with custom timeout:
```bash
npx playwright test --timeout=60000
```

### Port Already in Use

```bash
# Kill existing process on port 5000 (the dev server port)
npm run kill
# Or manually: fuser -k 5000/tcp
```

### Headless vs Headed Mode

For debugging, always use headed mode to see what's happening:
```bash
npm run test:e2e:headed
```

### Debugging Specific Test Failures

```bash
# Run a specific test file
npx playwright test e2e/01-app-loads.spec.ts

# Run with debug mode
npx playwright test --debug

# View trace of a failed test
npx playwright show-trace test-results/[test-name]/trace.zip
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Wait for State**: Always wait for `networkidle` or specific elements
3. **Meaningful Assertions**: Assert on user-visible behavior
4. **Error Messages**: Use descriptive test names and error messages
5. **Timeouts**: Add appropriate timeouts for async operations
6. **Cleanup**: Tests clean up after themselves when using KV storage

## Performance Benchmarks

Expected test execution times:
- Single test: 2-5 seconds
- Full suite: 3-5 minutes
- Pre-publish validation: 5-8 minutes

## Test Status

The E2E test suite is fully configured and operational:
- ✅ Playwright config uses system Chrome (no browser download needed)
- ✅ Tests run locally without network issues
- ✅ CI workflow configured for GitHub Actions
- ✅ Comprehensive test coverage across 7 test suites (50+ tests)

Some tests may fail if they test features not yet implemented in the app. This is expected as the test suite was designed to guide development.

## Contributing

When adding new features:
1. Write E2E tests for new functionality
2. Ensure tests pass locally before submitting PR
3. Update this documentation with new test coverage
4. Keep test selectors aligned with actual UI implementation

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Using System Browsers](https://playwright.dev/docs/browsers#google-chrome--microsoft-edge)
