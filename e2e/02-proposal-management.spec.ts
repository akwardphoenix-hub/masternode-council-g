import { test, expect } from '@playwright/test';

test.describe('Proposal Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open the proposal submission dialog', async ({ page }) => {
    // Click the submit proposal button
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    
    // Check that the dialog is visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/submit.*proposal/i)).toBeVisible();
  });

  test('should validate required fields in proposal form', async ({ page }) => {
    // Open the dialog
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    
    // Try to submit without filling fields
    const submitButton = page.getByRole('dialog').getByRole('button', { name: /submit/i });
    await submitButton.click();
    
    // Should show an error toast
    await expect(page.getByText(/fill in all fields/i)).toBeVisible({ timeout: 5000 });
  });

  test('should successfully submit a new proposal', async ({ page }) => {
    // Open the dialog
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    
    // Fill in the form
    await page.getByLabel(/title/i).fill('Test Proposal');
    await page.getByLabel(/description/i).fill('This is a test proposal description');
    
    // Submit the form
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    
    // Should show success toast
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Should close the dialog
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Should display the new proposal in the list
    await expect(page.getByText('Test Proposal')).toBeVisible();
  });

  test('should display proposal details correctly', async ({ page }) => {
    // Submit a proposal first
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    await page.getByLabel(/title/i).fill('Detailed Test Proposal');
    await page.getByLabel(/description/i).fill('This proposal has detailed information');
    await page.getByRole('dialog').getByRole('button', { name: /submit/i }).click();
    
    // Wait for success
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    
    // Verify proposal card shows all details
    const proposalCard = page.locator('text=Detailed Test Proposal').locator('..');
    await expect(proposalCard).toContainText('Detailed Test Proposal');
    await expect(proposalCard).toContainText('This proposal has detailed information');
    await expect(proposalCard).toContainText('Council Member');
    await expect(proposalCard).toContainText(/pending/i);
  });

  test('should cancel proposal creation', async ({ page }) => {
    // Open the dialog
    await page.getByRole('button', { name: /submit.*proposal/i }).click();
    
    // Fill some data
    await page.getByLabel(/title/i).fill('Test Cancel');
    
    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Proposal should not be created
    await expect(page.getByText('Test Cancel')).not.toBeVisible();
  });

  test('should display empty state when no proposals exist', async ({ page }) => {
    // Check if empty state is shown (assuming fresh state)
    const hasProposals = await page.getByText(/Test Proposal/i).isVisible().catch(() => false);
    
    if (!hasProposals) {
      await expect(page.getByText(/no proposals yet/i)).toBeVisible();
      await expect(page.getByText(/submit the first proposal/i)).toBeVisible();
    }
  });
});
