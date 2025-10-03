import { test, expect } from '@playwright/test';

test.describe('Voting System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Create a test proposal for voting
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill(`Voting Test Proposal ${Date.now()}`);
    await page.getByLabel(/description/i).fill('Proposal for testing voting functionality');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000); // Wait for proposal to be created
  });

  test('should cast an "approve" vote', async ({ page }) => {
    // Find the approve button in the first pending proposal
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await expect(approveButton).toBeVisible();
    await approveButton.click();
    
    // Should show success toast
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Should show that user has voted
    await expect(page.getByText(/already voted/i)).toBeVisible();
    
    // Vote count should update
    await expect(page.getByText(/1 approve/i)).toBeVisible();
  });

  test('should cast a "reject" vote', async ({ page }) => {
    // Find the reject button in the first pending proposal
    const rejectButton = page.getByRole('button', { name: /reject/i }).first();
    await expect(rejectButton).toBeVisible();
    await rejectButton.click();
    
    // Should show success toast
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Should show that user has voted
    await expect(page.getByText(/already voted/i)).toBeVisible();
    
    // Vote count should update
    await expect(page.getByText(/1 reject/i)).toBeVisible();
  });

  test('should cast an "abstain" vote', async ({ page }) => {
    // Find the abstain button in the first pending proposal
    const abstainButton = page.getByRole('button', { name: /abstain/i }).first();
    await expect(abstainButton).toBeVisible();
    await abstainButton.click();
    
    // Should show success toast
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Should show that user has voted
    await expect(page.getByText(/already voted/i)).toBeVisible();
    
    // Vote count should update
    await expect(page.getByText(/1 abstain/i)).toBeVisible();
  });

  test('should prevent duplicate voting', async ({ page }) => {
    // Cast a vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Try to vote again
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    
    // Button should be disabled
    await expect(approveButton).toBeDisabled();
  });

  test('should display vote counts correctly', async ({ page }) => {
    // Cast an approve vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Check vote counts are displayed
    const proposalCard = page.locator('[class*="border"]').first();
    await expect(proposalCard).toContainText(/1 approve/i);
    await expect(proposalCard).toContainText(/0 reject/i);
    await expect(proposalCard).toContainText(/0 abstain/i);
  });

  test('should show votes in voting records tab', async ({ page }) => {
    // Cast a vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Navigate to voting records
    await page.getByRole('tab', { name: /voting.*records/i }).click();
    
    // Should show the vote record
    await expect(page.getByText(/current node/i)).toBeVisible();
    await expect(page.getByText(/approve/i)).toBeVisible();
  });

  test('should persist votes after page reload', async ({ page }) => {
    // Cast a vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Vote should still be visible
    await expect(page.getByText(/already voted/i)).toBeVisible();
    await expect(page.getByText(/1 approve/i)).toBeVisible();
  });
});
