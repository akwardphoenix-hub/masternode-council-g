import { test, expect } from '@playwright/test';

test.describe('End-to-End Workflows', () => {
  test('complete workflow: create proposal → vote → verify audit', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Step 1: Create a proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('E2E Test Proposal');
    await page.getByLabel(/description/i).fill('Testing complete workflow');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Step 2: Verify proposal appears
    await expect(page.getByText('E2E Test Proposal')).toBeVisible();
    
    // Step 3: Cast a vote
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Step 4: Verify vote was recorded
    await page.getByRole('tab', { name: /voting.*records/i }).click();
    await expect(page.getByText(/approve/i)).toBeVisible();
    
    // Step 5: Verify audit trail
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    await expect(page.getByText(/proposal submitted/i)).toBeVisible();
    await expect(page.getByText(/vote cast/i)).toBeVisible();
  });

  test('workflow: multiple proposals with different vote outcomes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Create first proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Proposal A');
    await page.getByLabel(/description/i).fill('First proposal');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Create second proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Proposal B');
    await page.getByLabel(/description/i).fill('Second proposal');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Both should be visible
    await expect(page.getByText('Proposal A')).toBeVisible();
    await expect(page.getByText('Proposal B')).toBeVisible();
    
    // Vote on first proposal
    const proposals = page.locator('[class*="border"]');
    await proposals.first().getByRole('button', { name: /approve/i }).click();
    await page.waitForTimeout(500);
    
    // Verify we can only vote once per proposal
    await expect(proposals.first().getByRole('button', { name: /approve/i })).toBeDisabled();
  });

  test('workflow: proposal creation → cancellation → recreation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open dialog
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Cancelled Proposal');
    
    // Cancel
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Verify proposal wasn't created
    await expect(page.getByText('Cancelled Proposal')).not.toBeVisible();
    
    // Create a new proposal successfully
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Successful Proposal');
    await page.getByLabel(/description/i).fill('This one is submitted');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    await expect(page.getByText('Successful Proposal')).toBeVisible();
  });

  test('workflow: navigation between tabs with data persistence', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Create a proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Navigation Test');
    await page.getByLabel(/description/i).fill('Testing navigation');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    // Vote on it
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Navigate through all tabs
    await page.getByRole('tab', { name: /voting.*records/i }).click();
    await expect(page.getByText(/current node/i)).toBeVisible();
    
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    await expect(page.getByText(/proposal submitted/i)).toBeVisible();
    
    await page.getByRole('tab', { name: /proposals/i }).click();
    await expect(page.getByText('Navigation Test')).toBeVisible();
    await expect(page.getByText(/already voted/i)).toBeVisible();
  });

  test('workflow: page reload preserves all data', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Create proposal and vote
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Persistence Test Workflow');
    await page.getByLabel(/description/i).fill('Testing data persistence');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: /approve/i }).first().click();
    await page.waitForTimeout(1000);
    
    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify proposal still exists
    await expect(page.getByText('Persistence Test Workflow')).toBeVisible();
    
    // Verify vote is still recorded
    await page.getByRole('tab', { name: /voting.*records/i }).click();
    await expect(page.getByText(/approve/i)).toBeVisible();
    
    // Verify audit log is preserved
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    await expect(page.getByText(/proposal submitted/i)).toBeVisible();
  });

  test('workflow: validation errors are properly handled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty proposal
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/fill in all fields/i)).toBeVisible({ timeout: 5000 });
    
    // Dialog should still be open
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Fill only title
    await page.getByLabel(/title/i).fill('Only Title');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/fill in all fields/i)).toBeVisible({ timeout: 5000 });
    
    // Fill description too
    await page.getByLabel(/description/i).fill('Now with description');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    
    // Should succeed
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Only Title')).toBeVisible();
  });

  test('workflow: user feedback through toast notifications', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Success toast on proposal creation
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Toast Test');
    await page.getByLabel(/description/i).fill('Testing notifications');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Success toast on voting
    await page.getByRole('button', { name: /approve/i }).first().click();
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Error toast on duplicate vote attempt
    await page.getByRole('button', { name: /reject/i }).first().click();
    await expect(page.getByText(/already voted/i)).toBeVisible({ timeout: 5000 });
  });
});
