import type { Grammar } from '$lib/utils/Grammar';
import { GRAMMAR_TEMPLATE } from '$lib/utils/Grammar';

import type { TestCase } from '$lib/utils/TestCase';
import { TEST_CASE_TEMPLATE } from '$lib/utils/TestCase';

import type { ParserOptions } from '$lib/utils/Parser';
import {
  DEFAULT_PARSER_OPTIONS,
  LALR1_PARSER,
  EARLEY_PARSER,
  ParserAmbiguity
} from '$lib/utils/Parser';

export type Project = {
  id: string;
  name: string;
  grammar: Grammar;
  testCases: TestCase[];
  parserOptions: ParserOptions;
};

export const PROJECT_TEMPLATE: Project = {
  id: 'template',
  name: 'Template Project',
  grammar: { ...GRAMMAR_TEMPLATE },
  testCases: [{ ...TEST_CASE_TEMPLATE }],
  parserOptions: { ...DEFAULT_PARSER_OPTIONS }
};

export const PROJECT_HELLO_WORLD: Project = {
  id: 'hello-world',
  name: 'Hello World',
  grammar: {
    uri: 'grammars/hello.lark'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Hello World Test',
      content: 'Hello, World!'
    }
  ],
  parserOptions: {
    algorithm: LALR1_PARSER,
    keepAllTokens: false
  }
};

export const PROJECT_JSON: Project = {
  id: 'json',
  name: 'JSON',
  grammar: {
    uri: 'grammars/json.lark'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic JSON Test',
      content: '{"key": "value"}'
    }
  ],
  parserOptions: {
    algorithm: LALR1_PARSER,
    keepAllTokens: false
  }
};

export const PROJECT_CALCULATOR: Project = {
  id: 'calculator',
  name: 'Calculator',
  grammar: {
    uri: 'grammars/calc.lark'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Calculator Test',
      content: '2 + 20 / (13 - 6) + 1.5'
    }
  ],
  parserOptions: {
    algorithm: LALR1_PARSER,
    keepAllTokens: false
  }
};

export const PROJECT_FRUIT_FLIES: Project = {
  id: 'fruit-flies',
  name: 'Fruit Flies',
  grammar: {
    uri: 'grammars/fruitflies.lark'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Fruit Flies Test',
      content: 'fruit flies like bananas'
    }
  ],
  parserOptions: {
    algorithm: EARLEY_PARSER,
    keepAllTokens: false,
    ambiguity: ParserAmbiguity.EXPLICIT
  }
};

export const PROJECT_SEMVER: Project = {
  id: 'semver',
  name: 'SemVer',
  grammar: {
    uri: 'grammars/semver.lark'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic SemVer Test',
      content: '1.0.0-rc1+build.0001'
    }
  ],
  parserOptions: {
    algorithm: LALR1_PARSER,
    keepAllTokens: false
  }
};

export const PROJECT_CONFIGURATION: Project = {
  id: 'configuration',
  name: 'Configuration',
  grammar: {
    uri: 'grammars/conf.lark'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Configuration Test',
      content: '[main]\nhello=world\n'
    }
  ],
  parserOptions: {
    algorithm: LALR1_PARSER,
    keepAllTokens: false
  }
};

export const PROJECT_LARK: Project = {
  id: 'lark',
  name: 'Lark',
  grammar: {
    uri: 'grammars/lark.lark'
  },
  testCases: [
    {
      id: 1,
      description: 'Basic Lark Test',
      content: 'start: "Hello" "World"'
    }
  ],
  parserOptions: {
    algorithm: EARLEY_PARSER,
    keepAllTokens: false,
    maybePlaceholders: false
  }
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
