export enum ParserAmbiguity {
  EXPLICIT = 'explicit',
  RESOLVE = 'resolve',
  FOREST = 'forest'
}

export type ParsingAlgorithm = {
  id: string;
  name: string;
};

export type ParserOptions = {
  algorithm: ParsingAlgorithm;
  keepAllTokens?: boolean;
  ambiguity?: ParserAmbiguity;
  maybePlaceholders?: boolean;
};

export type PythonCompatibleParserOptions = {
  parser: string;
  keep_all_tokens?: boolean;
  ambiguity?: string;
  maybe_placeholders?: boolean;
};

export const LALR1_PARSER: ParsingAlgorithm = {
  id: 'lalr',
  name: 'LALR(1)'
};

export const EARLEY_PARSER: ParsingAlgorithm = {
  id: 'earley',
  name: 'Earley'
};

export const AVAILABLE_PARSING_ALGORITHMS: ParsingAlgorithm[] = [LALR1_PARSER, EARLEY_PARSER];

export const DEFAULT_PARSER_OPTIONS: ParserOptions = {
  algorithm: EARLEY_PARSER,
  keepAllTokens: false
};

export const toPythonCompatibleParserOptions = (
  options: ParserOptions
): PythonCompatibleParserOptions => {
  const pythonCompatibleOptions: PythonCompatibleParserOptions = {
    parser: options.algorithm.id
  };

  if (Object.prototype.hasOwnProperty.call(options, 'keepAllTokens')) {
    pythonCompatibleOptions.keep_all_tokens = options.keepAllTokens;
  }

  if (Object.prototype.hasOwnProperty.call(options, 'ambiguity')) {
    pythonCompatibleOptions.ambiguity = options.ambiguity;
  }

  if (Object.prototype.hasOwnProperty.call(options, 'maybePlaceholders')) {
    pythonCompatibleOptions.maybe_placeholders = options.maybePlaceholders;
  }

  return pythonCompatibleOptions;
};
