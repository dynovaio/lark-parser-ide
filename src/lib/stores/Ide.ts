import { writable } from 'svelte/store';

import type { Grammar } from '$lib/utils/Grammar';
import type { TestResult, TestCase } from '$lib/utils/TestCase';
import type { Project } from '$lib/utils/Project';
import { PROJECT_TEMPLATE, SAMPLE_PROJECTS } from '$lib/utils/Project';

export type IdeState = {
  project: Project;
  testCase?: TestCase;
  testResult?: TestResult;
  availableProjects: Project[];
};

export const useLegacyIde = writable(false);

export const createIdeState = (project?: Project) => {
  if (!project) {
    project = PROJECT_TEMPLATE;
  }

  const { subscribe, update } = writable<IdeState>({
    project: project,
    testCase: project.testCases[0],
    testResult: project.testCases[0]?.result,
    availableProjects: [...SAMPLE_PROJECTS]
  });

  return {
    subscribe,
    setProject: (project: Project) => {
      update((state) => {
        return {
          ...state,
          project,
          testCase: project.testCases[0],
          testResult: project.testCases[0]?.result
        };
      });
    },
    setTestCase: (testCase: TestCase) => {
      update((state) => {
        return { ...state, testCase };
      });
    },
    setTestResult: (testResult: TestResult) => {
      update((state) => {
        return {
          ...state,
          testResult
        };
      });
    },
    setGrammar: (grammar: Grammar) => {
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
