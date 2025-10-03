import { test, expect } from '@playwright/test';

test.describe('Audit Trail', () => {
  test('audit log updates after vote', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await page.click('text=Audit Log');
    await expect(page.locator('text=Approve')).toBeVisible();
  });
});
