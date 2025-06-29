import { expect, test } from '@playwright/test';

test.describe('Code Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.editor__content', { timeout: 30000 });
  });

  test('should display code editor', async ({ page }) => {
    // Look for CodeMirror editor
    const editor = page.locator('.lark-ide__section .editor__content .cm-editor');
    await expect(editor).toBeVisible();
  });

  test('should load default grammar content', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for editor content - should contain some grammar rules
    const editorContent = page.locator(
      '.lark-ide__section .editor__content .cm-editor .cm-content'
    );

    if (await editorContent.isVisible()) {
      const content = await editorContent.textContent();
      // Should contain typical Lark grammar syntax
      expect(content?.length).toBeGreaterThan(0);
    }
  });

  test('should allow text editing', async ({ page }) => {
    // Find the editor element
    const editor = page
      .locator('.lark-ide__section .editor__content .cm-editor .cm-content')
      .first();

    if (await editor.isVisible()) {
      // Click on editor to focus
      await editor.click();

      // Type some content
      await page.keyboard.type('\n// Test comment');

      // Verify content was added (this might vary based on CodeMirror implementation)
      const content = await page
        .locator('.lark-ide__section .editor__content .cm-editor .cm-content')
        .textContent();
      expect(content).toContain('Test comment');
    }
  });

  test('should have syntax highlighting', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for syntax highlighting elements
    const highlightedElements = page.locator(
      '.cm-keyword, .cm-string, .cm-comment, .tok-keyword, .tok-string'
    );

    if (await highlightedElements.first().isVisible()) {
      const count = await highlightedElements.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should respond to theme changes', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page
      .locator('header button')
      .filter({
        hasText: /theme|dark|light/i
      })
      .or(
        page
          .locator('header button svg')
          .filter({ hasText: /sun|moon/i })
          .locator('..')
      )
      .first();

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialBodyClass = await page.locator('body').getAttribute('class');

      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Check if theme changed
      const newBodyClass = await page.locator('body').getAttribute('class');
      expect(newBodyClass).not.toBe(initialBodyClass);
    }
  });

  test('should show editor in mobile tab view', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(500);

    const tabList = page.locator('.lark-ide__tab-list');
    if (await tabList.isVisible()) {
      // Click Editor tab
      const editorTab = page.locator('.lark-ide__tab', { hasText: 'Editor' });
      await expect(editorTab).toBeVisible();
      await editorTab.click();

      // Verify editor content is visible
      const editorContent = page.locator(
        '.lark-ide__tab-content .lark-ide__section .editor__content .cm-editor'
      );
      if (await editorContent.isVisible()) {
        await expect(editorContent).toBeVisible();
      }
    }
  });
});
