import { defineConfig, devices } from '@playwright/test';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// Try to find manually downloaded chromium browser
const chromiumPath = join(homedir(), '.cache', 'ms-playwright', 'chromium-1193', 'chrome-linux', 'chrome');
const useManualChromium = existsSync(chromiumPath);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: useManualChromium ? {
          // Use manually downloaded chromium if headless shell is not available
          executablePath: chromiumPath,
        } : undefined,
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
