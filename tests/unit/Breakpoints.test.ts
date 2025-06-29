import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_BREAKPOINTS,
  useBreakpoint,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  isExtraLargeScreen,
  isXXLargeScreen
} from '../../src/lib/stores/Breakpoints';

describe('Breakpoints store', () => {
  const mockMatchMedia = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup matchMedia mock for this test
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('DEFAULT_BREAKPOINTS', () => {
    it('should have correct breakpoint queries', () => {
      expect(DEFAULT_BREAKPOINTS).toEqual({
        sm: '(min-width: 40rem)',
        md: '(min-width: 48rem)',
        lg: '(min-width: 64rem)',
        xl: '(min-width: 80rem)',
        xxl: '(min-width: 96rem)'
      });
    });
  });

  describe('useBreakpoint', () => {
    let mockMediaQuery: Partial<MediaQueryList> & {
      matches: boolean;
      addEventListener: ReturnType<typeof vi.fn>;
      removeEventListener: ReturnType<typeof vi.fn>;
    };
    let mockSubscriber: (value: boolean) => void;

    beforeEach(() => {
      mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMediaQuery);
      mockSubscriber = vi.fn();
    });

    it('should return default state when window is undefined', () => {
      const originalWindow = global.window;
      delete (global as unknown as { window?: Window }).window;

      const breakpoint = useBreakpoint('(min-width: 768px)', true);
      const unsubscribe = breakpoint.subscribe(mockSubscriber);

      expect(mockSubscriber).toHaveBeenCalledWith(true);

      unsubscribe();
      global.window = originalWindow;
    });

    it('should return default state when query is empty', () => {
      const breakpoint = useBreakpoint('', false);
      const unsubscribe = breakpoint.subscribe(mockSubscriber);

      expect(mockSubscriber).toHaveBeenCalledWith(false);
      expect(mockMatchMedia).not.toHaveBeenCalled();

      unsubscribe();
    });

    it('should create media query and set initial value', () => {
      mockMediaQuery.matches = true;

      const breakpoint = useBreakpoint('(min-width: 768px)', false);
      const unsubscribe = breakpoint.subscribe(mockSubscriber);

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
      expect(mockSubscriber).toHaveBeenCalledWith(true);

      unsubscribe();
    });

    it('should add event listener for media query changes', () => {
      const breakpoint = useBreakpoint('(min-width: 768px)', false);
      const unsubscribe = breakpoint.subscribe(mockSubscriber);

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      unsubscribe();
    });

    it('should update value when media query changes', () => {
      mockMediaQuery.matches = false;

      const breakpoint = useBreakpoint('(min-width: 768px)', false);
      const unsubscribe = breakpoint.subscribe(mockSubscriber);

      // Get the change listener
      const changeListener = mockMediaQuery.addEventListener.mock.calls[0][1];

      // Simulate media query change
      changeListener({ matches: true });

      expect(mockSubscriber).toHaveBeenCalledWith(false); // initial
      expect(mockSubscriber).toHaveBeenCalledWith(true); // after change

      unsubscribe();
    });

    it('should remove event listener on unsubscribe', () => {
      const breakpoint = useBreakpoint('(min-width: 768px)', false);
      const unsubscribe = breakpoint.subscribe(mockSubscriber);

      const changeListener = mockMediaQuery.addEventListener.mock.calls[0][1];

      unsubscribe();

      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', changeListener);
    });

    it('should handle multiple subscribers', () => {
      const mockSubscriber2 = vi.fn();

      const breakpoint = useBreakpoint('(min-width: 768px)', false);
      const unsubscribe1 = breakpoint.subscribe(mockSubscriber);
      const unsubscribe2 = breakpoint.subscribe(mockSubscriber2);

      expect(mockSubscriber).toHaveBeenCalled();
      expect(mockSubscriber2).toHaveBeenCalled();

      unsubscribe1();
      unsubscribe2();
    });

    it('should use default state as initial value', () => {
      mockMediaQuery.matches = true;

      const breakpoint = useBreakpoint('(min-width: 768px)', false);
      const unsubscribe = breakpoint.subscribe(mockSubscriber);

      // Should use actual media query value, not default
      expect(mockSubscriber).toHaveBeenCalledWith(true);

      unsubscribe();
    });
  });

  describe('Predefined breakpoints', () => {
    beforeEach(() => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMediaQuery);
    });

    it('should create isSmallScreen with correct query', () => {
      const unsubscribe = isSmallScreen.subscribe(vi.fn());

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 40rem)');

      unsubscribe();
    });

    it('should create isMediumScreen with correct query', () => {
      const unsubscribe = isMediumScreen.subscribe(vi.fn());

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 48rem)');

      unsubscribe();
    });

    it('should create isLargeScreen with correct query', () => {
      const unsubscribe = isLargeScreen.subscribe(vi.fn());

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 64rem)');

      unsubscribe();
    });

    it('should create isExtraLargeScreen with correct query', () => {
      const unsubscribe = isExtraLargeScreen.subscribe(vi.fn());

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 80rem)');

      unsubscribe();
    });

    it('should create isXXLargeScreen with correct query', () => {
      const unsubscribe = isXXLargeScreen.subscribe(vi.fn());

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 96rem)');

      unsubscribe();
    });
  });
});
