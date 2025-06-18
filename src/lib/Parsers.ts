export interface Parser {
    id: string;
    label: string;
}

export interface ParserOptions {
    parser: Parser;
    keepAllTokens?: boolean;
}

export const LALR1_PARSER: Parser = { id: 'lalr', label: 'LALR(1)' };
export const EARLEY_PARSER: Parser = { id: 'earley', label: 'Earley' };

export const AVAILABLE_PARSERS: Parser[] = [LALR1_PARSER, EARLEY_PARSER];
