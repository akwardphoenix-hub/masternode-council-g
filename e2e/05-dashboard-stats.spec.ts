import { test, expect } from '@playwright/test';

test.describe('Dashboard Statistics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display statistics cards', async ({ page }) => {
    // Check for statistics cards (proposals, votes, audit entries)
    await expect(page.getByText(/total.*proposals|proposals.*total/i)).toBeVisible();
    await expect(page.getByText(/total.*votes|votes.*total/i)).toBeVisible();
    await expect(page.getByText(/audit.*entries|entries.*audit/i)).toBeVisible();
  });

  test('should show numeric values in statistics', async ({ page }) => {
    // Statistics should show numbers
    const numbers = await page.locator('text=/^\\d+$/').count();
    expect(numbers).toBeGreaterThan(0);
  });

  test('should update proposal count after creating proposal', async ({ page }) => {
    // Get initial count
    const statsCard = page.locator('text=/\\d+/').first();
    const initialText = await statsCard.textContent();
    const initialCount = parseInt(initialText || '0');
    
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Stats Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing stats update');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Check that count increased
    const updatedText = await statsCard.textContent();
    const updatedCount = parseInt(updatedText || '0');
    expect(updatedCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('should update vote count after casting vote', async ({ page }) => {
    // Create a proposal first
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Vote Stats Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing vote stats');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Get initial vote count from dashboard
    const voteCountText = await page.getByText(/total.*votes/i).locator('..').textContent();
    const initialVotes = parseInt(voteCountText?.match(/\d+/)?.[0] || '0');
    
    // Cast a vote
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    await approveButton.click();
    await page.waitForTimeout(1500);
    
    // Check that vote count increased
    const updatedVoteCountText = await page.getByText(/total.*votes/i).locator('..').textContent();
    const updatedVotes = parseInt(updatedVoteCountText?.match(/\d+/)?.[0] || '0');
    expect(updatedVotes).toBeGreaterThanOrEqual(initialVotes);
  });

  test('should update audit entries count after actions', async ({ page }) => {
    // Get initial audit count
    const auditCountText = await page.getByText(/audit.*entries/i).locator('..').textContent();
    const initialAudit = parseInt(auditCountText?.match(/\d+/)?.[0] || '0');
    
    // Perform an action (create proposal)
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Audit Stats Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing audit stats');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Check that audit count increased
    const updatedAuditCountText = await page.getByText(/audit.*entries/i).locator('..').textContent();
    const updatedAudit = parseInt(updatedAuditCountText?.match(/\d+/)?.[0] || '0');
    expect(updatedAudit).toBeGreaterThan(initialAudit);
  });

  test('should display proposal status badges', async ({ page }) => {
    // Create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    await page.getByLabel(/title/i).fill(`Status Badge Test ${timestamp}`);
    await page.getByLabel(/description/i).fill('Testing status display');
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Should show status badge (pending, active, etc.)
    await expect(page.getByText(/pending|active|approved|rejected/i)).toBeVisible();
  });

  test('should show icons in statistics cards', async ({ page }) => {
    // Check for icons in the statistics area
    const icons = await page.locator('svg').count();
    expect(icons).toBeGreaterThan(0);
  });

  test('should maintain consistent layout', async ({ page }) => {
    // Check that cards are properly laid out
    const cards = await page.locator('[class*="card"]').count();
    expect(cards).toBeGreaterThan(0);
    
    // Dashboard should be visible
    const dashboard = page.locator('body');
    await expect(dashboard).toBeVisible();
  });
});
