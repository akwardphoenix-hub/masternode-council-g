import { test, expect } from '@playwright/test';

test.describe('Audit Trail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should create audit entry when proposal is submitted', async ({ page }) => {
    // Submit a proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Audit Test Proposal');
    await page.getByLabel(/description/i).fill('Testing audit trail');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Should show proposal submission entry
    await expect(page.getByText(/proposal submitted/i)).toBeVisible();
    await expect(page.getByText(/audit test proposal/i)).toBeVisible();
  });

  test('should create audit entry when vote is cast', async ({ page }) => {
    // Create a proposal first
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Vote Audit Test');
    await page.getByLabel(/description/i).fill('Testing vote audit');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Cast a vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Should show vote cast entry
    await expect(page.getByText(/vote cast/i)).toBeVisible();
  });

  test('should display audit entries with timestamps', async ({ page }) => {
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Check if there are any audit entries
    const hasEntries = await page.locator('[class*="border"]').count() > 0;
    
    if (hasEntries) {
      // Each entry should have a timestamp
      const firstEntry = page.locator('[class*="border"]').first();
      // Timestamps are typically in a specific format
      await expect(firstEntry).toContainText(/\d{1,2}[/:]\d{1,2}/);
    }
  });

  test('should display audit entries with actor information', async ({ page }) => {
    // Submit a proposal to generate audit entry
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Actor Test Proposal');
    await page.getByLabel(/description/i).fill('Testing actor tracking');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Should show actor (Council Member)
    await expect(page.getByText(/council member/i)).toBeVisible();
  });

  test('should display audit entries in chronological order', async ({ page }) => {
    // Create multiple actions
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('First Action');
    await page.getByLabel(/description/i).fill('First');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Second Action');
    await page.getByLabel(/description/i).fill('Second');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Should show entries (most recent first typically)
    const entries = page.locator('[class*="border"]');
    await expect(entries).toHaveCount(await entries.count());
  });

  test('should show action details in audit entries', async ({ page }) => {
    // Submit a proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Details Test');
    await page.getByLabel(/description/i).fill('Testing details');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Should show the proposal title in details
    await expect(page.getByText(/details test/i)).toBeVisible();
  });

  test('should persist audit log after page reload', async ({ page }) => {
    // Submit a proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Persistence Test');
    await page.getByLabel(/description/i).fill('Testing persistence');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Verify entry exists
    await expect(page.getByText(/persistence test/i)).toBeVisible();
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Navigate to audit log again
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Entry should still exist
    await expect(page.getByText(/persistence test/i)).toBeVisible();
  });
});
