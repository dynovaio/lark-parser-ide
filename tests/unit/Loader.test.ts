import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { isLoading, loadingMessage, loadingProgress } from '@/lib/stores/Loader';

describe('Loader stores', () => {
  beforeEach(() => {
    // Reset stores to their initial values
    isLoading.set(true);
    loadingMessage.set('Loading...');
    loadingProgress.set(0);
  });

  describe('isLoading store', () => {
    it('should have initial value of true', () => {
      expect(get(isLoading)).toBe(true);
    });

    it('should update when set to false', () => {
      isLoading.set(false);
      expect(get(isLoading)).toBe(false);
    });

    it('should update when set to true', () => {
      isLoading.set(false);
      isLoading.set(true);
      expect(get(isLoading)).toBe(true);
    });

    it('should notify subscribers on changes', () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = isLoading.subscribe(mockSubscriber);

      isLoading.set(false);
      isLoading.set(true);

      expect(mockSubscriber).toHaveBeenCalledWith(true); // initial
      expect(mockSubscriber).toHaveBeenCalledWith(false); // first change
      expect(mockSubscriber).toHaveBeenCalledWith(true); // second change

      unsubscribe();
    });
  });

  describe('loadingMessage store', () => {
    it('should have initial value of "Loading..."', () => {
      expect(get(loadingMessage)).toBe('Loading...');
    });

    it('should update with new messages', () => {
      loadingMessage.set('Initializing...');
      expect(get(loadingMessage)).toBe('Initializing...');

      loadingMessage.set('Setting up environment...');
      expect(get(loadingMessage)).toBe('Setting up environment...');
    });

    it('should handle empty string', () => {
      loadingMessage.set('');
      expect(get(loadingMessage)).toBe('');
    });

    it('should handle special characters and unicode', () => {
      const specialMessage = 'Loading... 🚀 50% complete!';
      loadingMessage.set(specialMessage);
      expect(get(loadingMessage)).toBe(specialMessage);
    });

    it('should notify subscribers on changes', () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = loadingMessage.subscribe(mockSubscriber);

      loadingMessage.set('New message');
      loadingMessage.set('Another message');

      expect(mockSubscriber).toHaveBeenCalledWith('Loading...'); // initial
      expect(mockSubscriber).toHaveBeenCalledWith('New message'); // first change
      expect(mockSubscriber).toHaveBeenCalledWith('Another message'); // second change

      unsubscribe();
    });
  });

  describe('loadingProgress store', () => {
    it('should have initial value of 0', () => {
      expect(get(loadingProgress)).toBe(0);
    });

    it('should update with progress values', () => {
      loadingProgress.set(25);
      expect(get(loadingProgress)).toBe(25);

      loadingProgress.set(50);
      expect(get(loadingProgress)).toBe(50);

      loadingProgress.set(100);
      expect(get(loadingProgress)).toBe(100);
    });

    it('should handle decimal values', () => {
      loadingProgress.set(33.33);
      expect(get(loadingProgress)).toBe(33.33);
    });

    it('should handle edge cases', () => {
      loadingProgress.set(0);
      expect(get(loadingProgress)).toBe(0);

      loadingProgress.set(100);
      expect(get(loadingProgress)).toBe(100);

      loadingProgress.set(-1);
      expect(get(loadingProgress)).toBe(-1);

      loadingProgress.set(101);
      expect(get(loadingProgress)).toBe(101);
    });

    it('should notify subscribers on changes', () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = loadingProgress.subscribe(mockSubscriber);

      loadingProgress.set(25);
      loadingProgress.set(75);
      loadingProgress.set(100);

      expect(mockSubscriber).toHaveBeenCalledWith(0); // initial
      expect(mockSubscriber).toHaveBeenCalledWith(25); // first change
      expect(mockSubscriber).toHaveBeenCalledWith(75); // second change
      expect(mockSubscriber).toHaveBeenCalledWith(100); // third change

      unsubscribe();
    });
  });

  describe('Store independence', () => {
    it('should allow independent updates of each store', () => {
      isLoading.set(false);
      loadingMessage.set('Custom message');
      loadingProgress.set(75);

      expect(get(isLoading)).toBe(false);
      expect(get(loadingMessage)).toBe('Custom message');
      expect(get(loadingProgress)).toBe(75);
    });

    it('should not affect other stores when one is updated', () => {
      const initialMessage = get(loadingMessage);
      const initialProgress = get(loadingProgress);

      isLoading.set(false);

      expect(get(loadingMessage)).toBe(initialMessage);
      expect(get(loadingProgress)).toBe(initialProgress);
    });
  });

  describe('Typical loading flow', () => {
    it('should support a complete loading sequence', () => {
      // Start loading
      isLoading.set(true);
      loadingMessage.set('Initializing...');
      loadingProgress.set(0);

      expect(get(isLoading)).toBe(true);
      expect(get(loadingMessage)).toBe('Initializing...');
      expect(get(loadingProgress)).toBe(0);

      // Progress updates
      loadingMessage.set('Loading resources...');
      loadingProgress.set(25);

      expect(get(loadingMessage)).toBe('Loading resources...');
      expect(get(loadingProgress)).toBe(25);

      loadingMessage.set('Processing...');
      loadingProgress.set(75);

      expect(get(loadingMessage)).toBe('Processing...');
      expect(get(loadingProgress)).toBe(75);

      // Complete loading
      loadingMessage.set('Complete!');
      loadingProgress.set(100);
      isLoading.set(false);

      expect(get(isLoading)).toBe(false);
      expect(get(loadingMessage)).toBe('Complete!');
      expect(get(loadingProgress)).toBe(100);
    });
  });
});
