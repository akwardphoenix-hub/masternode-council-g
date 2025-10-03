import { test, expect } from '@playwright/test';

test.describe('Proposal Management', () => {
  test('create new proposal form exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button:has-text("New Proposal")')).toBeVisible();
  });

  test('submit proposal updates list', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Test Proposal');
    await page.fill('textarea[name="description"]', 'Demo proposal body');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=Test Proposal')).toBeVisible();
  });
});
