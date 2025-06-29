import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { pyodideInstance } from './Pyodide';
import type { PyodideModule } from '$lib/utils/Pyodide';

describe('Pyodide store', () => {
  let mockPyodideModule: PyodideModule;

  beforeEach(() => {
    // Reset store to null
    pyodideInstance.set(null);

    // Create mock pyodide module
    mockPyodideModule = {
      runPythonAsync: vi.fn(),
      loadPackage: vi.fn(),
      globals: {
        set: vi.fn(),
        get: vi.fn()
      }
    } as unknown as PyodideModule;
  });

  describe('Initial state', () => {
    it('should have initial value of null', () => {
      expect(get(pyodideInstance)).toBeNull();
    });
  });

  describe('Setting pyodide instance', () => {
    it('should update with pyodide module', () => {
      pyodideInstance.set(mockPyodideModule);
      expect(get(pyodideInstance)).toBe(mockPyodideModule);
    });

    it('should update back to null', () => {
      pyodideInstance.set(mockPyodideModule);
      pyodideInstance.set(null);
      expect(get(pyodideInstance)).toBeNull();
    });

    it('should notify subscribers on changes', () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = pyodideInstance.subscribe(mockSubscriber);

      pyodideInstance.set(mockPyodideModule);
      pyodideInstance.set(null);

      expect(mockSubscriber).toHaveBeenCalledWith(null); // initial
      expect(mockSubscriber).toHaveBeenCalledWith(mockPyodideModule); // first change
      expect(mockSubscriber).toHaveBeenCalledWith(null); // second change

      unsubscribe();
    });
  });

  describe('Store behavior', () => {
    it('should maintain reference to pyodide instance', () => {
      pyodideInstance.set(mockPyodideModule);
      const retrieved = get(pyodideInstance);
      expect(retrieved).toBe(mockPyodideModule);
      expect(retrieved).toHaveProperty('runPythonAsync');
      expect(retrieved).toHaveProperty('loadPackage');
      expect(retrieved).toHaveProperty('globals');
    });

    it('should handle multiple subscribers', () => {
      const mockSubscriber1 = vi.fn();
      const mockSubscriber2 = vi.fn();

      const unsubscribe1 = pyodideInstance.subscribe(mockSubscriber1);
      const unsubscribe2 = pyodideInstance.subscribe(mockSubscriber2);

      pyodideInstance.set(mockPyodideModule);

      expect(mockSubscriber1).toHaveBeenCalledWith(mockPyodideModule);
      expect(mockSubscriber2).toHaveBeenCalledWith(mockPyodideModule);

      unsubscribe1();
      unsubscribe2();
    });

    it('should allow checking if pyodide is loaded', () => {
      expect(get(pyodideInstance)).toBeNull();

      pyodideInstance.set(mockPyodideModule);
      expect(get(pyodideInstance)).not.toBeNull();
      expect(get(pyodideInstance)).toBeTruthy();
    });

    it('should support derived computations', () => {
      let isLoaded = false;

      const unsubscribe = pyodideInstance.subscribe((instance) => {
        isLoaded = instance !== null;
      });

      expect(isLoaded).toBe(false);

      pyodideInstance.set(mockPyodideModule);
      expect(isLoaded).toBe(true);

      pyodideInstance.set(null);
      expect(isLoaded).toBe(false);

      unsubscribe();
    });
  });

  describe('TypeScript type safety', () => {
    it('should accept PyodideModule or null', () => {
      // These should not cause TypeScript errors
      pyodideInstance.set(null);
      pyodideInstance.set(mockPyodideModule);

      const instance = get(pyodideInstance);
      if (instance) {
        // TypeScript should know this is PyodideModule
        expect(typeof instance.runPythonAsync).toBe('function');
      }
    });

    it('should maintain type safety in subscribers', () => {
      const mockSubscriber = vi.fn((instance: PyodideModule | null) => {
        if (instance) {
          // Should be able to access PyodideModule methods
          expect(instance).toHaveProperty('runPythonAsync');
          expect(instance).toHaveProperty('globals');
        }
      });

      const unsubscribe = pyodideInstance.subscribe(mockSubscriber);

      pyodideInstance.set(mockPyodideModule);
      pyodideInstance.set(null);

      expect(mockSubscriber).toHaveBeenCalledTimes(3); // initial + 2 changes

      unsubscribe();
    });
  });

  describe('Practical usage scenarios', () => {
    it('should support initialization flow', () => {
      // Initially not loaded
      expect(get(pyodideInstance)).toBeNull();

      // After setup
      pyodideInstance.set(mockPyodideModule);
      const instance = get(pyodideInstance);
      expect(instance).toBeTruthy();
      expect(instance?.runPythonAsync).toBeDefined();
    });

    it('should support cleanup flow', () => {
      // Set up instance
      pyodideInstance.set(mockPyodideModule);
      expect(get(pyodideInstance)).not.toBeNull();

      // Clean up
      pyodideInstance.set(null);
      expect(get(pyodideInstance)).toBeNull();
    });

    it('should support conditional execution based on availability', async () => {
      const executeIfAvailable = (code: string) => {
        const instance = get(pyodideInstance);
        if (instance) {
          return instance.runPythonAsync(code);
        }
        return Promise.reject(new Error('Pyodide not available'));
      };

      // Should reject when not available
      await expect(executeIfAvailable('print("hello")')).rejects.toThrow('Pyodide not available');

      // Should work when available
      pyodideInstance.set(mockPyodideModule);
      mockPyodideModule.runPythonAsync = vi.fn().mockResolvedValue('result');

      const result = await executeIfAvailable('print("hello")');
      expect(result).toBe('result');
      expect(mockPyodideModule.runPythonAsync).toHaveBeenCalledWith('print("hello")');
    });
  });
});
