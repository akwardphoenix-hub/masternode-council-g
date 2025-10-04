import { defineConfig, devices } from '@playwright/test';
import path from 'path'
import fs from 'fs'

const OFFLINE = process.env.OFFLINE_E2E === '1'

// Helper to compute file:// URL for dist/index.html
function fileIndexUrl() {
  const full = path.resolve(process.cwd(), 'dist', 'index.html')
  const exists = fs.existsSync(full)
  if (!exists) {
    throw new Error('dist/index.html not found. Run: npm run build:offline')
  }
  const url = 'file://' + full.replace(/\\/g, '/')
  return url
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: OFFLINE ? undefined : 'http://localhost:5000',
    trace: 'on-first-retry',
    headless: true,
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  // In offline mode, DO NOT start any web server (firewall blocks HTTP).
  // Tests will navigate to file://dist/index.html instead.
  webServer: OFFLINE ? undefined : {
    command: 'npm run dev',
    port: 5000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  // Provide indexUrl env for tests to consume
  metadata: {
    indexUrl: OFFLINE ? fileIndexUrl() : 'http://localhost:5000/'
  }
});
