import { describe, it, expect } from 'vitest';
import type { TokenType, TreeType } from '@/lib/components/Ide/Test/Tree.svelte';

describe('Tree Types', () => {
  describe('TokenType', () => {
    it('should accept string values', () => {
      const token: TokenType = 'HELLO';
      expect(typeof token).toBe('string');
      expect(token).toBe('HELLO');
    });

    it('should work with various string formats', () => {
      const tokens: TokenType[] = [
        'IDENTIFIER',
        'NUMBER',
        'STRING_LITERAL',
        'OPERATOR_PLUS',
        '',
        'multi word token'
      ];

      tokens.forEach((token) => {
        expect(typeof token).toBe('string');
      });
    });
  });

  describe('TreeType', () => {
    it('should require type and data properties', () => {
      const tree: TreeType = {
        type: 'expression',
        data: 'add'
      };

      expect(tree.type).toBe('expression');
      expect(tree.data).toBe('add');
      expect(tree.children).toBeUndefined();
    });

    it('should accept optional children array', () => {
      const tree: TreeType = {
        type: 'statement',
        data: 'assignment',
        children: ['variable', 'EQUALS', 'value']
      };

      expect(tree.children).toBeDefined();
      expect(Array.isArray(tree.children)).toBe(true);
      expect(tree.children).toHaveLength(3);
    });

    it('should support nested tree structures', () => {
      const nestedTree: TreeType = {
        type: 'program',
        data: 'start',
        children: [
          {
            type: 'statement',
            data: 'expression',
            children: ['number', 'PLUS', 'number']
          },
          'SEMICOLON'
        ]
      };

      expect(nestedTree.children).toHaveLength(2);
      expect(typeof nestedTree.children![1]).toBe('string');

      const childTree = nestedTree.children![0] as TreeType;
      expect(childTree.type).toBe('statement');
      expect(childTree.data).toBe('expression');
      expect(childTree.children).toHaveLength(3);
    });

    it('should allow mixed children types', () => {
      const mixedTree: TreeType = {
        type: 'complex',
        data: 'root',
        children: [
          'TOKEN_START',
          {
            type: 'subtree',
            data: 'branch',
            children: ['leaf']
          },
          'TOKEN_END'
        ]
      };

      expect(mixedTree.children).toHaveLength(3);
      expect(typeof mixedTree.children![0]).toBe('string');
      expect(typeof mixedTree.children![1]).toBe('object');
      expect(typeof mixedTree.children![2]).toBe('string');
    });

    it('should handle empty children array', () => {
      const emptyChildrenTree: TreeType = {
        type: 'empty',
        data: 'void',
        children: []
      };

      expect(emptyChildrenTree.children).toBeDefined();
      expect(emptyChildrenTree.children).toHaveLength(0);
    });
  });

  describe('Tree structure validation', () => {
    it('should support deep nesting', () => {
      const deepTree: TreeType = {
        type: 'level0',
        data: 'root',
        children: [
          {
            type: 'level1',
            data: 'branch1',
            children: [
              {
                type: 'level2',
                data: 'branch2',
                children: [
                  {
                    type: 'level3',
                    data: 'leaf',
                    children: ['terminal']
                  }
                ]
              }
            ]
          }
        ]
      };

      // Navigate to the deepest level
      const level1 = deepTree.children![0] as TreeType;
      const level2 = level1.children![0] as TreeType;
      const level3 = level2.children![0] as TreeType;
      const terminal = level3.children![0] as TokenType;

      expect(level1.type).toBe('level1');
      expect(level2.type).toBe('level2');
      expect(level3.type).toBe('level3');
      expect(terminal).toBe('terminal');
    });

    it('should maintain type consistency across array operations', () => {
      const children: Array<TreeType | TokenType> = [
        'TOKEN1',
        {
          type: 'node',
          data: 'branch'
        },
        'TOKEN2'
      ];

      const tree: TreeType = {
        type: 'parent',
        data: 'root',
        children
      };

      // Type guards should work correctly
      tree.children?.forEach((child) => {
        if (typeof child === 'string') {
          expect(['TOKEN1', 'TOKEN2']).toContain(child);
        } else {
          expect(child.type).toBe('node');
          expect(child.data).toBe('branch');
        }
      });
    });
  });

  describe('Real-world parse tree examples', () => {
    it('should represent arithmetic expression correctly', () => {
      const arithmeticTree: TreeType = {
        type: 'expression',
        data: 'add',
        children: [
          {
            type: 'expression',
            data: 'number',
            children: ['2']
          },
          'PLUS',
          {
            type: 'expression',
            data: 'number',
            children: ['3']
          }
        ]
      };

      expect(arithmeticTree.type).toBe('expression');
      expect(arithmeticTree.children).toHaveLength(3);

      const leftOperand = arithmeticTree.children![0] as TreeType;
      const operator = arithmeticTree.children![1] as TokenType;
      const rightOperand = arithmeticTree.children![2] as TreeType;

      expect(leftOperand.data).toBe('number');
      expect(operator).toBe('PLUS');
      expect(rightOperand.data).toBe('number');
    });

    it('should represent function call structure', () => {
      const functionCallTree: TreeType = {
        type: 'function_call',
        data: 'call',
        children: [
          'print',
          'LPAREN',
          {
            type: 'arguments',
            data: 'args',
            children: [
              {
                type: 'string',
                data: 'literal',
                children: ['"Hello, World!"']
              }
            ]
          },
          'RPAREN'
        ]
      };

      expect(functionCallTree.type).toBe('function_call');
      expect(functionCallTree.children).toHaveLength(4);

      const functionName = functionCallTree.children![0] as TokenType;
      const args = functionCallTree.children![2] as TreeType;
      const stringLiteral = args.children![0] as TreeType;

      expect(functionName).toBe('print');
      expect(args.type).toBe('arguments');
      expect(stringLiteral.type).toBe('string');
      expect(stringLiteral.children![0]).toBe('"Hello, World!"');
    });
  });
});
