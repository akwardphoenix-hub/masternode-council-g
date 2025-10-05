import { defineConfig, devices } from '@playwright/test';

// Use 0.0.0.0 for better compatibility in CI/CD environments
// This allows access from both localhost and container networking
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://0.0.0.0:4173';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list'], ['html']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 }
  },
  // No webServer when PLAYWRIGHT_BASE_URL is set (CI handles it)
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run preview',
    url: 'http://0.0.0.0:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      USE_MOCKS: '1',
      NODE_ENV: 'test',
      VITE_OFFLINE: 'true'
    }
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
