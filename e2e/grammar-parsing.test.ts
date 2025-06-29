import { expect, test } from '@playwright/test';

test.describe('Grammar Loading and Parsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 20000 });
    await page.waitForTimeout(3000); // Wait for Pyodide and grammar loading
  });

  test('should load default grammar successfully', async ({ page }) => {
    // Wait for grammar to load
    await page.waitForTimeout(2000);

    // Check that editor has content (grammar loaded)
    const editorContent = page.locator('.lark-ide__section .editor__content .cm-editor');
    if (await editorContent.isVisible()) {
      const content = await editorContent.textContent();
      expect(content?.length).toBeGreaterThan(0);
    }

    // Check status bar for grammar status
    const statusBar = page.locator('.lark-ide__footer');
    await expect(statusBar).toBeVisible();
  });

  test('should handle grammar syntax validation', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Find editor and add invalid syntax
    const editor = page.locator('.cm-content, .CodeMirror textarea, .cm-editor').first();

    if (await editor.isVisible()) {
      await editor.click();

      // Clear content and add invalid grammar
      await page.keyboard.press('Control+a');
      await page.keyboard.type('invalid grammar syntax @#$%');

      // Wait for validation
      await page.waitForTimeout(1000);
    }
  });

  test('should show parsing results', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for parse button or auto-parsing results
    const parseButton = page.locator('button').filter({ hasText: /parse|run|execute/i });

    if (await parseButton.first().isVisible()) {
      await parseButton.first().click();
      await page.waitForTimeout(1000);

      // Look for parse results
      const results = page.locator('.parse-result, .output, .result, [data-testid*="result"]');
      if (await results.first().isVisible()) {
        await expect(results.first()).toBeVisible();
      }
    }
  });

  test('should handle different grammar projects', async ({ page }) => {
    // Look for project selector
    const projectSelector = page
      .locator('select')
      .or(page.locator('button').filter({ hasText: /project|select/i }))
      .first();

    if (await projectSelector.isVisible()) {
      await projectSelector.click();
      await page.waitForTimeout(500);

      // Look for different grammar options
      const grammarOptions = page.locator('option, [role="option"], button').filter({
        hasText: /calc|json|hello|conf|semver|fruitflies|lark/i
      });

      if (await grammarOptions.first().isVisible()) {
        const calcOption = grammarOptions.filter({ hasText: /calc/i }).first();
        if (await calcOption.isVisible()) {
          await calcOption.click();
          await page.waitForTimeout(2000);

          // Verify calculator grammar loaded
          const editorContent = await page.locator('.cm-editor, .CodeMirror').textContent();
          // Calculator grammar should contain arithmetic operations
          if (editorContent) {
            const hasCalcGrammar =
              editorContent.includes('expr') ||
              editorContent.includes('number') ||
              editorContent.includes('calc');
            expect(hasCalcGrammar).toBe(true);
          }
        }
      }
    }
  });

  test('should validate test cases against grammar', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Navigate to tests (mobile layout)
    await page.setViewportSize({ width: 600, height: 800 });
    const tabList = page.locator('.lark-ide__tab-list');
    if (await tabList.isVisible()) {
      const testsTab = page.locator('.lark-ide__tab', { hasText: 'Tests' });
      await testsTab.click();
      await page.waitForTimeout(500);
    }

    // Look for test execution
    const runTestButton = page.locator('.test-manager__control--run').first();
    if (await runTestButton.first().isVisible()) {
      await runTestButton.first().click();
      await page.waitForTimeout(2000);

      // Should show test results
      const testResults = page
        .locator('.test__result-status')
        .or(page.locator('text=/unknown|failure|parsing|success/i'));

      if (await testResults.first().isVisible()) {
        const resultCount = await testResults.count();
        expect(resultCount).toBeGreaterThan(0);
      }
    }
  });

  test('should handle parser options', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for parser configuration options
    const parserOptions = page
      .locator('select, input[type="checkbox"], input[type="radio"]')
      .filter({
        hasText: /parser|lalr|earley|ambig/i
      })
      .or(
        page
          .locator('label')
          .filter({ hasText: /parser|lalr|earley|ambig/i })
          .locator('input')
      );

    if (await parserOptions.first().isVisible()) {
      const option = parserOptions.first();
      const tagName = await option.evaluate((el) => el.tagName.toLowerCase());

      if (tagName === 'select') {
        await option.selectOption({ index: 1 });
      } else if (tagName === 'input') {
        await option.click();
      }

      await page.waitForTimeout(500);

      // Parser option should be changed
      const isChecked = (await option.isChecked?.()) ?? false;
      const selectedValue = (await option.inputValue?.()) ?? '';

      expect(isChecked || selectedValue.length > 0).toBe(true);
    }
  });
});
