import { test, expect } from '@playwright/test';
import { indexUrl, blockExternal } from './utils';

test.describe('Proposal Management', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternal(page);
    await page.goto(indexUrl());
    await page.waitForLoadState('networkidle');
  });

  test('should display create proposal button', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /new proposal|create|submit proposal/i });
    await expect(createButton).toBeVisible();
  });

  test('should open proposal creation dialog', async ({ page }) => {
    // Find and click the create proposal button
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    
    // Check that dialog appears
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    
    // Check for form fields
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
  });

  test('should validate empty proposal submission', async ({ page }) => {
    // Open dialog
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    // Try to submit without filling fields
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    
    // Should show error toast or validation message
    await expect(page.getByText(/please fill|required|empty/i)).toBeVisible({ timeout: 3000 });
  });

  test('should create a new proposal successfully', async ({ page }) => {
    // Open dialog
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    // Fill in the form
    const timestamp = Date.now();
    const title = `Test Proposal ${timestamp}`;
    const description = `This is a test proposal created at ${new Date().toISOString()}`;
    
    await page.getByLabel(/title/i).fill(title);
    await page.getByLabel(/description/i).fill(description);
    
    // Submit the proposal
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    
    // Wait for success message
    await expect(page.getByText(/success|submitted/i)).toBeVisible({ timeout: 5000 });
    
    // Check that proposal appears in the list
    await page.waitForTimeout(1000);
    await expect(page.getByText(title)).toBeVisible();
  });

  test('should display proposal details', async ({ page }) => {
    // First create a proposal
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    const timestamp = Date.now();
    const title = `Detailed Proposal ${timestamp}`;
    const description = `Detailed description for testing`;
    
    await page.getByLabel(/title/i).fill(title);
    await page.getByLabel(/description/i).fill(description);
    
    const submitButton = page.getByRole('button', { name: /submit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(1500);
    
    // Check that proposal shows required fields
    const proposalCard = page.locator(`text=${title}`).first();
    await expect(proposalCard).toBeVisible();
    
    // Should show author
    await expect(page.getByText(/council member|author/i)).toBeVisible();
    
    // Should show status
    await expect(page.getByText(/pending|active/i)).toBeVisible();
  });

  test('should cancel proposal creation', async ({ page }) => {
    // Open dialog
    const createButton = page.getByRole('button', { name: /new proposal|create|add|plus/i }).first();
    await createButton.click();
    await page.waitForTimeout(500);
    
    // Fill in some data
    await page.getByLabel(/title/i).fill('Test Title');
    
    // Click cancel
    const cancelButton = page.getByRole('button', { name: /cancel/i }).last();
    await cancelButton.click();
    
    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
  });
});
