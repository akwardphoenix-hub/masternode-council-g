import { defineConfig, devices } from '@playwright/test';

// Use 0.0.0.0 for better compatibility in CI/CD environments
// This allows access from both localhost and container networking
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://0.0.0.0:4173';

export default defineConfig({
  testDir: './e2e',
  timeout: 20_000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'only-on-failure',
  },
  webServer: {
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
