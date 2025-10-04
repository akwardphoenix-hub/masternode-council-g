import { test, expect } from '@playwright/test';

test.describe('Voting System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display voting buttons on proposals', async ({ page }) => {
    // First create a proposal to vote on
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Votable Proposal ${timestamp}`);
    await page.getByLabel(/description/i).fill('Proposal for voting test');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Check for voting buttons (approve, reject, abstain)
    await expect(page.getByRole('button', { name: /approve/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /reject/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /abstain/i }).first()).toBeVisible();
  });

  test('should cast an approve vote', async ({ page }) => {
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    const title = `Approve Vote Test ${timestamp}`;
    await page.getByLabel(/title/i).fill(title);
    await page.getByLabel(/description/i).fill('Testing approve vote');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Cast approve vote
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    
    // Should show success message
    await expect(page.getByText(/success|voted/i)).toBeVisible({ timeout: 5000 });
    
    // Vote count should update
    await page.waitForTimeout(1000);
    await expect(page.getByText(/approve.*1|1.*approve/i)).toBeVisible();
  });

  test('should cast a reject vote', async ({ page }) => {
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Reject Vote Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing reject vote');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Cast reject vote
    const rejectButton = page.getByRole('button', { name: /reject/i }).first();
    await rejectButton.click();
    
    // Should show success message
    await expect(page.getByText(/success|voted/i)).toBeVisible({ timeout: 5000 });
  });

  test('should cast an abstain vote', async ({ page }) => {
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Abstain Vote Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing abstain vote');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Cast abstain vote
    const abstainButton = page.getByRole('button', { name: /abstain/i }).first();
    await abstainButton.click();
    
    // Should show success message
    await expect(page.getByText(/success|voted/i)).toBeVisible({ timeout: 5000 });
  });

  test('should prevent duplicate voting', async ({ page }) => {
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Duplicate Vote Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing duplicate vote prevention');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Cast first vote
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    await page.waitForTimeout(1500);
    
    // Try to vote again
    const rejectButton = page.getByRole('button', { name: /reject/i }).first();
    await rejectButton.click();
    
    // Should show error message
    await expect(page.getByText(/already voted|duplicate/i)).toBeVisible({ timeout: 5000 });
  });

  test('should display vote counts', async ({ page }) => {
    // Create a proposal and vote
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Vote Count Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing vote count display');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Cast vote
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    await page.waitForTimeout(1500);
    
    // Check that counts are displayed
    const hasVoteCount = await page.getByText(/\d+/).count();
    expect(hasVoteCount).toBeGreaterThan(0);
  });

  test('should navigate to voting records tab', async ({ page }) => {
    const votingTab = page.getByRole('tab', { name: /voting records/i });
    await votingTab.click();
    await page.waitForTimeout(500);
    
    // Should show voting records content
    await expect(page.getByText(/proposal|voter|vote/i)).toBeVisible();
  });
});
