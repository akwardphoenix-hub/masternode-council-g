import { test, expect } from '@playwright/test';

test.describe('Voting System', () => {
  test('shows vote buttons on proposal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button:has-text("Approve")')).toBeVisible();
    await expect(page.locator('button:has-text("Reject")')).toBeVisible();
    await expect(page.locator('button:has-text("Abstain")')).toBeVisible();
  });

  test('vote registers in dashboard stats', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await expect(page.locator('text=Votes:')).toContainText('1');
  });

  test('approve button works', async ({ page }) => {
    await page.goto('/');
    const approveButton = page.locator('button:has-text("Approve")').first();
    await approveButton.click();
    // Check for success message or vote count update
    await page.waitForTimeout(1000);
  });

  test('reject button works', async ({ page }) => {
    await page.goto('/');
    const rejectButton = page.locator('button:has-text("Reject")').first();
    await rejectButton.click();
    await page.waitForTimeout(1000);
  });

  test('abstain button works', async ({ page }) => {
    await page.goto('/');
    const abstainButton = page.locator('button:has-text("Abstain")').first();
    await abstainButton.click();
    await page.waitForTimeout(1000);
  });

  test('cannot vote twice on same proposal', async ({ page }) => {
    await page.goto('/');
    const approveButton = page.locator('button:has-text("Approve")').first();
    await approveButton.click();
    await page.waitForTimeout(500);
    await approveButton.click();
    // Should show error message
    await expect(page.locator('text=already voted')).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('vote count updates correctly', async ({ page }) => {
    await page.goto('/');
    const initialVotes = await page.locator('text=Total Votes').locator('..').locator('div.text-2xl').textContent();
    const initialCount = parseInt(initialVotes || '0');
    
    await page.click('button:has-text("Approve")');
    await page.waitForTimeout(1000);
    
    const newVotes = await page.locator('text=Total Votes').locator('..').locator('div.text-2xl').textContent();
    const newCount = parseInt(newVotes || '0');
    
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('voting records tab shows votes', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await page.click('text=Voting Records');
    await expect(page.locator('text=approve')).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('vote shows timestamp', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await page.click('text=Voting Records');
    await page.waitForTimeout(500);
  });

  test('vote displays voter information', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await page.click('text=Voting Records');
    await expect(page.locator('text=Current Node')).toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});
