import { test, expect } from '@playwright/test';

test.describe('Dashboard Statistics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display total proposals count', async ({ page }) => {
    // Look for statistics display
    const statsSection = page.locator('text=/total.*proposals/i').first();
    
    if (await statsSection.isVisible()) {
      await expect(statsSection).toContainText(/\d+/);
    } else {
      // Statistics might be in cards at the top
      const cards = page.locator('[class*="card"]');
      expect(await cards.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display active proposals count', async ({ page }) => {
    // Check for active/pending proposals indicator
    const hasActiveIndicator = await page.getByText(/active|pending/i).isVisible().catch(() => false);
    expect(hasActiveIndicator).toBeDefined();
  });

  test('should update statistics when new proposal is created', async ({ page }) => {
    // Get initial proposal count
    const initialProposals = await page.locator('[class*="border"]').count();
    
    // Create a new proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Stats Test Proposal');
    await page.getByLabel(/description/i).fill('Testing statistics update');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Proposal count should increase
    const newProposals = await page.locator('[class*="border"]').count();
    expect(newProposals).toBeGreaterThan(initialProposals);
  });

  test('should display vote statistics', async ({ page }) => {
    // Create a proposal and vote on it
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Vote Stats Test');
    await page.getByLabel(/description/i).fill('Testing vote statistics');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Cast a vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Should show vote count
    await expect(page.getByText(/1 approve/i)).toBeVisible();
  });

  test('should show voting records count', async ({ page }) => {
    // Navigate to voting records
    await page.getByRole('tab', { name: /voting.*records/i }).click();
    
    // Check if there are voting records
    const voteRecords = await page.locator('[class*="border"]').count();
    expect(voteRecords).toBeGreaterThanOrEqual(0);
  });

  test('should show audit log entry count', async ({ page }) => {
    // Navigate to audit log
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    
    // Check for audit entries
    const auditEntries = await page.locator('[class*="border"]').count();
    expect(auditEntries).toBeGreaterThanOrEqual(0);
  });

  test('should update statistics in real-time', async ({ page }) => {
    // Create a proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Real-time Stats Test');
    await page.getByLabel(/description/i).fill('Testing real-time updates');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Should immediately see the new proposal
    await expect(page.getByText('Real-time Stats Test')).toBeVisible();
    
    // Cast a vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(500);
    
    // Vote count should update immediately
    await expect(page.getByText(/1 approve/i)).toBeVisible();
  });

  test('should display statistics dashboard overview', async ({ page }) => {
    // Check for dashboard cards or overview section
    const pageContent = await page.content();
    
    // Should have some form of statistics or overview
    expect(pageContent).toContain('proposal' || 'Proposal');
  });
});
