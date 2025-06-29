import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Theme, isDarkMode, setTheme } from '@/lib/stores/Theme';
import { get } from 'svelte/store';

// Mock document.documentElement
const mockDocumentElement = {
  classList: {
    toggle: vi.fn(),
    add: vi.fn(),
    remove: vi.fn()
  }
};

describe('Theme store', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup spies for localStorage
    vi.spyOn(window.localStorage, 'getItem');
    vi.spyOn(window.localStorage, 'setItem');

    // Setup document.documentElement mock
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Theme enum', () => {
    it('should have correct values', () => {
      expect(Theme.Light).toBe('light');
      expect(Theme.Dark).toBe('dark');
    });
  });

  describe('isDarkMode derived store', () => {
    it('should return true when theme is dark', () => {
      setTheme(Theme.Dark);
      expect(get(isDarkMode)).toBe(true);
    });

    it('should return false when theme is light', () => {
      setTheme(Theme.Light);
      expect(get(isDarkMode)).toBe(false);
    });

    it('should be reactive to theme changes', () => {
      setTheme(Theme.Light);
      expect(get(isDarkMode)).toBe(false);

      setTheme(Theme.Dark);
      expect(get(isDarkMode)).toBe(true);
    });
  });

  describe('setTheme function', () => {
    it('should set dark theme correctly', () => {
      setTheme(Theme.Dark);

      expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(get(isDarkMode)).toBe(true);
    });

    it('should set light theme correctly', () => {
      setTheme(Theme.Light);

      expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(get(isDarkMode)).toBe(false);
    });

    it('should update localStorage with correct theme value', () => {
      setTheme(Theme.Dark);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

      setTheme(Theme.Light);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should toggle dark class on document element', () => {
      setTheme(Theme.Dark);
      expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);

      setTheme(Theme.Light);
      expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    });

    it('should work with both enum values and string values', () => {
      setTheme('dark' as Theme);
      expect(get(isDarkMode)).toBe(true);

      setTheme('light' as Theme);
      expect(get(isDarkMode)).toBe(false);
    });
  });

  describe('Theme store persistence', () => {
    it('should save theme changes to localStorage', () => {
      const themes: Theme[] = [Theme.Dark, Theme.Light, Theme.Dark, Theme.Light];

      themes.forEach((theme) => {
        setTheme(theme);
      });

      expect(window.localStorage.setItem).toHaveBeenCalledTimes(4);

      themes.forEach((theme) => {
        expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', theme);
      });
    });

    it('should maintain theme state consistency', () => {
      setTheme(Theme.Dark);
      expect(get(isDarkMode)).toBe(true);

      setTheme(Theme.Light);
      expect(get(isDarkMode)).toBe(false);

      setTheme(Theme.Dark);
      expect(get(isDarkMode)).toBe(true);
    });
  });

  describe('DOM manipulation', () => {
    it('should correctly toggle dark class on document element', () => {
      setTheme(Theme.Dark);
      expect(mockDocumentElement.classList.toggle).toHaveBeenLastCalledWith('dark', true);

      setTheme(Theme.Light);
      expect(mockDocumentElement.classList.toggle).toHaveBeenLastCalledWith('dark', false);
    });

    it('should handle multiple theme changes correctly', () => {
      const toggleSpy = mockDocumentElement.classList.toggle;

      setTheme(Theme.Dark);
      setTheme(Theme.Light);
      setTheme(Theme.Dark);

      expect(toggleSpy).toHaveBeenCalledTimes(3);
      expect(toggleSpy).toHaveBeenNthCalledWith(1, 'dark', true);
      expect(toggleSpy).toHaveBeenNthCalledWith(2, 'dark', false);
      expect(toggleSpy).toHaveBeenNthCalledWith(3, 'dark', true);
    });
  });
});
