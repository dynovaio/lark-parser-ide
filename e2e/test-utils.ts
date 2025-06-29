import type { Page, Locator } from '@playwright/test';

/**
 * Test utilities for Lark Parser IDE e2e tests
 */

export class LarkIdeTestUtils {
  constructor(private page: Page) {}

  /**
   * Wait for the IDE to fully load including Pyodide initialization
   */
  async waitForIdeLoad(timeout: number = 20000): Promise<void> {
    await this.page.waitForSelector('header', { timeout });
    await this.page.waitForSelector('.lark-ide', { timeout: 5000 });
    // Wait for Pyodide to load
    await this.page.waitForTimeout(3000);
  }

  /**
   * Get the theme toggle button
   */
  getThemeToggle(): Locator {
    return this.page
      .locator('header button')
      .filter({
        hasText: /theme|dark|light/i
      })
      .or(
        this.page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /sun|moon/i })
          .locator('..')
      )
      .first();
  }

  /**
   * Get the fullscreen toggle button
   */
  getFullscreenToggle(): Locator {
    return this.page
      .locator('header button')
      .filter({
        hasText: /fullscreen/i
      })
      .or(
        this.page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /arrows/i })
          .locator('..')
      )
      .first();
  }

  /**
   * Get the GitHub link
   */
  getGitHubLink(): Locator {
    return this.page
      .locator('header a[href*="github"]')
      .or(
        this.page
          .locator('header button')
          .locator('svg')
          .filter({ hasText: /github/i })
          .locator('..')
      )
      .first();
  }

  /**
   * Get the code editor
   */
  getCodeEditor(): Locator {
    return this.page.locator('.cm-content, .CodeMirror textarea, .cm-editor').first();
  }

  /**
   * Get the project selector
   */
  getProjectSelector(): Locator {
    return this.page
      .locator('select')
      .or(this.page.locator('button').filter({ hasText: /project|select/i }))
      .first();
  }

  /**
   * Switch to mobile layout
   */
  async switchToMobileLayout(): Promise<void> {
    await this.page.setViewportSize({ width: 600, height: 800 });
    await this.page.waitForTimeout(500);
  }

  /**
   * Switch to desktop layout
   */
  async switchToDesktopLayout(): Promise<void> {
    await this.page.setViewportSize({ width: 1200, height: 800 });
    await this.page.waitForTimeout(500);
  }

  /**
   * Get the Editor tab (mobile layout)
   */
  getEditorTab(): Locator {
    return this.page.locator('button', { hasText: 'Editor' });
  }

  /**
   * Get the Tests tab (mobile layout)
   */
  getTestsTab(): Locator {
    return this.page.locator('button', { hasText: 'Tests' });
  }

  /**
   * Check if we're in mobile layout (tabs visible)
   */
  async isMobileLayout(): Promise<boolean> {
    const tabList = this.page.locator('.lark-ide__tab-list');
    return await tabList.isVisible();
  }

  /**
   * Toggle theme and return new theme state
   */
  async toggleTheme(): Promise<string> {
    const themeToggle = this.getThemeToggle();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await this.page.waitForTimeout(500);
    }

    const htmlClass = (await this.page.locator('html').getAttribute('class')) || '';
    return htmlClass.includes('dark') ? 'dark' : 'light';
  }

  /**
   * Select a project by name
   */
  async selectProject(projectName: string): Promise<void> {
    const selector = this.getProjectSelector();
    if (await selector.isVisible()) {
      await selector.click();
      await this.page.waitForTimeout(500);

      const option = this.page
        .locator('option, [role="option"], button')
        .filter({
          hasText: new RegExp(projectName, 'i')
        })
        .first();

      if (await option.isVisible()) {
        await option.click();
        await this.page.waitForTimeout(2000); // Wait for project to load
      }
    }
  }

  /**
   * Get all available projects
   */
  async getAvailableProjects(): Promise<string[]> {
    const selector = this.getProjectSelector();
    const projects: string[] = [];

    if (await selector.isVisible()) {
      await selector.click();
      await this.page.waitForTimeout(500);

      const options = this.page.locator('option, [role="option"], button').filter({
        hasText: /calc|json|hello|conf|semver|fruitflies|lark/i
      });

      const count = await options.count();
      for (let i = 0; i < count; i++) {
        const text = await options.nth(i).textContent();
        if (text) {
          projects.push(text.trim());
        }
      }

      // Close dropdown
      await this.page.keyboard.press('Escape');
    }

    return projects;
  }

  /**
   * Type text in the code editor
   */
  async typeInEditor(text: string): Promise<void> {
    const editor = this.getCodeEditor();
    if (await editor.isVisible()) {
      await editor.click();
      await this.page.keyboard.type(text);
    }
  }

  /**
   * Clear and set editor content
   */
  async setEditorContent(content: string): Promise<void> {
    const editor = this.getCodeEditor();
    if (await editor.isVisible()) {
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.type(content);
    }
  }

  /**
   * Get editor content
   */
  async getEditorContent(): Promise<string> {
    const editor = this.page.locator('.cm-editor, .CodeMirror');
    if (await editor.isVisible()) {
      return (await editor.textContent()) || '';
    }
    return '';
  }

  /**
   * Run tests (if run button is available)
   */
  async runTests(): Promise<void> {
    const runButton = this.page.locator('button').filter({ hasText: /run|test|execute/i });
    if (await runButton.first().isVisible()) {
      await runButton.first().click();
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Get test results
   */
  async getTestResults(): Promise<string[]> {
    const results: string[] = [];
    const testResults = this.page
      .locator('.test-result, [data-testid*="result"]')
      .or(this.page.locator('text=/pass|fail|success|error/i'));

    const count = await testResults.count();
    for (let i = 0; i < count; i++) {
      const text = await testResults.nth(i).textContent();
      if (text) {
        results.push(text.trim());
      }
    }

    return results;
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoading(): Promise<void> {
    // Wait for any loading indicators to disappear
    const loader = this.page.locator('.loader, .loading, [data-testid="loader"]');
    if (await loader.isVisible()) {
      await loader.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  /**
   * Check if element has focus
   */
  async hasFocus(locator: Locator): Promise<boolean> {
    return await locator.evaluate((el) => el === document.activeElement);
  }

  /**
   * Get all console errors (excluding known non-critical ones)
   */
  async getCriticalConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out non-critical errors
        if (
          !text.includes('favicon') &&
          !text.includes('net::') &&
          !text.includes('404') &&
          !text.toLowerCase().includes('pyodide')
        ) {
          errors.push(text);
        }
      }
    });

    return errors;
  }
}

/**
 * Create test utils instance
 */
export function createTestUtils(page: Page): LarkIdeTestUtils {
  return new LarkIdeTestUtils(page);
}
