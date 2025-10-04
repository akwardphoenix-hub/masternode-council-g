import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('app loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Basic check that the page loads
    await expect(page).toHaveTitle(/Masternode Council|Council/i);
  });

  test('server responds with 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });
});
