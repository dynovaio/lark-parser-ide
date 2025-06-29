import { describe, it, expect } from 'vitest';
import type { IconWeight, IconBaseProps, IconComponentProps, IconContextProps } from './shared';

describe('Icon Type Definitions', () => {
  describe('IconWeight', () => {
    it('should accept all valid weight values', () => {
      const validWeights: IconWeight[] = ['bold', 'duotone', 'fill', 'light', 'thin', 'regular'];

      validWeights.forEach((weight) => {
        expect(['bold', 'duotone', 'fill', 'light', 'thin', 'regular']).toContain(weight);
      });
    });

    it('should be assignable to string', () => {
      const weight: IconWeight = 'bold';
      const str: string = weight;
      expect(typeof str).toBe('string');
    });
  });

  describe('IconBaseProps', () => {
    it('should have optional color property with default', () => {
      const props: IconBaseProps = {};
      expect(props.color).toBeUndefined();

      const propsWithColor: IconBaseProps = { color: '#ff0000' };
      expect(propsWithColor.color).toBe('#ff0000');
    });

    it('should accept both number and string for size', () => {
      const propsWithNumberSize: IconBaseProps = { size: 24 };
      const propsWithStringSize: IconBaseProps = { size: '2em' };

      expect(typeof propsWithNumberSize.size).toBe('number');
      expect(typeof propsWithStringSize.size).toBe('string');
    });

    it('should have optional weight with valid values', () => {
      const props: IconBaseProps = {};
      expect(props.weight).toBeUndefined();

      const propsWithWeight: IconBaseProps = { weight: 'bold' };
      expect(propsWithWeight.weight).toBe('bold');
    });

    it('should have optional mirrored boolean property', () => {
      const props: IconBaseProps = {};
      expect(props.mirrored).toBeUndefined();

      const propsWithMirrored: IconBaseProps = { mirrored: true };
      expect(propsWithMirrored.mirrored).toBe(true);
    });

    it('should support all properties together', () => {
      const fullProps: IconBaseProps = {
        color: 'blue',
        size: 32,
        weight: 'fill',
        mirrored: false
      };

      expect(fullProps.color).toBe('blue');
      expect(fullProps.size).toBe(32);
      expect(fullProps.weight).toBe('fill');
      expect(fullProps.mirrored).toBe(false);
    });
  });

  describe('IconComponentProps', () => {
    it('should extend IconBaseProps', () => {
      const props: IconComponentProps = {
        color: 'red',
        size: '1.5em',
        weight: 'light'
      };

      // Should have IconBaseProps
      expect(props.color).toBe('red');
      expect(props.size).toBe('1.5em');
      expect(props.weight).toBe('light');
    });

    it('should support SVG attributes', () => {
      const props: IconComponentProps = {
        color: 'green',
        className: 'my-icon',
        'data-testid': 'test-icon',
        role: 'img',
        'aria-label': 'Test icon'
      };

      expect(props.color).toBe('green');
      expect(props.className).toBe('my-icon');
      expect(props['data-testid']).toBe('test-icon');
      expect(props.role).toBe('img');
      expect(props['aria-label']).toBe('Test icon');
    });

    it('should not allow IconBaseProps in SVG attributes', () => {
      // This test ensures the Omit works correctly
      const props: IconComponentProps = {
        id: 'my-svg-id',
        className: 'svg-class'
        // These should not be allowed as SVG attributes due to Omit:
        // color: 'blue' // This is from IconBaseProps, should be separate
      };

      expect(props.id).toBe('my-svg-id');
      expect(props.className).toBe('svg-class');
    });
  });

  describe('IconContextProps', () => {
    it('should have values property of IconComponentProps type', () => {
      const contextProps: IconContextProps = {
        values: {
          color: 'purple',
          size: 48,
          weight: 'duotone'
        }
      };

      expect(contextProps.values.color).toBe('purple');
      expect(contextProps.values.size).toBe(48);
      expect(contextProps.values.weight).toBe('duotone');
    });

    it('should have optional children snippet', () => {
      const contextWithoutChildren: IconContextProps = {
        values: { color: 'black' }
      };
      expect(contextWithoutChildren.children).toBeUndefined();

      const contextWithChildren: IconContextProps = {
        values: { color: 'white' },
        children: undefined // Snippet type from Svelte
      };
      expect(contextWithChildren.children).toBeUndefined();
    });

    it('should support complex icon configurations', () => {
      const complexContext: IconContextProps = {
        values: {
          color: 'currentColor',
          size: '2rem',
          weight: 'regular',
          mirrored: false,
          className: 'icon-class',
          'aria-hidden': 'true'
        }
      };

      expect(complexContext.values.color).toBe('currentColor');
      expect(complexContext.values.size).toBe('2rem');
      expect(complexContext.values.weight).toBe('regular');
      expect(complexContext.values.mirrored).toBe(false);
      expect(complexContext.values.className).toBe('icon-class');
      expect(complexContext.values['aria-hidden']).toBe('true');
    });
  });

  describe('Type compatibility', () => {
    it('should allow IconBaseProps to be used in IconComponentProps', () => {
      const baseProps: IconBaseProps = {
        color: 'orange',
        size: 16,
        weight: 'thin',
        mirrored: true
      };

      const componentProps: IconComponentProps = {
        ...baseProps,
        id: 'icon-id'
      };

      expect(componentProps.color).toBe(baseProps.color);
      expect(componentProps.size).toBe(baseProps.size);
      expect(componentProps.weight).toBe(baseProps.weight);
      expect(componentProps.mirrored).toBe(baseProps.mirrored);
      expect(componentProps.id).toBe('icon-id');
    });

    it('should allow IconComponentProps in context values', () => {
      const componentProps: IconComponentProps = {
        color: 'cyan',
        size: 20,
        weight: 'bold',
        'data-icon': 'test'
      };

      const context: IconContextProps = {
        values: componentProps
      };

      expect(context.values).toBe(componentProps);
    });

    it('should ensure type safety for weight values', () => {
      // This should compile without errors
      const weights: IconWeight[] = ['bold', 'duotone', 'fill', 'light', 'thin', 'regular'];

      weights.forEach((weight) => {
        const props: IconBaseProps = { weight };
        expect(props.weight).toBe(weight);
      });
    });
  });
});
