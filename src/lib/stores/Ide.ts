import { writable } from 'svelte/store';

export const useLegacyIde = writable(false);

export type Grammar = {
  uri?: string;
  content?: string;
};

export enum TestStatus {
  UNKNOWN = 'Unknown',
  SUCCESS = 'Success',
  FAILURE = 'Failure',
  PARSING = 'Parsing'
}

export type TestResult = {
  status: TestStatus;
  message?: string;
  stack?: string;
  content?: string;
};

export type TestCase = {
  id: number;
  description?: string;
  content?: string;
  result?: TestResult;
};

export type Project = {
  id: string;
  name: string;
  grammar: Grammar;
  testCases: TestCase[];
};

export type IdeState = {
  project: Project;
  testCase?: TestCase;
  testResult?: TestResult;
};

export const PROJECT_TEMPLATE: Project = {
  id: 'template',
  name: 'Template Project',
  grammar: {
    uri: 'blank.lark',
    content: ''
  },
  testCases: [
    {
      id: 1,
      description: 'Empty Test Case',
      content: ''
    }
  ]
};

export const PROJECT_HELLO_WORLD: Project = {
  id: 'hello-world',
  name: 'Hello World',
  grammar: {
    uri: 'hello-world.lark',
    content: 'Hello, World!'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Hello World Test',
      content: 'Hello, World!'
    }
  ]
};

export const PROJECT_JSON: Project = {
  id: 'json',
  name: 'JSON',
  grammar: {
    uri: 'json.lark',
    content: '{"this": ["is", "JSON"]}'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic JSON Test',
      content: '{"key": "value"}'
    }
  ]
};

export const PROJECT_CALCULATOR: Project = {
  id: 'calculator',
  name: 'Calculator',
  grammar: {
    uri: 'calculator.lark',
    content: '2 + 20 / (13 - 6) + 1.5'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Calculator Test',
      content: '2 + 20 / (13 - 6) + 1.5'
    }
  ]
};

export const PROJECT_FRUIT_FLIES: Project = {
  id: 'fruit-flies',
  name: 'Fruit Flies',
  grammar: {
    uri: 'fruit-flies.lark',
    content: 'fruit flies like bananas'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Fruit Flies Test',
      content: 'fruit flies like bananas'
    }
  ]
};

export const PROJECT_SEMVER: Project = {
  id: 'semver',
  name: 'SemVer',
  grammar: {
    uri: 'semver.lark',
    content: '1.0.0-rc1+build.0001'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic SemVer Test',
      content: '1.0.0-rc1+build.0001'
    }
  ]
};

export const PROJECT_CONFIGURATION: Project = {
  id: 'configuration',
  name: 'Configuration',
  grammar: {
    uri: 'configuration.lark',
    content: 'key=value\nanother_key=another_value'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Configuration Test',
      content: 'key=value\nanother_key=another_value'
    }
  ]
};

export const PROJECT_LARK: Project = {
  id: 'lark',
  name: 'Lark',
  grammar: {
    uri: 'lark.lark',
    content: 'start: "Hello" "World"'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Lark Test',
      content: 'start: "Hello" "World"'
    }
  ]
};

export const SAMPLE_PROJECTS: Project[] = [
  PROJECT_HELLO_WORLD,
  PROJECT_JSON,
  PROJECT_CALCULATOR,
  PROJECT_FRUIT_FLIES,
  PROJECT_SEMVER,
  PROJECT_CONFIGURATION,
  PROJECT_LARK
];

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
    setProject: (project: Project) =>
      set({ project, testCase: project.testCases[0], testResult: project.testCases[0]?.result }),
    setTestCase: (testCase: TestCase) => update((state) => ({ ...state, testCase })),
    setTestResult: (testResult: TestResult) => update((state) => ({ ...state, testResult }))
  };
};
