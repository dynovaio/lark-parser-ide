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
        const availableProjects = state.availableProjects;
        const projectIndex = availableProjects.findIndex((p) => p.id === project.id);
        if (projectIndex !== -1) {
          availableProjects[projectIndex] = project;
        } else {
          availableProjects.push(project);
        }

        return {
          project,
          testCase: project.testCases[0],
          testResult: project.testCases[0]?.result,
          availableProjects
        };
      });
    },
    setTestCase: (testCase: TestCase) => {
      update((state) => {
        const testCases = state.project.testCases;
        const testCaseIndex = testCases.findIndex((tc) => tc.id === testCase.id);
        if (testCaseIndex !== -1) {
          testCases[testCaseIndex] = testCase;
        } else {
          testCases.push(testCase);
        }

        let project = state.project;
        project = {
          ...project,
          testCases: [...project.testCases]
        };

        const availableProjects = state.availableProjects;
        const projectIndex = availableProjects.findIndex((p) => p.id === project.id);
        if (projectIndex !== -1) {
          availableProjects[projectIndex] = project;
        }

        return { ...state, project, testCase, testResult: testCase.result, availableProjects };
      });
    },
    setTestResult: (testResult: TestResult) => {
      update((state) => {
        let testCase = state.testCase;
        testCase = {
          ...testCase,
          result: testResult
        } as TestCase;

        const testCases = state.project.testCases;
        const testCaseIndex = testCases.findIndex((tc) => tc.id === testCase.id);
        if (testCaseIndex !== -1) {
          testCases[testCaseIndex] = testCase;
        } else {
          testCases.push(testCase);
        }

        let project = state.project;
        project = {
          ...project,
          testCases: [...testCases]
        };

        const availableProjects = state.availableProjects;
        const projectIndex = availableProjects.findIndex((p) => p.id === project.id);
        if (projectIndex !== -1) {
          availableProjects[projectIndex] = project;
        }

        return {
          ...state,
          project,
          testCase,
          testResult,
          availableProjects
        };
      });
    },
    setGrammar: (grammar: Grammar) => {
      update((state) => {
        let project = state.project;
        project = {
          ...project,
          grammar: {
            ...project.grammar,
            ...grammar
          }
        };

        const availableProjects = state.availableProjects;
        const projectIndex = availableProjects.findIndex((p) => p.id === project.id);
        if (projectIndex !== -1) {
          availableProjects[projectIndex] = project;
        }

        return {
          ...state,
          project,
          availableProjects
        };
      });
    },
    setAvailableProjects: (projects: Project[]) => {
      update((state) => {
        if (!projects || projects.length === 0) {
          projects = [...SAMPLE_PROJECTS];
        }

        const project = projects[0];

        return {
          ...state,
          project,
          testCase: project.testCases[0],
          testResult: project.testCases[0]?.result,
          availableProjects: projects
        };
      });
    }
  };
};
