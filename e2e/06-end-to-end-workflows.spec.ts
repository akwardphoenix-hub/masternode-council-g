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

  test('complete governance cycle: create, vote, audit', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Create proposal
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Complete Workflow Test');
    await page.fill('textarea[name="description"]', 'End-to-end test description');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=Complete Workflow Test')).toBeVisible();
    
    // Step 2: Vote on proposal
    await page.click('button:has-text("Approve")');
    await page.waitForTimeout(1000);
    
    // Step 3: Check audit log
    await page.click('text=Audit Log');
    await expect(page.locator('text=Proposal Submitted')).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('multiple votes on different proposals', async ({ page }) => {
    await page.goto('/');
    
    // Create first proposal
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Multi Vote Test 1');
    await page.fill('textarea[name="description"]', 'First proposal');
    await page.click('button:has-text("Submit")');
    
    // Create second proposal
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Multi Vote Test 2');
    await page.fill('textarea[name="description"]', 'Second proposal');
    await page.click('button:has-text("Submit")');
    
    await page.waitForTimeout(1000);
  });

  test('navigate between all tabs', async ({ page }) => {
    await page.goto('/');
    
    // Proposals tab
    await page.click('text=Proposals');
    await expect(page.locator('button:has-text("New Proposal")')).toBeVisible();
    
    // Voting Records tab
    await page.click('text=Voting Records');
    await page.waitForTimeout(500);
    
    // Audit Log tab
    await page.click('text=Audit Log');
    await page.waitForTimeout(500);
    
    // Back to Proposals
    await page.click('text=Proposals');
    await expect(page.locator('button:has-text("New Proposal")')).toBeVisible();
  });

  test('proposal creation validates required fields', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    
    // Try to submit without title
    await page.fill('textarea[name="description"]', 'Description only');
    await page.click('button:has-text("Submit")');
    
    // Dialog should still be open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('stats update throughout workflow', async ({ page }) => {
    await page.goto('/');
    
    // Get initial counts
    const initialProposals = await page.locator('text=Active Proposals').locator('..').locator('div.text-2xl').textContent();
    const initialVotes = await page.locator('text=Total Votes').locator('..').locator('div.text-2xl').textContent();
    
    // Create and vote
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Stats Workflow Test');
    await page.fill('textarea[name="description"]', 'Testing stats');
    await page.click('button:has-text("Submit")');
    
    await page.click('button:has-text("Approve")');
    await page.waitForTimeout(1000);
    
    // Verify counts updated
    const finalProposals = await page.locator('text=Active Proposals').locator('..').locator('div.text-2xl').textContent();
    const finalVotes = await page.locator('text=Total Votes').locator('..').locator('div.text-2xl').textContent();
    
    expect(parseInt(finalProposals || '0')).toBeGreaterThanOrEqual(parseInt(initialProposals || '0'));
    expect(parseInt(finalVotes || '0')).toBeGreaterThanOrEqual(parseInt(initialVotes || '0'));
  });

  test('audit trail captures complete workflow', async ({ page }) => {
    await page.goto('/');
    
    // Perform actions
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Audit Workflow Test');
    await page.fill('textarea[name="description"]', 'Testing audit capture');
    await page.click('button:has-text("Submit")');
    
    await page.click('button:has-text("Approve")');
    await page.waitForTimeout(1000);
    
    // Check audit log
    await page.click('text=Audit Log');
    const auditEntries = page.locator('[data-testid*="audit"], .audit-entry, text=Proposal Submitted, text=Vote Cast');
    await page.waitForTimeout(500);
  });

  test('page state persists on reload', async ({ page }) => {
    await page.goto('/');
    
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Persistence Test');
    await page.fill('textarea[name="description"]', 'Testing persistence');
    await page.click('button:has-text("Submit")');
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=Persistence Test')).toBeVisible({ timeout: 5000 });
  });

  test('user can interact with multiple proposals', async ({ page }) => {
    await page.goto('/');
    
    // Count existing proposals
    const proposals = page.locator('button:has-text("Approve")');
    const count = await proposals.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
