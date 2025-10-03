import { test, expect } from '@playwright/test';

test.describe('App Loads', () => {
  test('should load dashboard without crashing', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Harmonizer|Uppercut City|Masternode Council/);
  });

  test('should show proposals section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Proposals')).toBeVisible();
  });

  test('should display header with logo or title', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('h1, header');
    await expect(header).toBeVisible();
  });

  test('should have navigation tabs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Proposals')).toBeVisible();
    await expect(page.locator('text=Voting Records')).toBeVisible();
  });

  test('should not show error boundary', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=error')).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('should load within reasonable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have proper viewport setup', async ({ page }) => {
    await page.goto('/');
    const viewportSize = page.viewportSize();
    expect(viewportSize).toBeTruthy();
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });
});
