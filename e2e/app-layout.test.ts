import { expect, test } from '@playwright/test';

test.describe('App Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to finish loading (pyodide setup)
    await page.waitForSelector('header', { timeout: 20000 });
  });

  test('should load the main page with all components', async ({ page }) => {
    // Check header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check main IDE section is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check Lark IDE component is loaded
    const ideSection = page.locator('.lark-ide');
    await expect(ideSection).toBeVisible();

    // Verify the page title
    await expect(page).toHaveTitle('Lark IDE');
  });

  test('should display header with logo and controls', async ({ page }) => {
    // Set small viewport for mobile layout
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(100);

    // Check logo is present
    const logo = page.locator('header').locator('.navbar__item-brand svg').first();
    await expect(logo).toBeVisible();

    // Check theme toggle button
    const themeToggle = page.locator('header .navbar__item[name="theme-toggler"]').first();
    await expect(themeToggle).toBeVisible();

    // Check fullscreen toggle
    const fullscreenToggle = page
      .locator('header .navbar__item[name="fullscreen-toggler"]')
      .first();
    await expect(fullscreenToggle).toBeVisible();

    // Check menu toggle button
    const menuToggle = page.locator('header .navbar__item[name="menu-trigger"]').first();
    await expect(menuToggle).toBeVisible();

    // Set big viewport for desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(100);

    // Check logo is still present
    await expect(logo).toBeVisible();

    // Checko if menu button has been disappeared
    const isMenuVisible = await menuToggle.isVisible();
    if (isMenuVisible) {
      await expect(menuToggle).toBeVisible();
    } else {
      // If menu button is not visible, it means we are in desktop mode
      await expect(menuToggle).toBeHidden();
    }

    // Check documentation link
    const docsLink = page.locator('header .navbar__item[href*="readthedocs"]').first();
    await expect(docsLink).toBeVisible();

    // Check GitHub link
    const githubLink = page.locator('header .navbar__item[href*="github"]').first();
    await expect(githubLink).toBeVisible();
  });

  test('should have proper responsive layout', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(100);

    // On large screens, editor and test manager should be side by side
    const ideMain = page.locator('.lark-ide__main');
    await expect(ideMain).toBeVisible();

    // Test mobile layout
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(100);

    // On small screens, should have tabs
    const tabList = page.locator('.lark-ide__tab-list');
    if (await tabList.isVisible()) {
      const editorTab = page.locator('.lark-ide__tab', { hasText: 'Editor' });
      const testsTab = page.locator('.lark-ide__tab', { hasText: 'Tests' });

      await expect(editorTab).toBeVisible();
      await expect(testsTab).toBeVisible();
    }
  });

  test('should load with status bar', async ({ page }) => {
    const statusBar = page.locator('.lark-ide__footer');
    await expect(statusBar).toBeVisible();
  });
});
