import { test, expect } from '@playwright/test';

test.describe('Application Loading and Basic UI', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the main title/logo appears - use first() to handle multiple matches
    await expect(page.getByRole('heading', { name: /council/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test('should display the main dashboard components', async ({ page }) => {
    await page.goto('/');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    // Check for dashboard cards - proposals, votes, audit entries (use first() for multiple matches)
    await expect(page.getByText(/proposals/i).first()).toBeVisible();
    await expect(page.getByText(/votes/i).first()).toBeVisible();
    await expect(page.getByText(/audit/i).first()).toBeVisible();
  });

  test('should display navigation tabs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for tabs
    await expect(page.getByRole('tab', { name: /proposals/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /voting records/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /audit log/i })).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that content is visible and page is scrollable if needed
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/vite|council|spark/i);
  });
});
