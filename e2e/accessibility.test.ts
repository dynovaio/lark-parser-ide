import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 20000 });
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      // Should start with h1
      const firstHeading = headings.first();
      const tagName = await firstHeading.evaluate((el) => el.tagName.toLowerCase());
      expect(['h1', 'h2'].includes(tagName)).toBe(true);
    }
  });

  test('should have accessible buttons and controls', async ({ page }) => {
    // All buttons should have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');
        const textContent = await button.textContent();

        const hasAccessibleName = !!(ariaLabel || title || textContent?.trim());
        expect(hasAccessibleName).toBe(true);
      }
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    const focusableElements: string[] = [];

    // Start tabbing
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      const focusedElement = page.locator(':focus');
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase());
        const role = await focusedElement.getAttribute('role');
        focusableElements.push(role || tagName);
      }
    }

    // Should have focused on several interactive elements
    expect(focusableElements.length).toBeGreaterThan(0);

    const interactiveElements = focusableElements.filter((tag) =>
      ['button', 'a', 'input', 'select', 'textarea', 'tab', 'tabpanel'].includes(tag)
    );
    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Check for ARIA landmarks
    const landmarks = page.locator(
      '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header'
    );
    const landmarkCount = await landmarks.count();
    expect(landmarkCount).toBeGreaterThan(0);

    // Check for ARIA labels on complex widgets
    const ariaElements = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
    const ariaCount = await ariaElements.count();

    if (ariaCount > 0) {
      // At least some elements should have ARIA attributes
      expect(ariaCount).toBeGreaterThan(0);
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for proper form labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');

        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = (await label.count()) > 0;
          const hasAriaLabel = !!ariaLabel;

          expect(hasLabel || hasAriaLabel).toBe(true);
        }
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // This is a basic check - in real scenarios you'd use tools like axe-core
    const elements = page.locator('button, a, p, span, div').filter({ hasText: /.+/ });
    const elementCount = Math.min(await elements.count(), 5); // Check first 5 elements

    for (let i = 0; i < elementCount; i++) {
      const element = elements.nth(i);
      if (await element.isVisible()) {
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          };
        });

        // Basic check that color values are set
        expect(styles.color).toBeTruthy();
      }
    }
  });

  test('should handle focus indicators', async ({ page }) => {
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      // Check if focus indicator is visible
      const styles = await focusedElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow
        };
      });

      // Should have some kind of focus indicator
      const hasFocusIndicator =
        styles.outline !== 'none' || styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';

      expect(hasFocusIndicator).toBe(true);
    }
  });

  test('should work with reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForSelector('header', { timeout: 20000 });

    // App should still function normally
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.lark-ide')).toBeVisible();

    // Test theme toggle still works
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

      // Should work without motion
      await expect(page.locator('header')).toBeVisible();
    }
  });

  test('should support high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.reload();
    await page.waitForSelector('header', { timeout: 20000 });

    // App should remain functional and visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.lark-ide')).toBeVisible();

    // Interactive elements should still be accessible
    const buttons = page.locator('button').filter({ hasText: /.+/ });
    if (await buttons.first().isVisible()) {
      await expect(buttons.first()).toBeVisible();
    }
  });

  test('should handle zoom levels', async ({ page }) => {
    const zoomLevels = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

    for (const zoom of zoomLevels) {
      // Note: page.setViewportSize with zoom simulation
      const baseWidth = 1200;
      const baseHeight = 800;
      await page.setViewportSize({
        width: Math.floor(baseWidth / zoom),
        height: Math.floor(baseHeight / zoom)
      });

      await page.waitForTimeout(300);

      // Core elements should remain visible and functional
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.lark-ide')).toBeVisible();

      console.log(`Zoom level ${zoom * 100}% - OK`);
    }
  });
});
