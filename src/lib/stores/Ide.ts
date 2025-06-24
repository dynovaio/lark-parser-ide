import { writable } from 'svelte/store';

export const useLegacyIde = writable(false);

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
};
