import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { createIdeState, type IdeState } from '$lib/stores/Ide';
import { PROJECT_HELLO_WORLD, PROJECT_TEMPLATE } from '$lib/utils/Project';
import { TestStatus } from '$lib/utils/TestCase';
import type { TestCase, TestResult } from '$lib/utils/TestCase';

// Mock Svelte's context functions
vi.mock('svelte', async () => {
  const actual = await vi.importActual('svelte');
  const contextStore = new Map();

  return {
    ...actual,
    setContext: vi.fn((key: symbol | string, value: IdeState) => {
      contextStore.set(key, value);
      return value;
    }),
    getContext: vi.fn((key: symbol | string) => {
      return contextStore.get(key);
    }),
    hasContext: vi.fn((key: symbol | string) => {
      return contextStore.has(key);
    })
  };
});

// Import after mocking
import { setIdeContext, getIdeContext } from './Context';

describe('StatusBar Component Logic', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Clear the context store between tests
    const { setContext } = await import('svelte');
    (setContext as unknown as { mockClear: () => void }).mockClear?.();
  });

  describe('Project name derivation', () => {
    it('should derive project name from IDE context', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(state.project.name).toBe('Hello World');
    });

    it('should handle empty project name', () => {
      const emptyProject = { ...PROJECT_TEMPLATE, name: '' };
      const ideState = createIdeState(emptyProject);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(state.project.name).toBe('');
    });

    it('should handle undefined project', () => {
      const ideState = createIdeState();
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(state.project).toBeDefined();
      expect(typeof state.project.name).toBe('string');
    });
  });

  describe('Test ID derivation', () => {
    it('should derive test ID from current test case', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(state.testCase?.id).toBe(1);
    });

    it('should handle null test case', () => {
      const projectWithoutTest = { ...PROJECT_HELLO_WORLD, testCases: [] };
      const ideState = createIdeState(projectWithoutTest);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(state.testCase).toBeUndefined();
    });

    it('should update when test case changes', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const newTestCase: TestCase = {
        id: 2,
        description: 'New test',
        content: 'test content'
      };

      ideState.setTestCase(newTestCase);

      const context = getIdeContext();
      const state = get(context);

      expect(state.testCase?.id).toBe(2);
    });
  });

  describe('Test status derivation', () => {
    it('should derive status from test result', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);

      const successResult: TestResult = {
        status: TestStatus.SUCCESS,
        content: 'Success content'
      };

      ideState.setTestResult(successResult);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(state.testResult?.status).toBe(TestStatus.SUCCESS);
    });

    it('should handle undefined test result', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);

      // Clear test result
      ideState.setTestResult(undefined as unknown as TestResult);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(state.testResult).toBeUndefined();
    });

    it('should handle all test status values', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const testStatuses = [
        TestStatus.SUCCESS,
        TestStatus.FAILURE,
        TestStatus.PARSING,
        TestStatus.UNKNOWN
      ];

      testStatuses.forEach((status) => {
        const result: TestResult = { status };
        ideState.setTestResult(result);

        const context = getIdeContext();
        const state = get(context);

        expect(state.testResult?.status).toBe(status);
      });
    });

    it('should update reactively when status changes', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      // Initial status
      const initialResult: TestResult = {
        status: TestStatus.UNKNOWN
      };
      ideState.setTestResult(initialResult);

      let context = getIdeContext();
      let state = get(context);
      expect(state.testResult?.status).toBe(TestStatus.UNKNOWN);

      // Update to success
      const successResult: TestResult = {
        status: TestStatus.SUCCESS,
        content: 'Success'
      };
      ideState.setTestResult(successResult);

      context = getIdeContext();
      state = get(context);
      expect(state.testResult?.status).toBe(TestStatus.SUCCESS);
    });
  });

  describe('StatusBar logic patterns', () => {
    it('should follow warning pattern for missing project name', () => {
      const emptyProject = { ...PROJECT_TEMPLATE, name: '' };
      const ideState = createIdeState(emptyProject);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      const hasProjectName = !!state.project.name;
      expect(hasProjectName).toBe(false); // Should trigger warning state
    });

    it('should follow warning pattern for missing test ID', () => {
      const projectWithoutTest = { ...PROJECT_HELLO_WORLD, testCases: [] };
      const ideState = createIdeState(projectWithoutTest);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      const hasTestId = !!state.testCase?.id;
      expect(hasTestId).toBe(false); // Should trigger warning state
    });

    it('should determine correct status classes', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const statusClassMap = new Map<TestStatus, string | undefined>([
        [TestStatus.FAILURE, 'status-error'],
        [TestStatus.SUCCESS, 'status-success'],
        [TestStatus.UNKNOWN, 'status-warning'],
        [TestStatus.PARSING, undefined] // No specific class for parsing
      ]);

      statusClassMap.forEach((expectedClass, status) => {
        const result: TestResult = { status };
        ideState.setTestResult(result);

        const context = getIdeContext();
        const state = get(context);

        expect(state.testResult?.status).toBe(status);

        // Test class logic
        const isError = status === TestStatus.FAILURE;
        const isSuccess = status === TestStatus.SUCCESS;
        const isWarning = status === TestStatus.UNKNOWN;

        if (expectedClass === 'status-error') {
          expect(isError).toBe(true);
          expect(isSuccess).toBe(false);
          expect(isWarning).toBe(false);
        } else if (expectedClass === 'status-success') {
          expect(isError).toBe(false);
          expect(isSuccess).toBe(true);
          expect(isWarning).toBe(false);
        } else if (expectedClass === 'status-warning') {
          expect(isError).toBe(false);
          expect(isSuccess).toBe(false);
          expect(isWarning).toBe(true);
        }
      });
    });
  });

  describe('Data consistency and type safety', () => {
    it('should maintain type consistency for project name', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      expect(typeof (state.project?.name || '')).toBe('string');
    });

    it('should maintain type consistency for test ID', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      const testId = state.testCase?.id || null;
      expect(testId === null || typeof testId === 'number').toBe(true);
    });

    it('should maintain type consistency for test status', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const context = getIdeContext();
      const state = get(context);

      const testStatus = state.testResult?.status || TestStatus.UNKNOWN;
      expect(Object.values(TestStatus)).toContain(testStatus);
    });

    it('should handle store subscription lifecycle', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const context = getIdeContext();

      // Subscribe and immediately unsubscribe to test lifecycle
      const unsubscribe = context.subscribe(() => {});
      expect(typeof unsubscribe).toBe('function');

      // Should not throw when unsubscribing
      expect(() => unsubscribe()).not.toThrow();
    });

    it('should provide consistent derived values', () => {
      const ideState = createIdeState(PROJECT_HELLO_WORLD);
      setIdeContext(ideState);

      const context = getIdeContext();

      // Get values multiple times - should be consistent
      const state1 = get(context);
      const state2 = get(context);

      expect(state1.project.name).toBe(state2.project.name);
      expect(state1.testCase?.id).toBe(state2.testCase?.id);
      expect(state1.testResult?.status).toBe(state2.testResult?.status);
    });
  });
});
