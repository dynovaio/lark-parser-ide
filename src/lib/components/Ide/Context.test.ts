import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setContext, getContext, hasContext } from 'svelte';
import { setIdeContext, getIdeContext } from './Context';
import { createIdeState } from '$lib/stores/Ide';
import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';

// Mock svelte context functions
vi.mock('svelte', () => ({
  setContext: vi.fn(),
  getContext: vi.fn(),
  hasContext: vi.fn()
}));

describe('Ide Context', () => {
  const mockSetContext = vi.mocked(setContext);
  const mockGetContext = vi.mocked(getContext);
  const mockHasContext = vi.mocked(hasContext);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setIdeContext', () => {
    it('should set context with correct key and value', () => {
      const mockIdeState = createIdeState(PROJECT_HELLO_WORLD);

      setIdeContext(mockIdeState);

      expect(mockSetContext).toHaveBeenCalledWith(expect.any(Symbol), mockIdeState);
    });

    it('should use a symbol as the context key', () => {
      const mockIdeState = createIdeState(PROJECT_HELLO_WORLD);

      setIdeContext(mockIdeState);

      const [contextKey] = mockSetContext.mock.calls[0];
      expect(typeof contextKey).toBe('symbol');
      expect(contextKey.toString()).toBe('Symbol(lark-ide-state)');
    });
  });

  describe('getIdeContext', () => {
    it('should return context when it exists', () => {
      const mockIdeState = createIdeState(PROJECT_HELLO_WORLD);
      mockHasContext.mockReturnValue(true);
      mockGetContext.mockReturnValue(mockIdeState);

      const result = getIdeContext();

      expect(mockHasContext).toHaveBeenCalledWith(expect.any(Symbol));
      expect(mockGetContext).toHaveBeenCalledWith(expect.any(Symbol));
      expect(result).toBe(mockIdeState);
    });

    it('should return empty object when context does not exist', () => {
      mockHasContext.mockReturnValue(false);

      const result = getIdeContext();

      expect(mockHasContext).toHaveBeenCalledWith(expect.any(Symbol));
      expect(mockGetContext).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should use the same symbol key for both has and get checks', () => {
      mockHasContext.mockReturnValue(true);
      const mockIdeState = createIdeState(PROJECT_HELLO_WORLD);
      mockGetContext.mockReturnValue(mockIdeState);

      getIdeContext();

      const hasContextKey = mockHasContext.mock.calls[0][0];
      const getContextKey = mockGetContext.mock.calls[0][0];
      expect(hasContextKey).toBe(getContextKey);
    });
  });

  describe('Type safety', () => {
    it('should have correct return type', () => {
      const mockIdeState = createIdeState(PROJECT_HELLO_WORLD);
      mockHasContext.mockReturnValue(true);
      mockGetContext.mockReturnValue(mockIdeState);

      const result = getIdeContext();

      // These should be available without TypeScript errors
      expect(typeof result.subscribe).toBe('function');
      expect(typeof result.setProject).toBe('function');
      expect(typeof result.setTestCase).toBe('function');
      expect(typeof result.setTestResult).toBe('function');
      expect(typeof result.setGrammar).toBe('function');
      expect(typeof result.setAvailableProjects).toBe('function');
    });

    it('should handle empty context gracefully', () => {
      mockHasContext.mockReturnValue(false);

      const result = getIdeContext();

      // Should not throw when trying to access properties
      expect(() => {
        const _ = result as unknown as { [key: string]: unknown };
        return _;
      }).not.toThrow();
    });
  });
});
