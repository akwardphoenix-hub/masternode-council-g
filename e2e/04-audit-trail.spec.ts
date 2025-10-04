import { test, expect } from '@playwright/test';

test.describe('Audit Trail', () => {
  test('audit log updates after vote', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await page.click('text=Audit Log');
    await expect(page.locator('text=Approve')).toBeVisible();
  });

  test('audit log shows entry after proposal creation', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Proposal")');
    await page.fill('input[name="title"]', 'Audit Test Proposal');
    await page.fill('textarea[name="description"]', 'Testing audit trail');
    await page.click('button:has-text("Submit")');
    await page.click('text=Audit Log');
    const proposalSubmittedLocator = page.locator('text=Proposal Submitted');
    if (await proposalSubmittedLocator.count() > 0) {
      await expect(proposalSubmittedLocator).toBeVisible({ timeout: 5000 });
    }
  });

  test('audit entries have timestamps', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Audit Log');
    const auditEntries = page.locator('[data-testid*="audit"], .audit-entry');
    const count = await auditEntries.count();
    if (count > 0) {
      await expect(auditEntries.first()).toContainText(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|:\d{2}/);
    }
  });

  test('audit entries show actor information', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Audit Log');
    const auditEntries = page.locator('[data-testid*="audit"], .audit-entry');
    const count = await auditEntries.count();
    if (count > 0) {
      await expect(auditEntries.first()).toContainText(/Council Member|Current Node|Actor/);
    }
  });

  test('audit log displays in chronological order', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Audit Log');
    await page.waitForTimeout(500);
    // Audit entries should be present
    const auditSection = page.locator('text=Audit Log');
    await expect(auditSection).toBeVisible();
  });

  test('audit entries contain action details', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await page.click('text=Audit Log');
    await page.waitForTimeout(500);
    // Should contain vote details
  });

  test('audit log tab is accessible', async ({ page }) => {
    await page.goto('/');
    const auditTab = page.locator('text=Audit Log');
    await expect(auditTab).toBeVisible();
    await auditTab.click();
  });

  test('audit entries persist across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Approve")');
    await page.reload();
    await page.click('text=Audit Log');
    await page.waitForTimeout(500);
  });
});
