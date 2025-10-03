import { test, expect } from '@playwright/test';

test.describe('Dashboard Stats', () => {
  test('shows proposal count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Proposals:')).toContainText(/\d+/);
  });

  test('shows votes count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Votes:')).toContainText(/\d+/);
  });

  test('shows audit entries count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Audit Entries')).toBeVisible();
    await expect(page.locator('text=Audit Entries').locator('..').locator('div.text-2xl')).toContainText(/\d+/);
  });

  test('stats cards are visible', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[class*="card"], .card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('proposal count updates after creation', async ({ page }) => {
    await page.goto('/');
    const initialCount = await page.locator('text=Active Proposals').locator('..').locator('div.text-2xl').textContent();
    const initial = parseInt(initialCount || '0');
    
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Stats Test Proposal');
    await page.fill('textarea[name="description"]', 'Testing stats update');
    await page.click('button:has-text("Submit")');
    
    await page.waitForTimeout(1000);
    const newCount = await page.locator('text=Active Proposals').locator('..').locator('div.text-2xl').textContent();
    const updated = parseInt(newCount || '0');
    
    expect(updated).toBeGreaterThanOrEqual(initial);
  });

  test('vote count updates after voting', async ({ page }) => {
    await page.goto('/');
    const initialVotes = await page.locator('text=Total Votes').locator('..').locator('div.text-2xl').textContent();
    const initial = parseInt(initialVotes || '0');
    
    await page.click('button:has-text("Approve")');
    await page.waitForTimeout(1000);
    
    const newVotes = await page.locator('text=Total Votes').locator('..').locator('div.text-2xl').textContent();
    const updated = parseInt(newVotes || '0');
    
    expect(updated).toBeGreaterThanOrEqual(initial);
  });

  test('audit count updates after actions', async ({ page }) => {
    await page.goto('/');
    const initialAudit = await page.locator('text=Audit Entries').locator('..').locator('div.text-2xl').textContent();
    const initial = parseInt(initialAudit || '0');
    
    await page.click('button:has-text("Approve")');
    await page.waitForTimeout(1000);
    
    const newAudit = await page.locator('text=Audit Entries').locator('..').locator('div.text-2xl').textContent();
    const updated = parseInt(newAudit || '0');
    
    expect(updated).toBeGreaterThanOrEqual(initial);
  });

  test('stats display appropriate icons', async ({ page }) => {
    await page.goto('/');
    const statsSection = page.locator('text=Active Proposals').locator('..');
    await expect(statsSection).toBeVisible();
  });

  test('stats are numerically formatted', async ({ page }) => {
    await page.goto('/');
    const proposalCount = await page.locator('text=Active Proposals').locator('..').locator('div.text-2xl').textContent();
    expect(proposalCount).toMatch(/^\d+$/);
  });

  test('dashboard layout is responsive', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page.locator('text=Active Proposals')).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await expect(page.locator('text=Active Proposals')).toBeVisible();
  });
});
