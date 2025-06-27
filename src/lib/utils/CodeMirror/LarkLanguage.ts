import { LanguageSupport } from '@codemirror/language';
import { StreamLanguage } from '@codemirror/language';

// Define the Lark grammar highlighting
const larkLanguage = StreamLanguage.define({
  name: 'lark',
  token(stream, state) {
    // Handle whitespace
    if (stream.eatSpace()) return null;

    // Handle line comments
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }

    // Handle keywords
    if (stream.match(/%(?:import|ignore|declare|override|extend)/)) {
      return 'keyword';
    }

    // Handle rule definitions (rule_name: ...)
    if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*(?=\s*:)/)) {
      return 'variableName';
    }

    // Handle rule transformations (-> rule_name)
    if (stream.match(/\s*->\s*([a-zA-Z_][a-zA-Z0-9_]*)/)) {
      return 'variableName';
    }

    // Handle strings
    if (stream.match(/"/)) {
      while (stream.next() && !stream.match(/"/)) {
        if (stream.match(/\\./)) continue;
      }
      return 'string';
    }

    if (stream.match(/'/)) {
      while (stream.next() && !stream.match(/'/)) {
        if (stream.match(/\\./)) continue;
      }
      return 'string';
    }

    // Handle regex literals
    if (stream.match(/\//)) {
      while (stream.next() && !stream.match(/\//)) {
        if (stream.match(/\\./)) continue;
      }
      return 'string';
    }

    // Handle brackets and delimiters
    if (stream.match(/[{}[\]()]/)) {
      return 'bracket';
    }

    // Handle operators
    if (stream.match(/[|+*?]/)) {
      return 'operator';
    }

    // Handle pipe delimiter
    if (stream.match(/\|/)) {
      return 'operator';
    }

    // Handle numbers
    if (stream.match(/-?0x[0-9a-fA-F]+[lL]?/)) {
      return 'number';
    }
    if (stream.match(/-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?/)) {
      return 'number';
    }

    // Handle identifiers
    if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return 'variableName';
    }

    // Handle single characters
    stream.next();
    return null;
  },

  languageData: {
    commentTokens: { line: '//' },
    closeBrackets: { brackets: ['(', '[', '{', '"', "'"] },
    indentOnInput: /^\s*[}\])]$/
  }
});

export function larkLanguageSupport(): LanguageSupport {
  return new LanguageSupport(larkLanguage);
}
