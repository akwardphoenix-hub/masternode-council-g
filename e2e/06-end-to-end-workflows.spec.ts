import { test, expect } from '@playwright/test';

test.describe('End-to-End Workflows', () => {
  test('user can submit proposal and vote', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Workflow Test Proposal');
    await page.click('button:has-text("Submit")');
    await page.click('button:has-text("Approve")');
    await expect(page.locator('text=Workflow Test Proposal')).toBeVisible();
  });
});
