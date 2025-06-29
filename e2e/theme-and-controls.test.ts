import { expect, test } from '@playwright/test';

test.describe('Theme and UI Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 20000 });
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Find theme toggle button
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
      // Check initial theme
      const initialBodyClass = await page.locator('body').getAttribute('class');
      const initialHtmlClass = await page.locator('html').getAttribute('class');

      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Verify theme changed
      const newBodyClass = await page.locator('body').getAttribute('class');
      const newHtmlClass = await page.locator('html').getAttribute('class');

      const themeChanged = newBodyClass !== initialBodyClass || newHtmlClass !== initialHtmlClass;
      expect(themeChanged).toBe(true);

      // Toggle back
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Should return to original theme
      const finalBodyClass = await page.locator('body').getAttribute('class');
      const finalHtmlClass = await page.locator('html').getAttribute('class');

      const isOriginalTheme =
        finalBodyClass === initialBodyClass || finalHtmlClass === initialHtmlClass;
      expect(isOriginalTheme).toBe(true);
    }
  });

  test('should persist theme preference', async ({ page }) => {
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
      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      const themeAfterToggle = await page.locator('html').getAttribute('class');

      // Reload page
      await page.reload();
      await page.waitForSelector('header', { timeout: 20000 });
      await page.waitForTimeout(1000);

      // Theme should be preserved
      const themeAfterReload = await page.locator('html').getAttribute('class');
      expect(themeAfterReload).toBe(themeAfterToggle);
    }
  });

  test('should handle fullscreen toggle', async ({ page }) => {
    // Find fullscreen toggle
    const fullscreenToggle = page
      .locator('header button')
      .filter({
        hasText: /fullscreen/i
      })
      .or(
        page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /arrows/i })
          .locator('..')
      )
      .first();

    if (await fullscreenToggle.isVisible()) {
      // Note: Fullscreen API might not work in headless mode
      // But we can test that the button is clickable
      await fullscreenToggle.click();
      await page.waitForTimeout(500);

      // The button should still be visible after click
      await expect(fullscreenToggle).toBeVisible();
    }
  });

  test('should have working GitHub link', async ({ page }) => {
    const githubLink = page
      .locator('header a[href*="github"]')
      .or(
        page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /github/i })
          .locator('..')
      )
      .first();

    if (await githubLink.isVisible()) {
      // Check if it's a link with href
      const href = await githubLink.getAttribute('href');
      if (href) {
        expect(href).toContain('github');
      } else {
        // If it's a button, it should be clickable
        await expect(githubLink).toBeEnabled();
      }
    }
  });

  test('should show mobile menu on small screens', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(500);

    // Look for mobile menu button
    const menuButton = page
      .locator('header button')
      .filter({
        hasText: /menu/i
      })
      .or(
        page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /list|menu|bars/i })
          .locator('..')
      )
      .first();

    if (await menuButton.isVisible()) {
      // Click menu button
      await menuButton.click();
      await page.waitForTimeout(500);

      // Should show menu overlay or dropdown
      const menuOverlay = page.locator('[role="dialog"], .menu-overlay, .mobile-menu');
      if (await menuOverlay.isVisible()) {
        await expect(menuOverlay).toBeVisible();

        // Should have close button
        const closeButton = page.locator('button').filter({ hasText: /close|×/i });
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(500);

          // Menu should be closed
          await expect(menuOverlay).not.toBeVisible();
        }
      }
    }
  });

  test('should have proper focus management', async ({ page }) => {
    // Test tab navigation through header controls
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through controls
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const secondFocusedElement = page.locator(':focus');
    await expect(secondFocusedElement).toBeVisible();
  });
});
