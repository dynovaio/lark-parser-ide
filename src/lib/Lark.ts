const conf = {
    comments: {
        lineComment: '//'
    },
    brackets: [
        ['(', ')'],
        ['[', ']'],
        ['{', '}']
    ],
    autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: '/', close: '/' },
        { open: '"', close: '"' }
    ],
    surroundingPairs: [
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
        ['/', '/'],
        ['"', '"']
    ]
};

const language = {
    defaultToken: '',
    tokenPostfix: '.lark',
    keywords: [],
    brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.bracket' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
    tokenizer: {
        root: [
            { include: '@whitespace' },
            { include: '@numbers' },
            { include: '@strings' },
            [/%(import|ignore|declare|override|extend)/, 'keyword'],
            [/[|]/, 'delimiter'],
            [/[{}[\]()]/, '@brackets'],
            [/([a-zA-Z_]*)\s*:/, 'variable.name'],
            [/\s*->\s*([a-zA-Z_]*)/, 'variable.name'],
            [
                /[a-zA-Z_]\w*/,
                {
                    cases: {
                        '@keywords': 'keyword',
                        '@default': 'identifier'
                    }
                }
            ]
        ],
        // Deal with white space, including single-line comments
        whitespace: [
            [/\s+/, 'white'],
            [/(^\/\/.*$)/, 'comment']
        ],
        // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
        numbers: [
            [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
            [/-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?/, 'number']
        ],
        // Recognize strings, including those broken across lines with \ (but not without)
        strings: [
            [/'$/, 'string.escape', '@popall'],
            [/'/, 'string.escape', '@stringBody'],
            [/"$/, 'string.escape', '@popall'],
            [/"/, 'string.escape', '@dblStringBody']
        ],
        stringBody: [
            [/[^\\']+$/, 'string', '@popall'],
            [/[^\\']+/, 'string'],
            [/\\./, 'string'],
            [/'/, 'string.escape', '@popall'],
            [/\\$/, 'string']
        ],
        dblStringBody: [
            [/[^\\"]+$/, 'string', '@popall'],
            [/[^\\"]+/, 'string'],
            [/\\./, 'string'],
            [/"/, 'string.escape', '@popall'],
            [/\\$/, 'string']
        ]
    }
};

export { conf as LarkConfiguration, language as LarkLanguage };
