import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const colors = {
  // Background colors
  background: '#111827', // gray-900
  surface: '#1f2937', // gray-800
  surfaceHighlight: '#374151', // gray-700

  // Text colors
  foreground: '#f3f4f6', // gray-100
  comment: '#9ca3af', // gray-400
  muted: '#6b7280', // gray-500

  // Syntax highlighting colors
  keyword: '#60a5fa', // blue-400
  string: '#34d399', // green-400
  number: '#f87171', // red-400
  function: '#a78bfa', // violet-400
  variable: '#fb923c', // orange-400
  type: '#22d3ee', // cyan-400
  constant: '#f472b6', // pink-400
  operator: '#d1d5db', // gray-300

  // UI elements
  selection: '#3b82f6', // blue-500
  selectionMatch: '#1e3a8a', // blue-800
  cursor: '#f3f4f6', // gray-100
  searchMatch: '#451a03', // amber-900
  searchMatchSelected: '#f59e0b', // amber-500

  // Borders and lines
  border: '#374151', // gray-700
  activeLine: 'rgba(59, 130, 246, 0.05)', // Very subtle blue tint for dark mode
  lineNumber: '#6b7280', // gray-500
  activeLineNumber: '#d1d5db', // gray-300

  // Status colors (from project palette) - adjusted for dark theme
  warning: '#fbbf24', // yellow-400
  error: '#f87171', // red-400
  success: '#34d399' // green-400
};

const larkIdeDarkEditorTheme = EditorView.theme(
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
      backgroundColor: colors.surface,
      color: colors.lineNumber,
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
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)'
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
  { dark: true }
);

const larkIdeDarkHighlightStyle = HighlightStyle.define([
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

export const larkIdeDarkTheme: Extension = [
  larkIdeDarkEditorTheme,
  syntaxHighlighting(larkIdeDarkHighlightStyle)
];
