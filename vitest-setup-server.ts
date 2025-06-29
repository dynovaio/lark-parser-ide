import { vi } from 'vitest';

// Setup jsdom globals
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Mock console methods to reduce noise in tests
  global.console.warn = vi.fn();
  global.console.error = vi.fn();

  // Mock URL.createObjectURL and URL.revokeObjectURL for file downloads
  global.URL.createObjectURL = vi.fn(() => 'mocked-object-url');
  global.URL.revokeObjectURL = vi.fn();

  // Mock window.matchMedia for breakpoint tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });

  // Mock localStorage for theme tests
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
});
