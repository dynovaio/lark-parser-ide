import { toPythonCompatibleParserOptions, type ParserOptions } from '$lib/utils/Parser';
import { type PyodideModule } from '$lib/utils/Pyodide';
import { type Grammar } from '$lib/utils/Grammar';

export enum TestStatus {
  UNKNOWN = 'Unknown',
  SUCCESS = 'Success',
  FAILURE = 'Failure',
  PARSING = 'Parsing'
}

export type TestResult = {
  status: TestStatus;
  message?: string;
  traceback?: string;
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
  traceback: '',
  content: ''
};

export const TEST_CASE_TEMPLATE: TestCase = {
  id: 0,
  description: 'New Test Case',
  content: '',
  result: { ...TEST_CASE_RESULT_TEMPLATE }
};

const DEFINE_EXECUTE_TEST_CASE_SCRIPT = `
def execute_test_case(grammar, test_string, options):
    result = { "status": "Unknown" }

    try:
        parser = lark.Lark(
          grammar,
          **options,
        )

        result = json.dumps(
          parser.parse(test_string),
          cls=LarkEncoder,
          indent=2,
        )

        result = {
            "status": "Success",
            "content": result
        }
    except Exception as e:
        result = {
            "status": "Failure",
            "message": str(e).strip(),
            "traceback": traceback.format_exc().strip(),
            "content": ""
        }

    return json.dumps(result)
`;

export const executeTestCase = async (
  executor: PyodideModule,
  parserOptions: ParserOptions,
  grammar: Grammar,
  testCase: TestCase
): Promise<TestResult> => {
  const pythonCompatibleParserOptions = toPythonCompatibleParserOptions(parserOptions);

  executor.globals.set('parser_options', pythonCompatibleParserOptions);
  executor.globals.set('grammar', grammar.content || '');
  executor.globals.set('test_string', testCase.content || '');
  await executor.runPythonAsync(DEFINE_EXECUTE_TEST_CASE_SCRIPT);
  const result = await executor.runPythonAsync(
    `execute_test_case(grammar, test_string, parser_options.to_py())`
  );

  return JSON.parse(result) as TestResult;
};
