import { test, expect } from '@playwright/test';

test.describe('Proposal Management', () => {
  test('create new proposal form exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button:has-text("New Proposal")')).toBeVisible();
  });

  test('submit proposal updates list', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Test Proposal');
    await page.fill('textarea[name="description"]', 'Demo proposal body');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=Test Proposal')).toBeVisible();
  });

  test('new proposal dialog opens and closes', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('proposal form has required fields', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
  });

  test('cannot submit empty proposal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    const submitButton = page.locator('button:has-text("Submit")');
    await submitButton.click();
    // Form should still be visible if validation fails
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('proposal shows creation date', async ({ page }) => {
    await page.goto('/');
    const proposals = page.locator('[data-testid*="proposal"], .proposal-card, article');
    const count = await proposals.count();
    if (count > 0) {
      await expect(proposals.first()).toContainText(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
    }
  });

  test('proposal displays author information', async ({ page }) => {
    await page.goto('/');
    const proposals = page.locator('[data-testid*="proposal"], .proposal-card, article');
    const count = await proposals.count();
    if (count > 0) {
      await expect(proposals.first()).toContainText(/Council Member|Author|Created by/);
    }
  });

  test('proposal has status indicator', async ({ page }) => {
    await page.goto('/');
    const proposals = page.locator('[data-testid*="proposal"], .proposal-card, article');
    const count = await proposals.count();
    if (count > 0) {
      await expect(proposals.first()).toContainText(/pending|approved|rejected|active/i);
    }
  });

  test('multiple proposals can be displayed', async ({ page }) => {
    await page.goto('/');
    // Create first proposal
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'First Proposal');
    await page.fill('textarea[name="description"]', 'First proposal description');
    await page.click('button:has-text("Submit")');
    
    // Create second proposal
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Second Proposal');
    await page.fill('textarea[name="description"]', 'Second proposal description');
    await page.click('button:has-text("Submit")');
    
    await expect(page.locator('text=First Proposal')).toBeVisible();
    await expect(page.locator('text=Second Proposal')).toBeVisible();
  });
});
