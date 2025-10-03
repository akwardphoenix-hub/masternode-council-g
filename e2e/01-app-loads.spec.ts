import { test, expect } from '@playwright/test';

test.describe('App Loads', () => {
  test('should load dashboard without crashing', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Harmonizer|Uppercut City|Masternode Council/);
  });

  test('should show proposals section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Proposals')).toBeVisible();
  });
});
