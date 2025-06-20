import type { ParserOptions } from '$lib/Parsers';
import { LALR1_PARSER, DEFAULT_PARSER_OPTIONS } from '$lib/Parsers';

export interface Grammar {
  id: string;
  label: string;
  test: string;
  parserOptions: ParserOptions;
  difficulty: string;
}

export const BLANK_GRAMMAR: Grammar = {
  id: 'blank',
  label: 'Blank',
  test: '',
  parserOptions: DEFAULT_PARSER_OPTIONS,
  difficulty: 'easy'
};

export const HELLO_WORLD_GRAMMAR: Grammar = {
  id: 'hello',
  label: 'Hello World',
  test: 'Hello, World!',
  parserOptions: DEFAULT_PARSER_OPTIONS,
  difficulty: 'easy'
};

export const JSON_GRAMMAR: Grammar = {
  id: 'json',
  label: 'JSON',
  test: '{"this": ["is", "JSON"]}',
  parserOptions: { parser: LALR1_PARSER, keepAllTokens: false },
  difficulty: 'easy'
};

export const CALCULATOR_GRAMMAR: Grammar = {
  label: 'Calculator',
  id: 'calc',
  test: '2 + 20 / (13 - 6) + 1.5',
  parserOptions: { parser: LALR1_PARSER, keepAllTokens: false },
  difficulty: 'easy'
};

export const FRUIT_FLIES_GRAMMAR: Grammar = {
  label: 'Fruit flies like bananas',
  id: 'fruitflies',
  test: 'fruit flies like bananas',
  parserOptions: { ...DEFAULT_PARSER_OPTIONS, ambiguity: 'explicit' },
  difficulty: 'easy'
};

export const SEMVER_GRAMMAR: Grammar = {
  label: 'SemVer',
  id: 'semver',
  test: '1.0.0-rc1+build.0001',
  parserOptions: { parser: LALR1_PARSER, keepAllTokens: false },
  difficulty: 'easy'
};

export const CONFIGURATION_GRAMMAR: Grammar = {
  label: 'Configuration',
  id: 'conf',
  test: '[main]\nhello=world\n',
  parserOptions: { parser: LALR1_PARSER, keepAllTokens: false },
  difficulty: 'average'
};

export const LARK_GRAMMAR: Grammar = {
  label: 'Lark',
  id: 'lark',
  test: 'start: "Hello" "World"',
  parserOptions: { parser: LALR1_PARSER, keepAllTokens: false, maybePlaceholders: false },
  difficulty: 'average'
};

export const AVAILABLE_GRAMMARS: Grammar[] = [
  BLANK_GRAMMAR,
  HELLO_WORLD_GRAMMAR,
  JSON_GRAMMAR,
  CALCULATOR_GRAMMAR,
  FRUIT_FLIES_GRAMMAR,
  SEMVER_GRAMMAR,
  CONFIGURATION_GRAMMAR,
  LARK_GRAMMAR
];
