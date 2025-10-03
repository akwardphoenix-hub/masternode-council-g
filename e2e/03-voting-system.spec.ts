import { test, expect } from '@playwright/test';

test.describe('Voting System', () => {
  test('shows vote buttons on proposal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button:has-text("Approve")')).toBeVisible();
    await expect(page.locator('button:has-text("Reject")')).toBeVisible();
    await expect(page.locator('button:has-text("Abstain")')).toBeVisible();
  });

  test('vote registers in dashboard stats', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await expect(page.locator('text=Votes:')).toContainText('1');
  });
});
