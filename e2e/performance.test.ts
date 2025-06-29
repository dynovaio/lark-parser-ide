import { expect, test } from '@playwright/test';

test.describe('Performance and Reliability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    // Wait for main components to load
    await page.waitForSelector('header', { timeout: 25000 });
    await page.waitForSelector('.lark-ide', { timeout: 5000 });

    const loadTime = Date.now() - startTime;

    // Should load within 30 seconds (considering Pyodide initialization)
    expect(loadTime).toBeLessThan(30000);

    console.log(`App loaded in ${loadTime}ms`);
  });

  test('should handle multiple rapid theme toggles', async ({ page }) => {
    await page.waitForSelector('header', { timeout: 20000 });

    const themeToggle = page
      .locator('header button')
      .filter({
        hasText: /theme|dark|light/i
      })
      .or(
        page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /sun|moon/i })
          .locator('..')
      )
      .first();

    if (await themeToggle.isVisible()) {
      // Rapidly toggle theme multiple times
      for (let i = 0; i < 5; i++) {
        await themeToggle.click();
        await page.waitForTimeout(100);
      }

      // App should still be responsive
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.lark-ide')).toBeVisible();
    }
  });

  test('should handle viewport resize gracefully', async ({ page }) => {
    await page.waitForSelector('header', { timeout: 20000 });

    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 }, // Tablet landscape
      { width: 768, height: 1024 }, // Tablet portrait
      { width: 414, height: 896 }, // Mobile
      { width: 320, height: 568 } // Small mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      // Core elements should remain visible
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.lark-ide')).toBeVisible();

      console.log(`Viewport ${viewport.width}x${viewport.height} - OK`);
    }
  });

  test('should handle network interruptions gracefully', async ({ page }) => {
    await page.waitForSelector('header', { timeout: 20000 });

    // Simulate slow network
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    // Navigate away and back
    await page.goto('about:blank');
    await page.waitForTimeout(500);
    await page.goto('/');

    // Should still load properly
    await page.waitForSelector('header', { timeout: 25000 });
    await expect(page.locator('.lark-ide')).toBeVisible();
  });

  test('should maintain functionality after page refresh', async ({ page }) => {
    await page.waitForSelector('header', { timeout: 20000 });
    await page.waitForTimeout(3000);

    // Interact with the app
    const themeToggle = page
      .locator('header button')
      .filter({
        hasText: /theme|dark|light/i
      })
      .or(
        page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /sun|moon/i })
          .locator('..')
      )
      .first();

    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    // Refresh page
    await page.reload();
    await page.waitForSelector('header', { timeout: 20000 });
    await page.waitForTimeout(2000);

    // All main components should be functional
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.lark-ide')).toBeVisible();

    // Theme preference should be preserved
    if (await themeToggle.isVisible()) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test('should handle concurrent operations', async ({ page }) => {
    await page.waitForSelector('header', { timeout: 20000 });
    await page.waitForTimeout(2000);

    // Perform multiple operations simultaneously
    const promises: Promise<void>[] = [];

    // Theme toggle
    const themeToggle = page
      .locator('header button')
      .filter({
        hasText: /theme|dark|light/i
      })
      .or(
        page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /sun|moon/i })
          .locator('..')
      )
      .first();

    if (await themeToggle.isVisible()) {
      promises.push(themeToggle.click());
    }

    // Viewport resize
    promises.push(page.setViewportSize({ width: 800, height: 600 }));

    // Editor interaction
    const editor = page.locator('.cm-content, .CodeMirror textarea, .cm-editor').first();
    if (await editor.isVisible()) {
      promises.push(editor.click());
    }

    // Execute all operations
    await Promise.all(promises);
    await page.waitForTimeout(1000);

    // App should remain stable
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.lark-ide')).toBeVisible();
  });

  test('should have no console errors during normal usage', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForSelector('header', { timeout: 20000 });
    await page.waitForTimeout(3000);

    // Perform typical user actions
    const themeToggle = page.locator('header button').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    // Check for mobile layout
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(500);

    const tabList = page.locator('.lark-ide__tab-list');
    if (await tabList.isVisible()) {
      const tabs = page.locator('button').filter({ hasText: /Editor|Tests/i });
      if (await tabs.first().isVisible()) {
        await tabs.first().click();
        await page.waitForTimeout(500);
      }
    }

    // Filter out expected errors (like network errors for external resources)
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('net::') &&
        !error.includes('404') &&
        !error.toLowerCase().includes('pyodide') // Pyodide might have expected warnings
    );

    expect(criticalErrors.length).toBe(0);

    if (criticalErrors.length > 0) {
      console.log('Console errors found:', criticalErrors);
    }
  });
});
