import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const colors = {
  // Background colors
  background: '#f3f4f6', // gray-100
  surface: '#e5e7eb', // gray-200
  surfaceHighlight: '#d1d5db', // gray-300

  // Text colors
  foreground: '#111827', // gray-900
  comment: '#6b7280', // gray-500
  muted: '#9ca3af', // gray-400

  // Syntax highlighting colors
  keyword: '#1d4ed8', // blue-700
  string: '#059669', // green-600
  number: '#dc2626', // red-600
  function: '#7c3aed', // violet-600
  variable: '#ea580c', // orange-600
  type: '#0891b2', // cyan-600
  constant: '#be185d', // pink-600
  operator: '#374151', // gray-700

  // UI elements
  selection: '#3b82f6', // blue-500
  selectionMatch: '#dbeafe', // blue-100
  cursor: '#111827', // gray-900
  searchMatch: '#fef3c7', // amber-100
  searchMatchSelected: '#f59e0b', // amber-500

  // Borders and lines
  border: '#d1d5db', // gray-300
  activeLine: 'rgba(59, 130, 246, 0.03)', // Very subtle blue tint instead of gray
  lineNumber: '#9ca3af', // gray-400
  activeLineNumber: '#374151', // gray-700

  // Status colors (from project palette)
  warning: '#d97706', // yellow-600
  error: '#dc2626', // red-600
  success: '#059669' // green-600
};

const larkIdeLightEditorTheme = EditorView.theme(
  {
    '&': {
      color: colors.foreground,
      backgroundColor: colors.background,
      fontFamily: '"Fira Mono", monospace'
    },

    '.cm-content': {
      padding: '16px 0',
      caretColor: colors.cursor,
      lineHeight: '1.6'
    },

    '.cm-focused': {
      outline: `2px solid ${colors.selection}`,
      outlineOffset: '-2px'
    },

    '.cm-editor.cm-focused': {
      outline: 'none'
    },

    '.cm-scroller': {
      lineHeight: '1.6'
    },

    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: colors.cursor,
      borderLeftWidth: '2px'
    },

    '&.cm-focused .cm-cursor': {
      borderLeftColor: colors.cursor
    },

    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: colors.selectionMatch,
      borderRadius: '2px'
    },

    '.cm-line .cm-selectionBackground': {
      backgroundColor: colors.selectionMatch,
      position: 'relative',
      zIndex: 10
    },

    '.cm-panels': {
      backgroundColor: colors.surface,
      color: colors.foreground,
      border: `1px solid ${colors.border}`
    },

    '.cm-panels.cm-panels-top': {
      borderBottom: `1px solid ${colors.border}`
    },

    '.cm-panels.cm-panels-bottom': {
      borderTop: `1px solid ${colors.border}`
    },

    '.cm-searchMatch': {
      backgroundColor: colors.searchMatch,
      border: `1px solid ${colors.warning}`
    },

    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: colors.searchMatchSelected
    },

    '.cm-activeLine': {
      backgroundColor: colors.activeLine,
      position: 'relative'
    },

    '.cm-activeLine .cm-selectionBackground': {
      backgroundColor: colors.selectionMatch,
      position: 'relative',
      zIndex: 15
    },

    '.cm-selectionMatch': {
      backgroundColor: colors.selectionMatch
    },

    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: colors.surfaceHighlight,
      outline: `1px solid ${colors.border}`
    },

    '.cm-gutters': {
      color: colors.lineNumber,
      backgroundColor: colors.background,
      border: 'none',
      borderRight: `1px solid ${colors.border}`
    },

    '.cm-activeLineGutter': {
      backgroundColor: colors.activeLine,
      color: colors.activeLineNumber
    },

    '.cm-foldPlaceholder': {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      color: colors.muted
    },

    '.cm-tooltip': {
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.background,
      color: colors.foreground,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    },

    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: colors.border
    },

    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: colors.background
    },

    '.cm-completionLabel': {
      color: colors.foreground
    },

    '.cm-completionDetail': {
      color: colors.muted,
      fontStyle: 'italic'
    },

    '.cm-completionIcon': {
      color: colors.selection
    },

    '.cm-diagnostic-error': {
      borderLeft: `4px solid ${colors.error}`
    },

    '.cm-diagnostic-warning': {
      borderLeft: `4px solid ${colors.warning}`
    },

    '.cm-diagnostic-info': {
      borderLeft: `4px solid ${colors.selection}`
    }
  },
  { dark: false }
);

const larkIdeLightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: colors.keyword, fontWeight: 'bold' },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: colors.foreground },
  { tag: [t.function(t.variableName), t.labelName], color: colors.function, fontWeight: 'bold' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: colors.constant },
  { tag: [t.definition(t.name), t.separator], color: colors.foreground },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace
    ],
    color: colors.type
  },
  {
    tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
    color: colors.operator
  },
  { tag: [t.meta, t.comment], color: colors.comment, fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: colors.selection, textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: colors.keyword },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: colors.constant },
  { tag: [t.processingInstruction, t.string, t.inserted], color: colors.string },
  { tag: t.invalid, color: colors.error },
  { tag: [t.variableName], color: colors.variable },
  { tag: [t.number], color: colors.number }
]);

export const larkIdeLightTheme: Extension = [
  larkIdeLightEditorTheme,
  syntaxHighlighting(larkIdeLightHighlightStyle)
];
