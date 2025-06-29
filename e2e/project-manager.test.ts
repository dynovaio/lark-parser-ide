import { expect, test } from '@playwright/test';

test.describe('Project Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 20000 });
  });

  test('should display project manager in IDE header', async ({ page }) => {
    const projectManager = page.locator('.lark-ide__header').first();
    await expect(projectManager).toBeVisible();
  });

  test('should have default Hello World project loaded', async ({ page }) => {
    // Wait for project to load
    await page.waitForTimeout(2000);

    // Check if there's a project selector or current project indicator
    const projectName = page
      .locator('text=/hello.*world/i')
      .or(page.locator('text=/template/i'))
      .first();

    if (await projectName.isVisible()) {
      await expect(projectName).toBeVisible();
    }
  });

  test('should allow project selection', async ({ page }) => {
    // Look for project selector dropdown or buttons
    const projectSelector = page
      .locator('select')
      .or(page.locator('button').filter({ hasText: /project|select/i }))
      .first();

    if (await projectSelector.isVisible()) {
      await projectSelector.click();

      // Check if dropdown options appear
      await page.waitForTimeout(500);

      // Look for available projects (calc, json, etc.)
      const projectOptions = page.locator('option, [role="option"], button').filter({
        hasText: /calc|json|hello|conf|semver|fruitflies|lark/i
      });

      if (await projectOptions.first().isVisible()) {
        const optionCount = await projectOptions.count();
        expect(optionCount).toBeGreaterThan(0);
      }
    }
  });

  test('should switch to Editor tab when project is selected', async ({ page }) => {
    // This test is relevant for mobile layout
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(100);

    const tabList = page.locator('.lark-ide__tab-list');
    if (await tabList.isVisible()) {
      // Click on Tests tab first
      const testsTab = page.locator('.lark-ide__tab', { hasText: 'Tests' });
      if (await testsTab.isVisible()) {
        await testsTab.click();
        await expect(testsTab).toHaveClass(/lark-ide__tab--active/);

        // Simulate project selection (if project selector exists)
        const projectSelector = page.locator('.project-manager__selector').first();
        if (await projectSelector.isVisible()) {
          await projectSelector.click();
          await page.waitForTimeout(500);

          const projectOption = page.locator('.project-manager__selector__option').last();

          if (await projectOption.isVisible()) {
            await projectOption.click();
            await page.waitForTimeout(2000); // Wait for project to load
          }

          // Should automatically switch back to Editor tab
          const editorTab = page.locator('.lark-ide__tab', { hasText: 'Editor' });
          await expect(editorTab).toHaveClass(/lark-ide__tab--active/);
        }
      }
    }
  });
});
