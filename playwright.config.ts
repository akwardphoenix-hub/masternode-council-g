import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 * 
 * This configuration uses system-installed Chrome browser to avoid
 * network/firewall issues when downloading Playwright's Chromium binaries.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['line']] : 'html',
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
    // Timeout for individual actions (clicks, fills, etc.)
    actionTimeout: 10000,
    // Timeout for page navigations
    navigationTimeout: 30000,
  },

  // Global timeout for each test
  timeout: 30000,

  // Maximum time to expect for the whole test run
  globalTimeout: process.env.CI ? 600000 : undefined, // 10 minutes in CI

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use system Chrome browser instead of downloading Playwright's Chromium
        // This avoids network/firewall issues during installation
        // Falls back to system Chrome if Playwright browsers aren't installed
        channel: 'chrome',
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    // Add stdout/stderr for debugging in CI
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
