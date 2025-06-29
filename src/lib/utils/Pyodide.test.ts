import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupPyodide } from './Pyodide';
import type { Writable } from 'svelte/store';

// Mock pyodide module at the top level
vi.mock('pyodide', () => ({
  loadPyodide: vi.fn(),
  version: '0.27.7'
}));

describe('Pyodide utils', () => {
  let mockPyodide: {
    loadPackage: ReturnType<typeof vi.fn>;
    runPythonAsync: ReturnType<typeof vi.fn>;
  };
  let mockMessageStore: Writable<string>;
  let mockProgressStore: Writable<number>;
  let mockLoadPyodide: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock stores
    mockMessageStore = {
      set: vi.fn(),
      update: vi.fn(),
      subscribe: vi.fn()
    } as Writable<string>;
    mockProgressStore = {
      set: vi.fn(),
      update: vi.fn(),
      subscribe: vi.fn()
    } as Writable<number>;

    // Mock pyodide instance
    mockPyodide = {
      loadPackage: vi.fn().mockResolvedValue(undefined),
      runPythonAsync: vi.fn().mockResolvedValue(undefined)
    };

    // Get the mocked loadPyodide function
    const { loadPyodide } = await import('pyodide');
    mockLoadPyodide = loadPyodide as ReturnType<typeof vi.fn>;
    mockLoadPyodide.mockResolvedValue(mockPyodide);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setupPyodide', () => {
    it('should setup pyodide successfully', async () => {
      const result = await setupPyodide(mockMessageStore, mockProgressStore);

      expect(result).toBe(mockPyodide);
    });

    it('should update progress and message correctly', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      // Verify progress updates
      expect(mockProgressStore.set).toHaveBeenCalledWith(0);
      expect(mockProgressStore.set).toHaveBeenCalledWith(25);
      expect(mockProgressStore.set).toHaveBeenCalledWith(50);
      expect(mockProgressStore.set).toHaveBeenCalledWith(75);
      expect(mockProgressStore.set).toHaveBeenCalledWith(100);

      // Verify message updates
      expect(mockMessageStore.set).toHaveBeenCalledWith('Loading Pyodide...');
      expect(mockMessageStore.set).toHaveBeenCalledWith('Installing micropip...');
      expect(mockMessageStore.set).toHaveBeenCalledWith('Installing Lark Parser...');
      expect(mockMessageStore.set).toHaveBeenCalledWith('Setup complete.');
    });

    it('should load pyodide with correct index URL', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      expect(mockLoadPyodide).toHaveBeenCalledWith({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
      });
    });

    it('should load micropip package', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      expect(mockPyodide.loadPackage).toHaveBeenCalledWith('micropip');
    });

    it('should run all required Python scripts', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      expect(mockPyodide.runPythonAsync).toHaveBeenCalledTimes(3);

      // Check the scripts are called
      const calls = mockPyodide.runPythonAsync.mock.calls;

      // First call: Install lark
      expect(calls[0][0]).toContain('import micropip');
      expect(calls[0][0]).toContain("await micropip.install('lark')");

      // Second call: Import lark
      expect(calls[1][0]).toContain('import lark');
      expect(calls[1][0]).toContain('import json');
      expect(calls[1][0]).toContain('import traceback');

      // Third call: Define LarkEncoder
      expect(calls[2][0]).toContain('class LarkEncoder(json.JSONEncoder)');
      expect(calls[2][0]).toContain('lark.Tree');
      expect(calls[2][0]).toContain('lark.Token');
    });

    it('should handle pyodide loading failure', async () => {
      const error = new Error('Failed to load pyodide');
      mockLoadPyodide.mockRejectedValueOnce(error);

      await expect(setupPyodide(mockMessageStore, mockProgressStore)).rejects.toThrow(
        'Failed to load pyodide'
      );
    });

    it('should handle package loading failure', async () => {
      const error = new Error('Failed to load package');
      mockPyodide.loadPackage.mockRejectedValueOnce(error);

      await expect(setupPyodide(mockMessageStore, mockProgressStore)).rejects.toThrow(
        'Failed to load package'
      );
    });

    it('should handle Python script execution failure', async () => {
      const error = new Error('Python execution failed');
      mockPyodide.runPythonAsync.mockRejectedValueOnce(error);

      await expect(setupPyodide(mockMessageStore, mockProgressStore)).rejects.toThrow(
        'Python execution failed'
      );
    });

    it('should set progress to 0 at start', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      // First call should be progress 0
      const setMock = mockProgressStore.set as ReturnType<typeof vi.fn>;
      expect(setMock.mock.calls[0][0]).toBe(0);
    });

    it('should set progress to 100 at end', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      // Last call should be progress 100
      const setMock = mockProgressStore.set as ReturnType<typeof vi.fn>;
      const lastCall = setMock.mock.calls[setMock.mock.calls.length - 1];
      expect(lastCall[0]).toBe(100);
    });

    it('should maintain proper progress order', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      const setMock = mockProgressStore.set as ReturnType<typeof vi.fn>;
      const progressCalls = setMock.mock.calls.map((call: number[]) => call[0]);
      expect(progressCalls).toEqual([0, 25, 50, 75, 100]);
    });

    it('should use correct CDN URL based on version', async () => {
      await setupPyodide(mockMessageStore, mockProgressStore);

      expect(mockLoadPyodide).toHaveBeenCalledWith({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
      });
    });
  });
});
