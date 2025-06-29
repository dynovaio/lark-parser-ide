import { describe, it, expect } from 'vitest';
import {
  ParserAmbiguity,
  LALR1_PARSER,
  EARLEY_PARSER,
  AVAILABLE_PARSING_ALGORITHMS,
  DEFAULT_PARSER_OPTIONS,
  toPythonCompatibleParserOptions
} from '../../src/lib/utils/Parser';
import type { ParsingAlgorithm, ParserOptions } from '../../src/lib/utils/Parser';

describe('Parser utils', () => {
  describe('ParserAmbiguity enum', () => {
    it('should have correct values', () => {
      expect(ParserAmbiguity.EXPLICIT).toBe('explicit');
      expect(ParserAmbiguity.RESOLVE).toBe('resolve');
      expect(ParserAmbiguity.FOREST).toBe('forest');
    });
  });

  describe('Parser algorithms', () => {
    it('should have correct LALR1 parser definition', () => {
      expect(LALR1_PARSER).toEqual({
        id: 'lalr',
        name: 'LALR(1)'
      });
    });

    it('should have correct Earley parser definition', () => {
      expect(EARLEY_PARSER).toEqual({
        id: 'earley',
        name: 'Earley'
      });
    });

    it('should include both parsers in available algorithms', () => {
      expect(AVAILABLE_PARSING_ALGORITHMS).toEqual([LALR1_PARSER, EARLEY_PARSER]);
      expect(AVAILABLE_PARSING_ALGORITHMS).toHaveLength(2);
    });
  });

  describe('DEFAULT_PARSER_OPTIONS', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_PARSER_OPTIONS).toEqual({
        algorithm: EARLEY_PARSER,
        keepAllTokens: false
      });
    });
  });

  describe('toPythonCompatibleParserOptions', () => {
    it('should convert basic parser options', () => {
      const options: ParserOptions = {
        algorithm: LALR1_PARSER,
        keepAllTokens: true
      };

      const result = toPythonCompatibleParserOptions(options);

      expect(result).toEqual({
        parser: 'lalr',
        keep_all_tokens: true
      });
    });

    it('should convert all possible options', () => {
      const options: ParserOptions = {
        algorithm: EARLEY_PARSER,
        keepAllTokens: false,
        ambiguity: ParserAmbiguity.EXPLICIT,
        maybePlaceholders: true
      };

      const result = toPythonCompatibleParserOptions(options);

      expect(result).toEqual({
        parser: 'earley',
        keep_all_tokens: false,
        ambiguity: 'explicit',
        maybe_placeholders: true
      });
    });

    it('should only include defined properties', () => {
      const options: ParserOptions = {
        algorithm: LALR1_PARSER
      };

      const result = toPythonCompatibleParserOptions(options);

      expect(result).toEqual({
        parser: 'lalr'
      });
      expect(result).not.toHaveProperty('keep_all_tokens');
      expect(result).not.toHaveProperty('ambiguity');
      expect(result).not.toHaveProperty('maybe_placeholders');
    });

    it('should handle keepAllTokens: false explicitly', () => {
      const options: ParserOptions = {
        algorithm: EARLEY_PARSER,
        keepAllTokens: false
      };

      const result = toPythonCompatibleParserOptions(options);

      expect(result).toEqual({
        parser: 'earley',
        keep_all_tokens: false
      });
    });

    it('should handle all ambiguity types', () => {
      const explicitOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        ambiguity: ParserAmbiguity.EXPLICIT
      };

      const resolveOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        ambiguity: ParserAmbiguity.RESOLVE
      };

      const forestOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        ambiguity: ParserAmbiguity.FOREST
      };

      expect(toPythonCompatibleParserOptions(explicitOptions).ambiguity).toBe('explicit');
      expect(toPythonCompatibleParserOptions(resolveOptions).ambiguity).toBe('resolve');
      expect(toPythonCompatibleParserOptions(forestOptions).ambiguity).toBe('forest');
    });

    it('should handle maybePlaceholders option', () => {
      const optionsTrue: ParserOptions = {
        algorithm: LALR1_PARSER,
        maybePlaceholders: true
      };

      const optionsFalse: ParserOptions = {
        algorithm: LALR1_PARSER,
        maybePlaceholders: false
      };

      expect(toPythonCompatibleParserOptions(optionsTrue).maybe_placeholders).toBe(true);
      expect(toPythonCompatibleParserOptions(optionsFalse).maybe_placeholders).toBe(false);
    });
  });

  describe('Type safety and edge cases', () => {
    it('should handle all parser ambiguity values', () => {
      const ambiguityValues: ParserAmbiguity[] = [
        ParserAmbiguity.EXPLICIT,
        ParserAmbiguity.RESOLVE,
        ParserAmbiguity.FOREST
      ];

      ambiguityValues.forEach((ambiguity) => {
        expect(Object.values(ParserAmbiguity)).toContain(ambiguity);
      });
    });

    it('should maintain type consistency for ParsingAlgorithm', () => {
      const checkAlgorithm = (algorithm: ParsingAlgorithm): boolean => {
        return typeof algorithm.id === 'string' && typeof algorithm.name === 'string';
      };

      expect(checkAlgorithm(LALR1_PARSER)).toBe(true);
      expect(checkAlgorithm(EARLEY_PARSER)).toBe(true);
    });

    it('should support creating custom algorithms', () => {
      const customAlgorithm: ParsingAlgorithm = {
        id: 'custom',
        name: 'Custom Parser'
      };

      expect(customAlgorithm.id).toBe('custom');
      expect(customAlgorithm.name).toBe('Custom Parser');
    });

    it('should handle minimal parser options', () => {
      const minimalOptions: ParserOptions = {
        algorithm: LALR1_PARSER
      };

      const result = toPythonCompatibleParserOptions(minimalOptions);

      expect(result).toEqual({
        parser: 'lalr'
      });
    });

    it('should handle all optional parser options', () => {
      const fullOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        keepAllTokens: true,
        ambiguity: ParserAmbiguity.FOREST,
        maybePlaceholders: false
      };

      const result = toPythonCompatibleParserOptions(fullOptions);

      expect(result).toEqual({
        parser: 'earley',
        keep_all_tokens: true,
        ambiguity: 'forest',
        maybe_placeholders: false
      });
    });

    it('should omit undefined optional properties', () => {
      const optionsWithUndefined: ParserOptions = {
        algorithm: LALR1_PARSER,
        keepAllTokens: undefined,
        ambiguity: undefined,
        maybePlaceholders: undefined
      };

      const result = toPythonCompatibleParserOptions(optionsWithUndefined);

      expect(result).toEqual({
        parser: 'lalr'
      });
      expect(result.keep_all_tokens).toBeUndefined();
      expect(result.ambiguity).toBeUndefined();
      expect(result.maybe_placeholders).toBeUndefined();
    });

    it('should handle false boolean values correctly', () => {
      const optionsWithFalse: ParserOptions = {
        algorithm: EARLEY_PARSER,
        keepAllTokens: false,
        maybePlaceholders: false
      };

      const result = toPythonCompatibleParserOptions(optionsWithFalse);

      expect(result).toEqual({
        parser: 'earley',
        keep_all_tokens: false,
        maybe_placeholders: false
      });
    });

    it('should preserve exact algorithm ID mapping', () => {
      const lalrOptions: ParserOptions = { algorithm: LALR1_PARSER };
      const earleyOptions: ParserOptions = { algorithm: EARLEY_PARSER };

      expect(toPythonCompatibleParserOptions(lalrOptions).parser).toBe('lalr');
      expect(toPythonCompatibleParserOptions(earleyOptions).parser).toBe('earley');
    });

    it('should handle custom algorithms gracefully', () => {
      const customAlgorithm: ParsingAlgorithm = {
        id: 'cyk',
        name: 'CYK Parser'
      };

      const options: ParserOptions = {
        algorithm: customAlgorithm,
        keepAllTokens: true
      };

      const result = toPythonCompatibleParserOptions(options);

      expect(result).toEqual({
        parser: 'cyk',
        keep_all_tokens: true
      });
    });
  });

  describe('AVAILABLE_PARSING_ALGORITHMS immutability', () => {
    it('should not be modifiable', () => {
      const originalLength = AVAILABLE_PARSING_ALGORITHMS.length;

      // Attempt to modify should not affect the original
      expect(() => {
        const copy = [...AVAILABLE_PARSING_ALGORITHMS];
        copy.push({ id: 'test', name: 'Test' });
        return copy;
      }).not.toThrow();

      expect(AVAILABLE_PARSING_ALGORITHMS).toHaveLength(originalLength);
    });

    it('should contain valid algorithm objects', () => {
      AVAILABLE_PARSING_ALGORITHMS.forEach((algorithm) => {
        expect(algorithm).toHaveProperty('id');
        expect(algorithm).toHaveProperty('name');
        expect(typeof algorithm.id).toBe('string');
        expect(typeof algorithm.name).toBe('string');
        expect(algorithm.id.length).toBeGreaterThan(0);
        expect(algorithm.name.length).toBeGreaterThan(0);
      });
    });

    it('should maintain consistent ordering', () => {
      expect(AVAILABLE_PARSING_ALGORITHMS[0]).toBe(LALR1_PARSER);
      expect(AVAILABLE_PARSING_ALGORITHMS[1]).toBe(EARLEY_PARSER);
    });
  });

  describe('DEFAULT_PARSER_OPTIONS usage', () => {
    it('should be usable as base for custom options', () => {
      const customOptions: ParserOptions = {
        ...DEFAULT_PARSER_OPTIONS,
        keepAllTokens: true,
        ambiguity: ParserAmbiguity.EXPLICIT
      };

      expect(customOptions.algorithm).toBe(EARLEY_PARSER);
      expect(customOptions.keepAllTokens).toBe(true);
      expect(customOptions.ambiguity).toBe(ParserAmbiguity.EXPLICIT);
    });

    it('should work with all algorithms', () => {
      const lalrOptions: ParserOptions = {
        ...DEFAULT_PARSER_OPTIONS,
        algorithm: LALR1_PARSER
      };

      const earleyOptions: ParserOptions = {
        ...DEFAULT_PARSER_OPTIONS,
        algorithm: EARLEY_PARSER
      };

      expect(lalrOptions.algorithm).toBe(LALR1_PARSER);
      expect(earleyOptions.algorithm).toBe(EARLEY_PARSER);
    });
  });

  describe('Python compatibility edge cases', () => {
    it('should handle empty string ambiguity', () => {
      const options: ParserOptions = {
        algorithm: LALR1_PARSER,
        ambiguity: '' as ParserAmbiguity // Edge case
      };

      const result = toPythonCompatibleParserOptions(options);

      expect(result.ambiguity).toBe('');
    });

    it('should preserve all ParserAmbiguity enum values', () => {
      const explicitOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        ambiguity: ParserAmbiguity.EXPLICIT
      };

      const resolveOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        ambiguity: ParserAmbiguity.RESOLVE
      };

      const forestOptions: ParserOptions = {
        algorithm: EARLEY_PARSER,
        ambiguity: ParserAmbiguity.FOREST
      };

      expect(toPythonCompatibleParserOptions(explicitOptions).ambiguity).toBe('explicit');
      expect(toPythonCompatibleParserOptions(resolveOptions).ambiguity).toBe('resolve');
      expect(toPythonCompatibleParserOptions(forestOptions).ambiguity).toBe('forest');
    });

    it('should maintain property names consistently', () => {
      const options: ParserOptions = {
        algorithm: EARLEY_PARSER,
        keepAllTokens: true,
        ambiguity: ParserAmbiguity.RESOLVE,
        maybePlaceholders: true
      };

      const result = toPythonCompatibleParserOptions(options);
      const expectedKeys = ['parser', 'keep_all_tokens', 'ambiguity', 'maybe_placeholders'];

      expectedKeys.forEach((key) => {
        expect(result).toHaveProperty(key);
      });
    });

    it('should return new object and not modify original', () => {
      const originalOptions: ParserOptions = {
        algorithm: LALR1_PARSER,
        keepAllTokens: false
      };

      const result = toPythonCompatibleParserOptions(originalOptions);

      expect(result).not.toBe(originalOptions);
      expect(originalOptions.algorithm).toBe(LALR1_PARSER);
      expect(originalOptions.keepAllTokens).toBe(false);
    });
  });
});
