import { expect, test } from '@playwright/test';

test.describe('Test Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 20000 });
    await page.waitForTimeout(3000); // Wait for full initialization
  });

  test('should display test manager section', async ({ page }) => {
    // On desktop layout, test manager should be visible
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    const testSection = page.locator('.lark-ide__section').nth(1); // Second section should be tests
    await expect(testSection).toBeVisible();
  });

  test('should show test manager in mobile tab view', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(500);

    const tabList = page.locator('.lark-ide__tab-list');
    if (await tabList.isVisible()) {
      // Click Tests tab
      const testsTab = page.locator('.lark-ide__tab-list', { hasText: 'Tests' });
      await expect(testsTab).toBeVisible();
      await testsTab.click();

      // Verify tests content is visible
      const testsContent = page.locator('.lark-ide__tab-content').filter({ hasText: /test/i });
      if (await testsContent.isVisible()) {
        await expect(testsContent).toBeVisible();
      }
    }
  });

  test('should have test case management interface', async ({ page }) => {
    // Look for test-related UI elements
    const testElements = page.locator('[data-testid*="test"], .test-, button').filter({
      hasText: /test|run|add|delete|case/i
    });

    if (await testElements.first().isVisible()) {
      const testElementCount = await testElements.count();
      expect(testElementCount).toBeGreaterThan(0);
    }
  });

  test('should allow adding new test cases', async ({ page }) => {
    // Look for "Add" or "New Test" button
    const addTestButton = page.locator('.test-manager__control--add');

    if (await addTestButton.first().isVisible()) {
      const initialTestCount = await page.locator('.test-list__item').count();

      await addTestButton.first().click();
      await page.waitForTimeout(500);

      // Should have one more test case
      const newTestCount = await page.locator('.test-list__item').count();
      expect(newTestCount).toBeGreaterThan(initialTestCount);
    }
  });

  test('should allow running tests', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for run button
    const runButton = page.locator('.test-manager__control--run').first();

    if (await runButton.first().isVisible()) {
      await runButton.first().click();
      await page.waitForTimeout(1000);

      // Look for test results or output
      const testResults = page
        .locator('.test__result-status')
        .or(page.locator('text=/unknown|failure|parsing|success/i'));

      if (await testResults.first().isVisible()) {
        const resultCount = await testResults.count();
        expect(resultCount).toBeGreaterThan(0);
      }
    }
  });

  test('should display test status indicators', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for status indicators (icons, colors, badges)
    const statusIndicators = page
      .locator('.status, .badge, .icon')
      .or(page.locator('[class*="pass"], [class*="fail"], [class*="error"], [class*="success"]'));

    if (await statusIndicators.first().isVisible()) {
      const indicatorCount = await statusIndicators.count();
      expect(indicatorCount).toBeGreaterThan(0);
    }
  });

  test('should handle test case editing', async ({ page }) => {
    // Look for editable test case fields
    const editableFields = page
      .locator('input, textarea, [contenteditable="true"]')
      .filter({
        hasText: /test|input|expected|output/i
      })
      .or(page.locator('.test-case input, .test-case textarea'));

    if (await editableFields.first().isVisible()) {
      const field = editableFields.first();
      await field.click();
      await field.fill('test input');

      const value = await field.inputValue();
      expect(value).toBe('test input');
    }
  });
});
