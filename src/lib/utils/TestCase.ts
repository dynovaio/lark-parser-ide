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

export const TEST_CASE_RESULT_TEMPLATE: TestResult = {
  status: TestStatus.UNKNOWN,
  message: '',
  stack: '',
  content: ''
};

export const TEST_CASE_TEMPLATE: TestCase = {
  id: 0,
  description: 'New Test Case',
  content: '',
  result: { ...TEST_CASE_RESULT_TEMPLATE }
};
