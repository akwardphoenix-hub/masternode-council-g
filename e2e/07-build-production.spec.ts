import { test, expect } from '@playwright/test';

test.describe('Production Build', () => {
  test('app loads in production mode', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('no console errors in production', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('all assets load successfully', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(failedRequests.length).toBe(0);
  });

  test('CSS is properly loaded', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('button:has-text("New Proposal")').first();
    const backgroundColor = await button.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should have some background color (not transparent/initial)
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('JavaScript bundle is loaded', async ({ page }) => {
    await page.goto('/');
    
    // React should be loaded and rendering
    const root = page.locator('#root');
    const hasContent = await root.evaluate(el => el.children.length > 0);
    
    expect(hasContent).toBe(true);
  });

  test('page is interactive', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('button:has-text("New Proposal")');
    await expect(button).toBeEnabled();
    await button.click();
    
    // Dialog should open, indicating interactivity
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('responsive design works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('fonts are loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    const fontFamily = await body.evaluate(el => 
      window.getComputedStyle(el).fontFamily
    );
    
    expect(fontFamily).toBeTruthy();
  });

  test('images and icons render', async ({ page }) => {
    await page.goto('/');
    
    // Check for SVG icons or images
    const icons = page.locator('svg');
    const count = await icons.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('meta tags are present', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('app initializes without errors', async ({ page }) => {
    let hasError = false;
    
    page.on('pageerror', () => {
      hasError = true;
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(hasError).toBe(false);
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Voting Records');
    await page.waitForTimeout(500);
    
    await page.click('text=Audit Log');
    await page.waitForTimeout(500);
    
    await page.click('text=Proposals');
    await page.waitForTimeout(500);
  });
});
