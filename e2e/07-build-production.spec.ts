import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Production Build Validation', () => {
  test('should have valid build artifacts', async () => {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Check dist directory exists
    expect(fs.existsSync(distPath)).toBeTruthy();
    
    // Check for index.html
    const indexPath = path.join(distPath, 'index.html');
    expect(fs.existsSync(indexPath)).toBeTruthy();
    
    // Check for assets directory
    const assetsPath = path.join(distPath, 'assets');
    expect(fs.existsSync(assetsPath)).toBeTruthy();
  });

  test('should have valid HTML structure', async () => {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    
    // Check for essential HTML elements
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<html');
    expect(html).toContain('<head>');
    expect(html).toContain('<body>');
    expect(html).toContain('<div id="root">');
  });

  test('should include JavaScript bundles', async () => {
    const assetsPath = path.join(process.cwd(), 'dist', 'assets');
    const files = fs.readdirSync(assetsPath);
    
    // Should have at least one JS file
    const jsFiles = files.filter(f => f.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThan(0);
  });

  test('should include CSS bundles', async () => {
    const assetsPath = path.join(process.cwd(), 'dist', 'assets');
    const files = fs.readdirSync(assetsPath);
    
    // Should have at least one CSS file
    const cssFiles = files.filter(f => f.endsWith('.css'));
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  test('should have proper meta tags', async () => {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    
    // Check for viewport meta tag
    expect(html).toContain('viewport');
    
    // Check for charset
    expect(html).toContain('charset');
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out expected errors (like network errors for missing resources)
    const unexpectedErrors = consoleErrors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('net::ERR')
    );
    
    expect(unexpectedErrors).toHaveLength(0);
  });

  test('should be accessible on different viewports', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should load all critical resources', async ({ page }) => {
    const resourceLoadErrors: string[] = [];
    
    page.on('requestfailed', (request) => {
      resourceLoadErrors.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out non-critical resources (like favicons)
    const criticalErrors = resourceLoadErrors.filter(url => 
      !url.includes('favicon') && 
      !url.includes('.ico') &&
      (url.includes('.js') || url.includes('.css'))
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have reasonable page load time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have interactive elements working in production', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test button interaction
    const submitButton = page.getByRole('button', { name: /submit.*proposal/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    
    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
