import { test, expect } from '@playwright/test';
import { indexUrl, blockExternal } from './utils';

test.describe('Application Loading and Basic UI', () => {
  test('should load the application successfully', async ({ page }) => {
    await blockExternal(page);
    await page.goto(indexUrl());
    
    // Check that the main title/logo appears
    await expect(page.getByRole('heading', { name: /council/i })).toBeVisible({ timeout: 10000 });
  });

  test('should display the main dashboard components', async ({ page }) => {
    await blockExternal(page);
    await page.goto(indexUrl());
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    // Check for dashboard cards - proposals, votes, audit entries
    await expect(page.getByText(/proposals/i)).toBeVisible();
    await expect(page.getByText(/votes/i)).toBeVisible();
    await expect(page.getByText(/audit/i)).toBeVisible();
  });

  test('should display navigation tabs', async ({ page }) => {
    await blockExternal(page);
    await page.goto(indexUrl());
    await page.waitForLoadState('networkidle');
    
    // Check for tabs
    await expect(page.getByRole('tab', { name: /proposals/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /voting records/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /audit log/i })).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    await blockExternal(page);
    await page.goto(indexUrl());
    await page.waitForLoadState('networkidle');
    
    // Check that content is visible and page is scrollable if needed
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have proper page title', async ({ page }) => {
    await blockExternal(page);
    await page.goto(indexUrl());
    await expect(page).toHaveTitle(/vite|council|spark/i);
  });
});
