export interface Parser {
    id: string;
    label: string;
}

export const LALR1_PARSER: Parser = { id: 'lalr', label: 'LALR(1)' };
export const EARLEY_PARSER: Parser = { id: 'earley', label: 'Earley' };

export const AVAILABLE_PARSERS: Parser[] = [LALR1_PARSER, EARLEY_PARSER];

export interface ParserOptions {
    parser: Parser;
    keepAllTokens?: boolean;
    ambiguity?: string;
    maybePlaceholders?: boolean;
}

export const DEFAULT_PARSER_OPTIONS: ParserOptions = {
    parser: EARLEY_PARSER,
    keepAllTokens: false
};

export interface PythonCompatibleParserOptions {
    parser: string;
    keep_all_tokens?: boolean;
    ambiguity?: string;
    maybe_placeholders?: boolean;
}

export const toPythonCompatibleParserOptions = (
    options: ParserOptions
): PythonCompatibleParserOptions => {
    const pythonComatibleOptions: PythonCompatibleParserOptions = {
        parser: options.parser.id
    };

    Object.prototype.hasOwnProperty.call(options, 'keepAllTokens') &&
        (pythonComatibleOptions.keep_all_tokens = options.keepAllTokens);
    Object.prototype.hasOwnProperty.call(options, 'ambiguity') &&
        (pythonComatibleOptions.ambiguity = options.ambiguity);
    Object.prototype.hasOwnProperty.call(options, 'maybePlaceholders') &&
        (pythonComatibleOptions.maybe_placeholders = options.maybePlaceholders);

    console.log(options, pythonComatibleOptions);

    return pythonComatibleOptions;
};
