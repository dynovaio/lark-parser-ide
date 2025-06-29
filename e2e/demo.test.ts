import { expect, test } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('home page loads with header and main content', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to finish loading (pyodide setup)
    await page.waitForSelector('header', { timeout: 15000 });

    const header = page.locator('header');
    await expect(header).toBeVisible();

    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify the page title
    await expect(page).toHaveTitle('Lark IDE');
  });

  test('critical components are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 15000 });

    // Check IDE component
    const ide = page.locator('.lark-ide');
    await expect(ide).toBeVisible();

    // Check project manager
    const projectManager = page.locator('.lark-ide__header');
    await expect(projectManager).toBeVisible();

    // Check status bar
    const statusBar = page.locator('.lark-ide__footer');
    await expect(statusBar).toBeVisible();
  });

  test('app loads without critical errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForSelector('header', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('net::') &&
        !error.includes('404') &&
        !error.toLowerCase().includes('pyodide')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
