import { test, expect } from '@playwright/test';

test.describe('Dashboard Stats', () => {
  test('shows proposal count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Proposals:')).toContainText(/\d+/);
  });

  test('shows votes count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Votes:')).toContainText(/\d+/);
  });
});
