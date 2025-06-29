import { describe, it, expect } from 'vitest';
import {
  PROJECT_TEMPLATE,
  PROJECT_HELLO_WORLD,
  PROJECT_JSON,
  PROJECT_CALCULATOR,
  PROJECT_FRUIT_FLIES,
  PROJECT_SEMVER,
  PROJECT_CONFIGURATION,
  PROJECT_LARK,
  SAMPLE_PROJECTS
} from '@/lib/utils/Project';
import { GRAMMAR_TEMPLATE } from '@/lib/utils/Grammar';
import { TEST_CASE_TEMPLATE } from '@/lib/utils/TestCase';
import {
  DEFAULT_PARSER_OPTIONS,
  LALR1_PARSER,
  EARLEY_PARSER,
  ParserAmbiguity
} from '@/lib/utils/Parser';

describe('Project utils', () => {
  describe('PROJECT_TEMPLATE', () => {
    it('should have correct template structure', () => {
      expect(PROJECT_TEMPLATE).toEqual({
        id: 'template',
        name: 'Template Project',
        grammar: { ...GRAMMAR_TEMPLATE },
        testCases: [{ ...TEST_CASE_TEMPLATE }],
        parserOptions: { ...DEFAULT_PARSER_OPTIONS }
      });
    });

    it('should be immutable from original templates', () => {
      const modifiedTemplate = { ...PROJECT_TEMPLATE };
      modifiedTemplate.name = 'Modified';

      expect(PROJECT_TEMPLATE.name).toBe('Template Project');
    });
  });

  describe('Sample Projects', () => {
    describe('PROJECT_HELLO_WORLD', () => {
      it('should have correct configuration', () => {
        expect(PROJECT_HELLO_WORLD.id).toBe('hello-world');
        expect(PROJECT_HELLO_WORLD.name).toBe('Hello World');
        expect(PROJECT_HELLO_WORLD.grammar.uri).toBe('grammars/hello.lark');
        expect(PROJECT_HELLO_WORLD.testCases).toHaveLength(1);
        expect(PROJECT_HELLO_WORLD.testCases[0].content).toBe('Hello, World!');
        expect(PROJECT_HELLO_WORLD.parserOptions.algorithm).toEqual(LALR1_PARSER);
        expect(PROJECT_HELLO_WORLD.parserOptions.keepAllTokens).toBe(false);
      });
    });

    describe('PROJECT_JSON', () => {
      it('should have correct configuration', () => {
        expect(PROJECT_JSON.id).toBe('json');
        expect(PROJECT_JSON.name).toBe('JSON');
        expect(PROJECT_JSON.grammar.uri).toBe('grammars/json.lark');
        expect(PROJECT_JSON.testCases[0].content).toBe('{"key": "value"}');
        expect(PROJECT_JSON.parserOptions.algorithm).toEqual(LALR1_PARSER);
      });
    });

    describe('PROJECT_CALCULATOR', () => {
      it('should have correct configuration', () => {
        expect(PROJECT_CALCULATOR.id).toBe('calculator');
        expect(PROJECT_CALCULATOR.name).toBe('Calculator');
        expect(PROJECT_CALCULATOR.grammar.uri).toBe('grammars/calc.lark');
        expect(PROJECT_CALCULATOR.testCases[0].content).toBe('2 + 20 / (13 - 6) + 1.5');
        expect(PROJECT_CALCULATOR.parserOptions.algorithm).toEqual(LALR1_PARSER);
      });
    });

    describe('PROJECT_FRUIT_FLIES', () => {
      it('should have correct configuration', () => {
        expect(PROJECT_FRUIT_FLIES.id).toBe('fruit-flies');
        expect(PROJECT_FRUIT_FLIES.name).toBe('Fruit Flies');
        expect(PROJECT_FRUIT_FLIES.grammar.uri).toBe('grammars/fruitflies.lark');
        expect(PROJECT_FRUIT_FLIES.testCases[0].content).toBe('fruit flies like bananas');
        expect(PROJECT_FRUIT_FLIES.parserOptions.algorithm).toEqual(EARLEY_PARSER);
        expect(PROJECT_FRUIT_FLIES.parserOptions.ambiguity).toBe(ParserAmbiguity.EXPLICIT);
      });
    });

    describe('PROJECT_SEMVER', () => {
      it('should have correct configuration', () => {
        expect(PROJECT_SEMVER.id).toBe('semver');
        expect(PROJECT_SEMVER.name).toBe('SemVer');
        expect(PROJECT_SEMVER.grammar.uri).toBe('grammars/semver.lark');
        expect(PROJECT_SEMVER.testCases[0].content).toBe('1.0.0-rc1+build.0001');
        expect(PROJECT_SEMVER.parserOptions.algorithm).toEqual(LALR1_PARSER);
      });
    });

    describe('PROJECT_CONFIGURATION', () => {
      it('should have correct configuration', () => {
        expect(PROJECT_CONFIGURATION.id).toBe('configuration');
        expect(PROJECT_CONFIGURATION.name).toBe('Configuration');
        expect(PROJECT_CONFIGURATION.grammar.uri).toBe('grammars/conf.lark');
        expect(PROJECT_CONFIGURATION.testCases[0].content).toBe('[main]\nhello=world\n');
        expect(PROJECT_CONFIGURATION.parserOptions.algorithm).toEqual(LALR1_PARSER);
      });
    });

    describe('PROJECT_LARK', () => {
      it('should have correct configuration', () => {
        expect(PROJECT_LARK.id).toBe('lark');
        expect(PROJECT_LARK.name).toBe('Lark');
        expect(PROJECT_LARK.grammar.uri).toBe('grammars/lark.lark');
        expect(PROJECT_LARK.testCases[0].content).toBe('start: "Hello" "World"');
        expect(PROJECT_LARK.parserOptions.algorithm).toEqual(EARLEY_PARSER);
        expect(PROJECT_LARK.parserOptions.maybePlaceholders).toBe(false);
      });
    });
  });

  describe('SAMPLE_PROJECTS', () => {
    it('should contain all sample projects', () => {
      expect(SAMPLE_PROJECTS).toHaveLength(7);
      expect(SAMPLE_PROJECTS).toContain(PROJECT_HELLO_WORLD);
      expect(SAMPLE_PROJECTS).toContain(PROJECT_JSON);
      expect(SAMPLE_PROJECTS).toContain(PROJECT_CALCULATOR);
      expect(SAMPLE_PROJECTS).toContain(PROJECT_FRUIT_FLIES);
      expect(SAMPLE_PROJECTS).toContain(PROJECT_SEMVER);
      expect(SAMPLE_PROJECTS).toContain(PROJECT_CONFIGURATION);
      expect(SAMPLE_PROJECTS).toContain(PROJECT_LARK);
    });

    it('should have unique project IDs', () => {
      const ids = SAMPLE_PROJECTS.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all projects with required properties', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('grammar');
        expect(project).toHaveProperty('testCases');
        expect(project).toHaveProperty('parserOptions');

        expect(typeof project.id).toBe('string');
        expect(typeof project.name).toBe('string');
        expect(Array.isArray(project.testCases)).toBe(true);
        expect(project.testCases.length).toBeGreaterThan(0);
      });
    });

    it('should have valid grammar URIs for all projects', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project.grammar.uri).toBeDefined();
        expect(project.grammar.uri).toMatch(/^grammars\/.+\.lark$/);
      });
    });

    it('should have valid test cases for all projects', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        project.testCases.forEach((testCase) => {
          expect(testCase).toHaveProperty('id');
          expect(testCase).toHaveProperty('description');
          expect(testCase).toHaveProperty('content');
          expect(typeof testCase.id).toBe('number');
          expect(typeof testCase.description).toBe('string');
          expect(typeof testCase.content).toBe('string');
        });
      });
    });

    it('should have valid parser options for all projects', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project.parserOptions).toHaveProperty('algorithm');
        expect(project.parserOptions.algorithm).toHaveProperty('id');
        expect(project.parserOptions.algorithm).toHaveProperty('name');
        expect(['lalr', 'earley']).toContain(project.parserOptions.algorithm.id);
      });
    });
  });
});
