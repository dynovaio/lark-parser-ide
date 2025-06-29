import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  TestStatus,
  TEST_CASE_RESULT_TEMPLATE,
  TEST_CASE_TEMPLATE,
  executeTestCase
} from '../../src/lib/utils/TestCase';
import type { TestCase } from '../../src/lib/utils/TestCase';
import type { ParserOptions } from '../../src/lib/utils/Parser';
import type { Grammar } from '../../src/lib/utils/Grammar';
import { EARLEY_PARSER, ParserAmbiguity } from '../../src/lib/utils/Parser';

// Mock PyodideModule
const mockPyodideModule = {
  globals: {
    set: vi.fn()
  },
  runPythonAsync: vi.fn()
};

describe('TestCase utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('TestStatus enum', () => {
    it('should have correct values', () => {
      expect(TestStatus.UNKNOWN).toBe('Unknown');
      expect(TestStatus.SUCCESS).toBe('Success');
      expect(TestStatus.FAILURE).toBe('Failure');
      expect(TestStatus.PARSING).toBe('Parsing');
    });
  });

  describe('TEST_CASE_RESULT_TEMPLATE', () => {
    it('should have correct default values', () => {
      expect(TEST_CASE_RESULT_TEMPLATE).toEqual({
        status: TestStatus.UNKNOWN,
        message: '',
        traceback: '',
        content: ''
      });
    });
  });

  describe('TEST_CASE_TEMPLATE', () => {
    it('should have correct default values', () => {
      expect(TEST_CASE_TEMPLATE).toEqual({
        id: 0,
        description: 'New Test Case',
        content: '',
        result: { ...TEST_CASE_RESULT_TEMPLATE }
      });
    });

    it('should be immutable from result template', () => {
      const modifiedTemplate = { ...TEST_CASE_TEMPLATE };
      modifiedTemplate.result!.status = TestStatus.SUCCESS;

      expect(TEST_CASE_RESULT_TEMPLATE.status).toBe(TestStatus.UNKNOWN);
    });
  });

  describe('executeTestCase', () => {
    const mockParserOptions: ParserOptions = {
      algorithm: EARLEY_PARSER,
      keepAllTokens: false
    };

    const mockGrammar: Grammar = {
      uri: 'test.lark',
      content: 'start: "hello" "world"'
    };

    const mockTestCase: TestCase = {
      id: 1,
      description: 'Test case',
      content: 'hello world'
    };

    it('should execute test case successfully', async () => {
      const successResult = {
        status: 'Success',
        content: '{"type": "Tree", "data": "start", "children": []}'
      };

      mockPyodideModule.runPythonAsync
        .mockResolvedValueOnce(undefined) // DEFINE_EXECUTE_TEST_CASE_SCRIPT
        .mockResolvedValueOnce(JSON.stringify(successResult)); // execute_test_case call

      const result = await executeTestCase(
        mockPyodideModule as unknown as Parameters<typeof executeTestCase>[0],
        mockParserOptions,
        mockGrammar,
        mockTestCase
      );

      expect(result).toEqual(successResult);
      expect(mockPyodideModule.globals.set).toHaveBeenCalledWith('parser_options', {
        parser: 'earley',
        keep_all_tokens: false
      });
      expect(mockPyodideModule.globals.set).toHaveBeenCalledWith('grammar', mockGrammar.content);
      expect(mockPyodideModule.globals.set).toHaveBeenCalledWith(
        'test_string',
        mockTestCase.content
      );
      expect(mockPyodideModule.runPythonAsync).toHaveBeenCalledTimes(2);
    });

    it('should handle parsing failure', async () => {
      const failureResult = {
        status: 'Failure',
        message: 'Unexpected token',
        traceback: 'Traceback (most recent call last):\n  File ...',
        content: ''
      };

      mockPyodideModule.runPythonAsync
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(JSON.stringify(failureResult));

      const result = await executeTestCase(
        mockPyodideModule as unknown as Parameters<typeof executeTestCase>[0],
        mockParserOptions,
        mockGrammar,
        mockTestCase
      );

      expect(result).toEqual(failureResult);
    });

    it('should handle empty grammar content', async () => {
      const emptyGrammar: Grammar = { content: '' };

      mockPyodideModule.runPythonAsync
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(JSON.stringify({ status: 'Unknown' }));

      await executeTestCase(
        mockPyodideModule as unknown as Parameters<typeof executeTestCase>[0],
        mockParserOptions,
        emptyGrammar,
        mockTestCase
      );

      expect(mockPyodideModule.globals.set).toHaveBeenCalledWith('grammar', '');
    });

    it('should handle empty test case content', async () => {
      const emptyTestCase: TestCase = { id: 1, content: '' };

      mockPyodideModule.runPythonAsync
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(JSON.stringify({ status: 'Unknown' }));

      await executeTestCase(
        mockPyodideModule as unknown as Parameters<typeof executeTestCase>[0],
        mockParserOptions,
        mockGrammar,
        emptyTestCase
      );

      expect(mockPyodideModule.globals.set).toHaveBeenCalledWith('test_string', '');
    });

    it('should handle parser options with all features', async () => {
      const complexParserOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        keepAllTokens: true,
        ambiguity: ParserAmbiguity.EXPLICIT,
        maybePlaceholders: true
      };

      mockPyodideModule.runPythonAsync
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(JSON.stringify({ status: 'Success', content: '{}' }));

      await executeTestCase(
        mockPyodideModule as unknown as Parameters<typeof executeTestCase>[0],
        complexParserOptions,
        mockGrammar,
        mockTestCase
      );

      expect(mockPyodideModule.globals.set).toHaveBeenCalledWith('parser_options', {
        parser: 'earley',
        keep_all_tokens: true,
        ambiguity: 'explicit',
        maybe_placeholders: true
      });
    });

    it('should handle JSON parsing errors in result', async () => {
      // This would happen if the Python execution returns invalid JSON
      mockPyodideModule.runPythonAsync
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('invalid json');

      await expect(
        executeTestCase(
          mockPyodideModule as unknown as Parameters<typeof executeTestCase>[0],
          mockParserOptions,
          mockGrammar,
          mockTestCase
        )
      ).rejects.toThrow();
    });

    it('should handle Python execution errors', async () => {
      mockPyodideModule.runPythonAsync
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Python execution failed'));

      await expect(
        executeTestCase(
          mockPyodideModule as unknown as Parameters<typeof executeTestCase>[0],
          mockParserOptions,
          mockGrammar,
          mockTestCase
        )
      ).rejects.toThrow('Python execution failed');
    });
  });
});
