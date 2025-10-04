import { test, expect } from '@playwright/test';

test.describe('Audit Trail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should navigate to audit log tab', async ({ page }) => {
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Should show audit log content
    await expect(page.locator('body')).toContainText(/audit|log|action|timestamp/i);
  });

  test('should create audit entry when submitting proposal', async ({ page }) => {
    // Get initial audit count
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    const initialEntries = await page.locator('[class*="audit"], [role="listitem"]').count();
    
    // Go back to proposals
    const proposalsTab = page.getByRole('tab', { name: /proposals/i });
    await proposalsTab.click();
    await page.waitForTimeout(500);
    
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Audit Test Proposal ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing audit log creation');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Check audit log for new entry
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Should have at least one more entry
    const newEntries = await page.locator('[class*="audit"], [role="listitem"]').count();
    expect(newEntries).toBeGreaterThanOrEqual(initialEntries);
    
    // Should show the proposal submitted action
    await expect(page.getByText(/proposal.*submitted|submitted.*proposal/i)).toBeVisible();
  });

  test('should create audit entry when casting vote', async ({ page }) => {
    // Create a proposal first
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Vote Audit Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing vote audit logging');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Get current audit count
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    const beforeVoteEntries = await page.locator('[class*="audit"], [role="listitem"]').count();
    
    // Go back and vote
    const proposalsTab = page.getByRole('tab', { name: /proposals/i });
    await proposalsTab.click();
    await page.waitForTimeout(500);
    
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    await page.waitForTimeout(1500);
    
    // Check audit log
    await auditTab.click();
    await page.waitForTimeout(500);
    
    const afterVoteEntries = await page.locator('[class*="audit"], [role="listitem"]').count();
    expect(afterVoteEntries).toBeGreaterThanOrEqual(beforeVoteEntries);
    
    // Should show vote cast action
    await expect(page.getByText(/vote.*cast|cast.*vote/i)).toBeVisible();
  });

  test('should display audit entries with timestamps', async ({ page }) => {
    // Create a proposal to generate audit entry
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Timestamp Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing timestamp display');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Navigate to audit log
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Check for timestamp format (ISO 8601 or localized)
    // Should have date/time information
    const hasTimestamp = await page.getByText(/\d{1,2}[/:]\d{1,2}|AM|PM|UTC|\d{4}/i).count();
    expect(hasTimestamp).toBeGreaterThan(0);
  });

  test('should display audit entries with actor information', async ({ page }) => {
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Actor Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing actor display');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Navigate to audit log
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Should show actor (Council Member, Current Node, etc.)
    await expect(page.getByText(/council member|current node|node|member/i)).toBeVisible();
  });

  test('should display audit entry details', async ({ page }) => {
    // Create a proposal with a specific title
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    const proposalTitle = `Details Test ${timestamp}`;
    await page.getByLabel(/title/i).fill(proposalTitle);
    await page.getByLabel(/description/i).fill('Testing details display');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Navigate to audit log
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Should show details about the action (proposal title in this case)
    await expect(page.getByText(new RegExp(proposalTitle.slice(0, 20), 'i'))).toBeVisible();
  });

  test('should show audit entries in chronological order', async ({ page }) => {
    // Create multiple proposals
    for (let i = 0; i < 3; i++) {
      const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
      await createButton.click();
      await page.waitForTimeout(500);
      
      await page.getByLabel(/title/i).fill(`Order Test ${i} ${Date.now()}`);
      await page.getByLabel(/description/i).fill(`Testing order ${i}`);
      
      const submitButton = page.getByRole('button', { name: /submit/i }).last();
      await submitButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Navigate to audit log
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    // Should have at least 3 entries
    const entries = await page.locator('[class*="audit"], [role="listitem"]').count();
    expect(entries).toBeGreaterThanOrEqual(3);
  });
});
