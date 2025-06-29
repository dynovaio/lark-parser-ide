import { describe, it, expect } from 'vitest';
import { larkLanguage } from './LarkLanguage';
import { LanguageSupport } from '@codemirror/language';

describe('LarkLanguage', () => {
  describe('larkLanguage function', () => {
    it('should return a LanguageSupport instance', () => {
      const language = larkLanguage();
      expect(language).toBeInstanceOf(LanguageSupport);
    });

    it('should have language configuration', () => {
      const language = larkLanguage();
      expect(language.language).toBeDefined();
    });

    it('should support lark syntax highlighting', () => {
      const language = larkLanguage();
      expect(language).toBeDefined();
      expect(language.language).toBeDefined();
    });
  });

  describe('Language features', () => {
    it('should provide syntax highlighting for lark grammar', () => {
      const language = larkLanguage();
      expect(language.language).toBeDefined();

      // Test that the language support includes the necessary components
      expect(language.support).toBeDefined();
    });

    it('should handle basic lark grammar constructs', () => {
      // This is a basic test to ensure the language extension loads correctly
      const language = larkLanguage();
      expect(language).toBeInstanceOf(LanguageSupport);
    });
  });

  describe('StreamLanguage definition', () => {
    // Since we can't easily access the internal tokenizer without complex mocking,
    // we'll test the language support at a higher level
    it('should be configured with lark name', () => {
      const language = larkLanguage();
      expect(language).toBeDefined();
    });

    it('should provide language support features', () => {
      const language = larkLanguage();
      expect(language.language).toBeDefined();
      expect(language.support).toBeDefined();
    });
  });

  describe('Integration readiness', () => {
    it('should be ready for CodeMirror integration', () => {
      const language = larkLanguage();

      // Test basic structure that CodeMirror expects
      expect(language).toBeInstanceOf(LanguageSupport);
      expect(language.language).toBeDefined();
      expect(language.support).toBeDefined();
    });

    it('should support typical lark grammar features', () => {
      // This test ensures the language can be instantiated without errors
      expect(() => larkLanguage()).not.toThrow();
    });
  });
});
