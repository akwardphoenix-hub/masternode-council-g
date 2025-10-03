import { test, expect } from '@playwright/test';

test.describe('Application Loading', () => {
  test('should load the application without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Wait for the main content to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    
    // Verify no console errors on initial load
    expect(consoleErrors).toHaveLength(0);
  });

  test('should display the main header with council name', async ({ page }) => {
    await page.goto('/');
    
    // Check for the main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Council');
  });

  test('should render all main navigation tabs', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tabs to load
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
    
    // Check for the three main tabs
    await expect(page.getByRole('tab', { name: /proposals/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /voting.*records/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /audit.*log/i })).toBeVisible();
  });

  test('should have functional tab navigation', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tabs to load
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
    
    // Click on Voting Records tab
    await page.getByRole('tab', { name: /voting.*records/i }).click();
    await expect(page.getByRole('tabpanel')).toContainText(/voting/i);
    
    // Click on Audit Log tab
    await page.getByRole('tab', { name: /audit.*log/i }).click();
    await expect(page.getByRole('tabpanel')).toContainText(/audit/i);
    
    // Click back on Proposals tab
    await page.getByRole('tab', { name: /proposals/i }).click();
    await expect(page.getByRole('tabpanel')).toContainText(/proposal/i);
  });

  test('should display the "Submit Proposal" button', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for submit proposal button
    const submitButton = page.getByRole('button', { name: /submit.*proposal/i });
    await expect(submitButton).toBeVisible();
  });
});
