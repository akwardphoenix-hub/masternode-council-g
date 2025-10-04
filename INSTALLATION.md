# Installation Guide

This guide covers installing and setting up the Masternode Council Governance App for development and testing.

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git** (for cloning the repository)

## Quick Installation

### 1. Install Dependencies

```bash
npm install
```

**✅ Fixed:** Previously, `npm install` would fail because it automatically tried to run E2E tests before Playwright browsers were installed. This circular dependency has been resolved.

### 2. Install Playwright Browsers

**Option A: Standard Installation (Recommended)**

```bash
npx playwright install chromium
```

**Option B: Using Helper Script (If Option A Fails)**

If the standard installation encounters download issues:

```bash
npm run install:browsers
```

Or directly:

```bash
./scripts/install-playwright-browsers.sh
```

### 3. Verify Installation

```bash
# Build the project
npm run build

# Run the development server
npm run dev

# Run E2E tests (in a new terminal)
npm run test:e2e
```

## Detailed Installation Steps

### Step 1: Clone Repository

```bash
git clone https://github.com/akwardphoenix-hub/masternode-council-g.git
cd masternode-council-g
```

### Step 2: Install Node Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 19 and TypeScript
- Vite for building
- Playwright for E2E testing
- UI libraries (Radix UI, Tailwind CSS)

### Step 3: Install Playwright Browsers

Playwright requires browser binaries to run tests. Install them with:

```bash
npx playwright install chromium
```

**System Dependencies (Linux only):**

If you're on Linux and encounter missing system libraries, install them:

```bash
npx playwright install-deps chromium
```

Or use the helper script which handles this automatically:

```bash
npm run install:browsers
```

### Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5000

## Troubleshooting

### Issue: npm install fails or hangs

**Solution:** This was caused by a `prepublish` hook that has been removed. If you're using an older version:

```bash
# Clean install
rm -rf node_modules package-lock.json
git pull  # Get latest fixes
npm install
```

### Issue: Playwright browser installation fails

**Symptoms:**
- `Executable doesn't exist` errors when running tests
- Download failures or timeout errors during `npx playwright install`

**Solutions:**

1. **Use the helper script:**
   ```bash
   npm run install:browsers
   ```

2. **Manual installation:**
   ```bash
   # Install system dependencies
   npx playwright install-deps chromium
   
   # Try installing again
   npx playwright install chromium --force
   ```

3. **Verify installation:**
   ```bash
   ls -la ~/.cache/ms-playwright/
   ```
   
   You should see directories like `chromium-1193` and `chromium_headless_shell-1193`.

### Issue: Port 5000 already in use

```bash
# Kill the process using port 5000
npm run kill

# Or manually
fuser -k 5000/tcp
```

### Issue: Tests fail with timeout errors

Increase the timeout in `playwright.config.ts`:

```typescript
use: {
  baseURL: 'http://localhost:5000',
  trace: 'on-first-retry',
  timeout: 30000,  // Increase from default
},
```

## Configuration Files

### Key Files to Know

- **package.json** - Dependencies and scripts (port 5000 explicitly set)
- **playwright.config.ts** - E2E test configuration
- **vite.config.ts** - Build configuration
- **tsconfig.json** - TypeScript configuration

### Important Changes from Previous Versions

1. **Removed `prepublish` hook** - Previously caused circular dependency during `npm install`
2. **Removed `workspaces` config** - Unnecessary configuration that caused warnings
3. **Explicit port configuration** - Dev server now explicitly uses port 5000 to match Playwright config

## Development Workflow

### Running the App

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug

# View test report
npm run test:report
```

## CI/CD Setup

For continuous integration environments:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install chromium --with-deps

- name: Build application
  run: npm run build

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Next Steps

- Read [TESTING.md](./TESTING.md) for comprehensive testing documentation
- Check [PRD.md](./PRD.md) for product requirements
- See [README.md](./README.md) for feature overview

## Getting Help

If you encounter issues not covered here:

1. Check the [TESTING.md](./TESTING.md) troubleshooting section
2. Verify your Node.js version: `node --version` (should be v18+)
3. Check Playwright documentation: https://playwright.dev/
4. Open an issue on GitHub with:
   - Your Node.js and npm versions
   - Complete error messages
   - Steps to reproduce
