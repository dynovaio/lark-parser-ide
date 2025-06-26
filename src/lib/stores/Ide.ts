import { writable } from 'svelte/store';

import type { Grammar } from '$lib/utils/Grammar';
import type { TestResult, TestCase } from '$lib/utils/TestCase';
import type { Project } from '$lib/utils/Project';
import { PROJECT_TEMPLATE } from '$lib/utils/Project';

export type IdeState = {
  project: Project;
  testCase?: TestCase;
  testResult?: TestResult;
};

export const useLegacyIde = writable(false);

export const createIdeState = (project?: Project) => {
  if (!project) {
    project = PROJECT_TEMPLATE;
  }

  const { subscribe, set, update } = writable<IdeState>({
    project: project,
    testCase: project.testCases[0],
    testResult: project.testCases[0]?.result
  });

  return {
    subscribe,
    setProject: (project: Project) => {
      set({
        project,
        testCase: project.testCases[0],
        testResult: project.testCases[0]?.result
      });
    },
    updateTestCase: (testCase: TestCase) => {
      update((state) => {
        return { ...state, testCase };
      });
    },
    updateTestResult: (testResult: TestResult) => {
      update((state) => {
        return {
          ...state,
          testResult
        };
      });
    },
    updateGrammar: (grammar: Grammar) => {
      update((state) => {
        return {
          ...state,
          project: {
            ...state.project,
            grammar: {
              ...state.project.grammar,
              ...grammar
            }
          }
        };
      });
    }
  };
};

/*
72 + 32
*/
