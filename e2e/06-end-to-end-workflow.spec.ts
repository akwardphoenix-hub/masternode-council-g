import { test, expect } from '@playwright/test';

test.describe('Complete End-to-End Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full proposal lifecycle', async ({ page }) => {
    const timestamp = Date.now();
    const proposalTitle = `E2E Proposal ${timestamp}`;
    
    // Step 1: Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    await page.getByLabel(/title/i).fill(proposalTitle);
    await page.getByLabel(/description/i).fill('Complete end-to-end test proposal');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Verify proposal was created
    await expect(page.getByText(proposalTitle)).toBeVisible();
    await expect(page.getByText(/success|submitted/i)).toBeVisible({ timeout: 5000 });
    
    // Step 2: Cast a vote
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    await page.waitForTimeout(1500);
    
    // Verify vote was cast
    await expect(page.getByText(/success|voted/i)).toBeVisible({ timeout: 5000 });
    
    // Step 3: Check voting records
    const votingTab = page.getByRole('tab', { name: /voting records/i });
    await votingTab.click();
    await page.waitForTimeout(500);
    
    // Should show the vote in records
    await expect(page.getByText(/approve|current node/i)).toBeVisible();
    
    // Step 4: Check audit log
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Should have entries for both proposal submission and vote
    await expect(page.getByText(/proposal.*submitted|submitted.*proposal/i)).toBeVisible();
    await expect(page.getByText(/vote.*cast|cast.*vote/i)).toBeVisible();
  });

  test('should handle multiple proposals workflow', async ({ page }) => {
    const timestamp = Date.now();
    const proposalCount = 3;
    
    // Create multiple proposals
    for (let i = 0; i < proposalCount; i++) {
      const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
      await createButton.click();
      await page.waitForTimeout(500);
      
      await page.getByLabel(/title/i).fill(`Multi Proposal ${i} ${timestamp}`);
      await page.getByLabel(/description/i).fill(`Description for proposal ${i}`);
      
      const submitButton = page.getByRole('button', { name: /submit/i }).last();
      await submitButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Verify all proposals are visible
    for (let i = 0; i < proposalCount; i++) {
      await expect(page.getByText(`Multi Proposal ${i} ${timestamp}`)).toBeVisible();
    }
    
    // Check statistics updated
    const proposalStat = await page.getByText(/total.*proposals/i).locator('..').textContent();
    const count = parseInt(proposalStat?.match(/\d+/)?.[0] || '0');
    expect(count).toBeGreaterThanOrEqual(proposalCount);
  });

  test('should handle voting on multiple proposals', async ({ page }) => {
    const timestamp = Date.now();
    
    // Create two proposals
    for (let i = 0; i < 2; i++) {
      const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
      await createButton.click();
      await page.waitForTimeout(500);
      
      await page.getByLabel(/title/i).fill(`Vote Multiple ${i} ${timestamp}`);
      await page.getByLabel(/description/i).fill(`Voting test ${i}`);
      
      const submitButton = page.getByRole('button', { name: /submit/i }).last();
      await submitButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Vote on first proposal
    const approveButtons = page.getByRole('button', { name: /approve/i });
    await approveButtons.first().click();
    await page.waitForTimeout(1500);
    
    // Vote on second proposal
    const rejectButtons = page.getByRole('button', { name: /reject/i });
    await rejectButtons.first().click();
    await page.waitForTimeout(1500);
    
    // Check voting records
    const votingTab = page.getByRole('tab', { name: /voting records/i });
    await votingTab.click();
    await page.waitForTimeout(500);
    
    // Should show both votes
    await expect(page.getByText(/approve/i)).toBeVisible();
    await expect(page.getByText(/reject/i)).toBeVisible();
  });

  test('should maintain data consistency across tabs', async ({ page }) => {
    const timestamp = Date.now();
    const proposalTitle = `Consistency Test ${timestamp}`;
    
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    await page.getByLabel(/title/i).fill(proposalTitle);
    await page.getByLabel(/description/i).fill('Testing data consistency');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Navigate through all tabs
    const votingTab = page.getByRole('tab', { name: /voting records/i });
    await votingTab.click();
    await page.waitForTimeout(500);
    
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Go back to proposals
    const proposalsTab = page.getByRole('tab', { name: /proposals/i });
    await proposalsTab.click();
    await page.waitForTimeout(500);
    
    // Proposal should still be there
    await expect(page.getByText(proposalTitle)).toBeVisible();
  });

  test('should handle rapid successive actions', async ({ page }) => {
    const timestamp = Date.now();
    
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    await page.getByLabel(/title/i).fill(`Rapid Action Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing rapid actions');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Immediately vote
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    await page.waitForTimeout(1000);
    
    // Immediately check audit log
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Both actions should be logged
    const auditEntries = await page.locator('text=/proposal|vote/i').count();
    expect(auditEntries).toBeGreaterThanOrEqual(2);
  });

  test('should display proper UI feedback for all actions', async ({ page }) => {
    const timestamp = Date.now();
    
    // Test proposal creation feedback
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    await page.getByLabel(/title/i).fill(`UI Feedback Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing UI feedback');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    
    // Should show success toast
    await expect(page.getByText(/success|submitted/i)).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1500);
    
    // Test voting feedback
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    
    // Should show success toast
    await expect(page.getByText(/success|voted/i)).toBeVisible({ timeout: 5000 });
  });

  test('should preserve data on page refresh', async ({ page }) => {
    const timestamp = Date.now();
    const proposalTitle = `Persistence Test ${timestamp}`;
    
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    await page.getByLabel(/title/i).fill(proposalTitle);
    await page.getByLabel(/description/i).fill('Testing data persistence');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Data should persist (using KV storage)
    await expect(page.getByText(proposalTitle)).toBeVisible({ timeout: 5000 });
  });
});
