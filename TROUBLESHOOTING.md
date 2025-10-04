# Troubleshooting Guide

Common issues and their solutions for the Masternode Council Governance App.

## E2E Test Issues

### ❌ "Executable doesn't exist" Error

**Error Message:**
```
Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium_headless_shell-1193/chrome-linux/headless_shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
╚═════════════════════════════════════════════════════════════════════════╝
```

**Cause:** Playwright browsers have not been installed.

**Solution:**
```bash
npx playwright install chromium
```

After running this command, you should be able to run e2e tests:
```bash
npm run test:e2e
```

**Why does this happen?**
- Playwright browsers are not installed automatically with `npm install`
- They require a separate installation step
- This is by design to save bandwidth and disk space
- Browsers are ~200MB and not needed for development-only workflows

### ❌ Port Already in Use

**Error Message:**
```
Error: Port 5000 is already in use
```

**Solution:**
```bash
# Kill process on port 5000
npm run kill

# Or manually
fuser -k 5000/tcp
```

### ❌ Tests Timing Out

**Symptoms:**
- Tests hang or take very long to complete
- "Timeout" errors in test output

**Solutions:**

1. **Increase timeout in individual tests:**
```typescript
test('my slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

2. **Increase global timeout in `playwright.config.ts`:**
```typescript
export default defineConfig({
  timeout: 60000, // 60 seconds
  // ... other config
});
```

3. **Check if dev server is running:**
```bash
# Make sure nothing is blocking the dev server
npm run kill
npm run dev
```

### ❌ Tests Fail After Code Changes

**Symptoms:**
- Tests that previously passed are now failing
- UI elements can't be found

**Solutions:**

1. **Update test selectors:**
   - Check if you changed component text or structure
   - Update test selectors to match new UI

2. **Clear browser cache:**
```bash
# Clear Playwright cache
rm -rf /home/runner/.cache/ms-playwright
npx playwright install chromium
```

3. **Run tests in headed mode to debug:**
```bash
npm run test:e2e:headed
```

4. **Use debug mode for step-by-step debugging:**
```bash
npm run test:e2e:debug
```

## Development Issues

### ❌ TypeScript Errors

**Solution:**
```bash
# Check TypeScript errors
npm run build

# If using an IDE, restart the TypeScript language server
```

### ❌ Vite Dev Server Not Starting

**Symptoms:**
```
Error: Port 5000 is already in use
```

**Solution:**
```bash
# Kill process on port 5000
npm run kill

# Then restart
npm run dev
```

### ❌ CSS Not Loading

**Symptoms:**
- App looks unstyled
- No colors or layout

**Solution:**
```bash
# Clear build cache and restart
rm -rf dist
npm run dev
```

## Installation Issues

### ❌ npm install Fails

**Solution:**

1. **Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Check Node.js version:**
```bash
node --version  # Should be v18+ or v20+
```

3. **Use specific npm version:**
```bash
npm install -g npm@latest
```

### ❌ Dependency Version Conflicts

**Solution:**
```bash
# Remove lockfile and reinstall
rm package-lock.json
npm install
```

## CI/CD Issues

### ❌ GitHub Actions Failing

**Common causes:**
1. Missing Playwright installation in workflow
2. Port conflicts
3. Timeout issues in CI environment

**Solution for GitHub Actions:**
```yaml
- name: Install Playwright Browsers
  run: npx playwright install chromium --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

## Getting More Help

If you're still stuck after trying these solutions:

1. **Check existing issues:** [GitHub Issues](https://github.com/akwardphoenix-hub/masternode-council-g/issues)
2. **Create a new issue:** Include:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, npm version)
   - What you've tried so far

3. **Useful debugging commands:**
```bash
# Show environment info
node --version
npm --version
npx playwright --version

# Show installed Playwright browsers
npx playwright list-browsers

# Show running processes on port 5000
lsof -i :5000
# or
fuser 5000/tcp
```
