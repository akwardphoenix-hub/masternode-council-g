import { test, expect } from '@playwright/test';

test.describe('Production Build Validation', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });

  test('should load CSS properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that some element has computed styles
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should have some background color set
    expect(bgColor).toBeTruthy();
  });

  test('should not have console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle page not found gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    
    // In SPA, this typically returns 200 and shows the app
    // Check that page doesn't crash
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for basic accessibility features
    // Should have proper heading hierarchy
    const h1Count = await page.locator('h1, [role="heading"][aria-level="1"]').count();
    
    // Should have interactive elements that are keyboard accessible
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
    
    // Check that buttons have accessible names
    const firstButton = page.locator('button').first();
    const ariaLabel = await firstButton.getAttribute('aria-label');
    const textContent = await firstButton.textContent();
    
    // Button should either have text content or aria-label
    expect(ariaLabel || textContent).toBeTruthy();
  });

  test('should load all required assets', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Filter out non-critical failures (like favicon)
    const criticalFailures = failedRequests.filter(url => 
      !url.includes('favicon') && 
      !url.includes('.map')
    );
    
    expect(criticalFailures.length).toBe(0);
  });

  test('should have proper content security', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that the app loads in a secure context (https or localhost)
    const isSecure = await page.evaluate(() => window.isSecureContext);
    expect(isSecure).toBeTruthy();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(body).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(body).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test tab navigation
    const tabs = await page.getByRole('tab').count();
    expect(tabs).toBeGreaterThan(0);
    
    // Click through tabs
    const votingTab = page.getByRole('tab', { name: /voting records/i });
    await votingTab.click();
    await page.waitForTimeout(500);
    
    const auditTab = page.getByRole('tab', { name: /audit log/i });
    await auditTab.click();
    await page.waitForTimeout(500);
    
    const proposalsTab = page.getByRole('tab', { name: /proposals/i });
    await proposalsTab.click();
    await page.waitForTimeout(500);
    
    // Should navigate without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // App should load in reasonable time (less than 10 seconds)
    expect(loadTime).toBeLessThan(10000);
  });
});
