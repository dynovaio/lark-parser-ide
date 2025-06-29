import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Grammar } from './Grammar';
import { GRAMMAR_TEMPLATE, loadGrammarFromUri, loadGrammar, downloadGrammar } from './Grammar';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;
Object.defineProperty(document.body, 'removeChild', {
  value: vi.fn(),
  writable: true
});

Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'blob:mock-url'),
  writable: true
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn(),
  writable: true
});

describe('Grammar utils', () => {
  const mockElement = {
    href: '',
    download: '',
    style: { display: '' },
    click: vi.fn(),
    setAttribute: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    console.warn = vi.fn();

    // Mock DOM methods for download functionality
    vi.spyOn(document, 'createElement').mockReturnValue(
      mockElement as unknown as HTMLAnchorElement
    );
    vi.spyOn(document.body, 'appendChild').mockImplementation(
      () => mockElement as unknown as HTMLAnchorElement
    );
    vi.spyOn(document.body, 'removeChild').mockImplementation(
      () => mockElement as unknown as HTMLAnchorElement
    );

    // Setup default successful fetch response
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('start: "hello" "world"')
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GRAMMAR_TEMPLATE', () => {
    it('should have correct default values', () => {
      expect(GRAMMAR_TEMPLATE).toEqual({
        content: '',
        error: ''
      });
    });
  });

  describe('loadGrammarFromUri', () => {
    it('should load grammar successfully', async () => {
      const mockContent = 'start: "hello" "world"';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      });

      const result = await loadGrammarFromUri('test.lark');

      expect(result).toEqual({
        uri: 'test.lark',
        content: mockContent
      });
      expect(mockFetch).toHaveBeenCalledWith('test.lark');
    });

    it('should handle fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      });

      const result = await loadGrammarFromUri('test.lark');

      expect(result).toEqual({
        uri: 'test.lark',
        content: '',
        error: 'Failed to load grammar: Not Found'
      });
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle empty content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('')
      });

      const result = await loadGrammarFromUri('test.lark');

      expect(result).toEqual({
        uri: 'test.lark',
        content: '',
        error: 'Grammar content is empty'
      });
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await loadGrammarFromUri('test.lark');

      expect(result).toEqual({
        uri: 'test.lark',
        content: '',
        error: 'Network error'
      });
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle unknown error', async () => {
      mockFetch.mockRejectedValueOnce('unknown error');

      const result = await loadGrammarFromUri('test.lark');

      expect(result).toEqual({
        uri: 'test.lark',
        content: '',
        error: 'Unknown error'
      });
    });
  });

  describe('loadGrammar', () => {
    it('should load grammar when URI is provided and not already loaded', async () => {
      const mockContent = 'start: "hello"';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      });

      const grammar: Grammar = { uri: 'test.lark' };
      const result = await loadGrammar(grammar);

      expect(result).toEqual({
        uri: 'test.lark',
        content: mockContent
      });
    });

    it('should return existing grammar if already loaded and force is false', async () => {
      const grammar: Grammar = {
        uri: 'test.lark',
        content: 'existing content'
      };

      const result = await loadGrammar(grammar, false);

      expect(result).toEqual(grammar);
      expect(mockFetch).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith('Grammar already loaded from test.lark');
    });

    it('should reload grammar if force is true', async () => {
      const mockContent = 'new content';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      });

      const grammar: Grammar = {
        uri: 'test.lark',
        content: 'old content'
      };

      const result = await loadGrammar(grammar, true);

      expect(result).toEqual({
        uri: 'test.lark',
        content: mockContent
      });
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should return grammar unchanged when no URI is provided', async () => {
      const grammar: Grammar = { content: 'some content' };
      const result = await loadGrammar(grammar);

      expect(result).toEqual(grammar);
      expect(console.warn).toHaveBeenCalledWith('No grammar URI provided.');
    });

    it('should not reload if grammar has error and force is false', async () => {
      const grammar: Grammar = {
        uri: 'test.lark',
        error: 'previous error'
      };

      const result = await loadGrammar(grammar, false);

      expect(result).toEqual(grammar);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('downloadGrammar', () => {
    it('should download grammar with content', async () => {
      const grammar: Grammar = {
        content: 'start: "hello" "world"'
      };

      const result = await downloadGrammar('test', grammar);

      expect(result).toEqual(grammar);
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should not download if grammar has no content', async () => {
      const grammar: Grammar = { content: '' };

      const result = await downloadGrammar('test', grammar);

      expect(result).toEqual(grammar);
      expect(console.warn).toHaveBeenCalledWith('No content to download for the grammar.');
      expect(document.createElement).not.toHaveBeenCalled();
    });

    it('should handle undefined content', async () => {
      const grammar: Grammar = {};

      const result = await downloadGrammar('test', grammar);

      expect(result).toEqual(grammar);
      expect(console.warn).toHaveBeenCalledWith('No content to download for the grammar.');
    });
  });

  describe('Type safety and edge cases', () => {
    it('should handle undefined grammar object', async () => {
      const emptyGrammar: Grammar = {};
      const result = await loadGrammar(emptyGrammar);
      expect(result).toEqual(emptyGrammar);
    });

    it('should handle null/undefined fields gracefully', async () => {
      const grammarWithNulls: Grammar = {
        uri: undefined,
        content: undefined,
        error: undefined
      };

      const result = await loadGrammar(grammarWithNulls);
      expect(result).toEqual(grammarWithNulls);
    });

    it('should maintain type safety for Grammar object', () => {
      const grammar: Grammar = {
        uri: 'test.lark',
        content: 'start: "hello"',
        error: ''
      };

      // Should not cause TypeScript errors
      expect(typeof grammar.uri).toBe('string');
      expect(typeof grammar.content).toBe('string');
      expect(typeof grammar.error).toBe('string');
    });

    it('should support partial Grammar objects', () => {
      const partialGrammar: Grammar = { uri: 'test.lark' };
      expect(partialGrammar.uri).toBe('test.lark');
      expect(partialGrammar.content).toBeUndefined();
      expect(partialGrammar.error).toBeUndefined();
    });
  });

  describe('loadGrammarFromUri edge cases', () => {
    it('should handle network timeout gracefully', async () => {
      const timeoutError = new Error('Network timeout');
      mockFetch.mockRejectedValueOnce(timeoutError);

      const result = await loadGrammarFromUri('test://timeout.lark');

      expect(result).toEqual({
        uri: 'test://timeout.lark',
        content: '',
        error: 'Network timeout'
      });
    });

    it('should handle malformed URLs', async () => {
      const malformedUrl = 'not-a-valid-url';

      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await loadGrammarFromUri(malformedUrl);

      expect(result).toEqual({
        uri: malformedUrl,
        content: '',
        error: 'Failed to fetch'
      });
    });

    it('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('')
      });

      const result = await loadGrammarFromUri('test://empty.lark');

      expect(result).toEqual({
        uri: 'test://empty.lark',
        content: '',
        error: 'Grammar content is empty'
      });
    });

    it('should handle whitespace-only content', async () => {
      const whitespaceContent = '   \n\t  \r\n  ';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(whitespaceContent)
      });

      const result = await loadGrammarFromUri('test://whitespace.lark');

      expect(result).toEqual({
        uri: 'test://whitespace.lark',
        content: whitespaceContent
      });
    });

    it('should handle very large grammar files', async () => {
      const largeContent = 'start: "a"\n'.repeat(10000);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(largeContent)
      });

      const result = await loadGrammarFromUri('test://large.lark');

      expect(result.uri).toBe('test://large.lark');
      expect(result.content).toHaveLength(largeContent.length);
      expect(result.error).toBeUndefined();
    });
  });

  describe('loadGrammar caching behavior', () => {
    it('should respect force parameter when content exists', async () => {
      const grammarWithContent: Grammar = {
        uri: 'test://cache.lark',
        content: 'existing content'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('new content')
      });

      const result = await loadGrammar(grammarWithContent, true);

      expect(mockFetch).toHaveBeenCalledWith('test://cache.lark');
      expect(result.content).toBe('new content');
    });

    it('should respect force parameter when error exists', async () => {
      const grammarWithError: Grammar = {
        uri: 'test://error.lark',
        content: '',
        error: 'Previous error'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('recovered content')
      });

      const result = await loadGrammar(grammarWithError, true);

      expect(mockFetch).toHaveBeenCalledWith('test://error.lark');
      expect(result.content).toBe('recovered content');
      expect(result.error).toBeUndefined();
    });

    it('should not fetch when content exists and force is false', async () => {
      const grammarWithContent: Grammar = {
        uri: 'test://cached.lark',
        content: 'cached content'
      };

      const result = await loadGrammar(grammarWithContent, false);

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toBe(grammarWithContent);
    });
  });

  describe('downloadGrammar edge cases', () => {
    it('should handle empty content gracefully', async () => {
      const emptyGrammar: Grammar = { content: '' };

      const result = await downloadGrammar('test', emptyGrammar);

      expect(result).toBe(emptyGrammar);
      expect(document.createElement).not.toHaveBeenCalled();
    });

    it('should handle undefined content', async () => {
      const undefinedGrammar: Grammar = { content: undefined };

      const result = await downloadGrammar('test', undefinedGrammar);

      expect(result).toBe(undefinedGrammar);
      expect(document.createElement).not.toHaveBeenCalled();
    });

    it('should sanitize filename for download', async () => {
      const grammar: Grammar = { content: 'test content' };
      const dangerousFilename = '../../../malicious';

      await downloadGrammar(dangerousFilename, grammar);

      expect(mockElement.download).toBe('../../../malicious.lark');
    });

    it('should handle special characters in filename', async () => {
      const grammar: Grammar = { content: 'test content' };
      const specialFilename = 'test file (v1.2) [final]';

      await downloadGrammar(specialFilename, grammar);

      expect(mockElement.download).toBe('test file (v1.2) [final].lark');
    });

    it('should handle very long content for download', async () => {
      const longContent = 'a'.repeat(1000000); // 1MB content
      const grammar: Grammar = { content: longContent };

      await downloadGrammar('large-grammar', grammar);

      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'text/plain',
          size: longContent.length
        })
      );
    });

    it('should cleanup resources even if click fails', async () => {
      const grammar: Grammar = { content: 'test content' };
      mockElement.click.mockImplementation(() => {
        throw new Error('Click failed');
      });

      // Should not throw - resources cleaned up in finally block
      await expect(downloadGrammar('test', grammar)).resolves.toEqual(grammar);

      // Resources should be cleaned up even when click fails
      expect(document.body.removeChild).toHaveBeenCalledWith(mockElement);
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('GRAMMAR_TEMPLATE constants', () => {
    it('should have correct default values', () => {
      // Test that the template has the expected default values
      const template = GRAMMAR_TEMPLATE;
      expect(template.content).toBe('');
      expect(template.error).toBe('');
      expect(template.uri).toBeUndefined();

      // Test that the template is typed correctly
      const typedTemplate: Grammar = template;
      expect(typedTemplate).toBeDefined();
    });

    it('should be usable as default values', () => {
      // Create a fresh template to avoid mutation from previous tests
      const freshTemplate: Grammar = { content: '', error: '' };
      const newGrammar: Grammar = { ...freshTemplate, uri: 'new.lark' };
      expect(newGrammar.uri).toBe('new.lark');
      expect(newGrammar.content).toBe('');
      expect(newGrammar.error).toBe('');
    });
  });
});
