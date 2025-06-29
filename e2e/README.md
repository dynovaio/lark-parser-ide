# End-to-End Test Suite for Lark Parser IDE

This directory contains comprehensive end-to-end tests for the Lark Parser IDE application using Playwright.

## Test Structure

### Test Files

- **`demo.test.ts`** - Smoke tests to verify basic functionality
- **`app-layout.test.ts`** - Tests for overall application layout and responsiveness
- **`project-manager.test.ts`** - Tests for project selection and management
- **`code-editor.test.ts`** - Tests for the grammar editor functionality
- **`test-manager.test.ts`** - Tests for test case management and execution
- **`theme-and-controls.test.ts`** - Tests for UI controls, theming, and navigation
- **`grammar-parsing.test.ts`** - Tests for grammar loading, parsing, and validation
- **`performance.test.ts`** - Performance and reliability tests
- **`accessibility.test.ts`** - Accessibility and usability tests

### Utilities

- **`test-utils.ts`** - Helper utilities and page object methods
- **`global-setup.ts`** - Global test setup configuration

## Running Tests

### Basic Commands

```bash
# Run all e2e tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests with browser heads visible
npm run test:e2e:headed

# Run only smoke tests
npm run test:e2e:smoke
```

### Browser-Specific Tests

```bash
# Run tests in Chrome only
npm run test:e2e:chrome

# Run tests in Firefox only
npm run test:e2e:firefox

# Run tests in Safari only
npm run test:e2e:webkit

# Run tests on mobile devices
npm run test:e2e:mobile
```

### Test Reports

```bash
# Show test report
npm run test:e2e:report
```

## Test Coverage

### Core Functionality

- ✅ Application loading and initialization
- ✅ Pyodide setup and grammar loading
- ✅ Project selection and switching
- ✅ Code editor functionality
- ✅ Test case management
- ✅ Grammar parsing and validation

### UI/UX Features

- ✅ Responsive design (desktop/mobile)
- ✅ Theme switching (light/dark)
- ✅ Header controls and navigation
- ✅ Tab navigation (mobile layout)
- ✅ Status bar display

### Cross-Browser Support

- ✅ Chromium/Chrome
- ✅ Firefox
- ✅ WebKit/Safari
- ✅ Mobile browsers

### Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Color contrast
- ✅ High contrast mode
- ✅ Reduced motion support

### Performance

- ✅ Load time validation
- ✅ Responsiveness under load
- ✅ Memory usage (basic)
- ✅ Error handling
- ✅ Network resilience

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Timeout**: 60 seconds per test
- **Retries**: 2 retries on CI
- **Browsers**: Chrome, Firefox, Safari, Mobile
- **Screenshots**: On failure
- **Video**: On failure
- **Traces**: On retry

## Writing New Tests

### Using Test Utils

```typescript
import { test, expect } from '@playwright/test';
import { createTestUtils } from './test-utils';

test('my new test', async ({ page }) => {
  const utils = createTestUtils(page);

  await page.goto('/');
  await utils.waitForIdeLoad();

  // Use utility methods
  await utils.toggleTheme();
  await utils.selectProject('calc');
  await utils.setEditorContent('expr: NUMBER');

  // Make assertions
  const content = await utils.getEditorContent();
  expect(content).toContain('expr: NUMBER');
});
```

### Best Practices

1. **Wait for full initialization**: Always call `utils.waitForIdeLoad()` or wait for the header
2. **Use utility methods**: Leverage the test utils for common operations
3. **Handle async operations**: Wait for animations and loading states
4. **Test both layouts**: Consider desktop and mobile viewports
5. **Clean up state**: Tests should be independent
6. **Use descriptive test names**: Make it clear what is being tested
7. **Group related tests**: Use `test.describe()` blocks

### Common Patterns

```typescript
// Wait for app to load
await page.goto('/');
await utils.waitForIdeLoad();

// Switch to mobile layout
await utils.switchToMobileLayout();
if (await utils.isMobileLayout()) {
  await utils.getTestsTab().click();
}

// Handle optional elements
const button = page.locator('button.optional');
if (await button.isVisible()) {
  await button.click();
}

// Test theme switching
const initialTheme = await utils.toggleTheme();
expect(initialTheme).toMatch(/light|dark/);
```

## Debugging Tests

### Debug Mode

```bash
npm run test:e2e:debug
```

This opens the Playwright inspector for step-by-step debugging.

### UI Mode

```bash
npm run test:e2e:ui
```

This opens the Playwright UI for interactive test running and debugging.

### Headed Mode

```bash
npm run test:e2e:headed
```

This runs tests with the browser window visible.

## CI/CD Integration

The tests are configured to run in CI with:

- Retry on failure (2 retries)
- GitHub reporter for CI environments
- Artifacts collection (screenshots, videos, traces)
- Parallel execution disabled on CI for stability

## Troubleshooting

### Common Issues

1. **Timeout errors**: Increase timeouts for slow operations (Pyodide loading)
2. **Flaky tests**: Add proper waiting for dynamic content
3. **Mobile layout issues**: Ensure viewport is set correctly
4. **Theme switching**: Wait for DOM updates after theme changes
5. **Editor content**: CodeMirror may need specific selectors and timing

### Environment Setup

Make sure you have:

```bash
# Install Playwright browsers
npm run test:e2e:install

# Build the application
npm run build

# Verify preview server works
npm run preview
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use the test utilities where possible
3. Add appropriate error handling
4. Test both desktop and mobile layouts
5. Consider accessibility implications
6. Update this README if adding new test categories
