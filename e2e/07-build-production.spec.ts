import { test, expect } from '@playwright/test';

test.describe('Production Build', () => {
  test('app loads in production mode', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
