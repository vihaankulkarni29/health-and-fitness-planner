import { test, expect } from '@playwright/test';

/**
 * Visual Regression Baseline Tests
 * Captures screenshots of key pages in light and dark mode
 * Run: npx playwright test
 */

test.describe('Visual Regression Baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Landing page - light mode', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('landing-light.png');
  });

  test('Login page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login.png');
  });

  test('Dashboard - authenticated', async ({ page }) => {
    // TODO: Add test user login flow
    // For now, manually test after auth implementation
    await page.goto('http://localhost:3000/login');
    
    // Fill demo credentials
    await page.fill('input[type="email"]', 'vihaan.kulkarni@fitnessdemo.com');
    await page.fill('input[type="password"]', 'trainee123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL('**/dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-light.png');
  });

  test('Modal component', async ({ page }) => {
    // Navigate to Storybook and capture modal
    await page.goto('http://localhost:6006/?path=/story/ui-modal--basic');
    await page.waitForLoadState('networkidle');
    
    // Click to open modal
    await page.click('button:has-text("Open Modal")');
    await page.waitForTimeout(300); // Wait for animation
    
    await expect(page).toHaveScreenshot('modal-open.png');
  });

  test('Theme toggle - dark mode', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Toggle to dark mode (assuming toggle exists on landing)
    await page.click('[aria-label*="theme"]');
    await page.waitForTimeout(200);
    
    await expect(page).toHaveScreenshot('landing-dark.png');
  });
});

test.describe('Component Regression', () => {
  test('Button variants', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-button--all-variants');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('button-variants.png');
  });

  test('Table component', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-table--basic');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('table-basic.png');
  });
});
