import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';

export type QueryKey = string;

export type BreakpointQueries = {
  [key: QueryKey]: string;
};

export type Breakpoint = Readable<boolean>;

export const DEFAULT_BREAKPOINTS: BreakpointQueries = {
  sm: '(min-width: 40rem)', // 640px
  md: '(min-width: 48rem)', // 768px
  lg: '(min-width: 64rem)', // 1024px
  xl: '(min-width: 80rem)', // 1280px
  xxl: '(min-width: 96rem)' // 1536px
} as const;

export const useBreakpoint = (query: string, defaultState = false): Breakpoint => {
  if (typeof window === 'undefined' || !query) {
    return readable(defaultState);
  }

  return readable(defaultState, (set) => {
    const mediaQuery = window.matchMedia(query);

    set(mediaQuery.matches);

    const listener = (e: { matches: boolean }) => {
      set(e.matches);
    };
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  });
};

export const isSmallScreen = useBreakpoint(DEFAULT_BREAKPOINTS.sm);
export const isMediumScreen = useBreakpoint(DEFAULT_BREAKPOINTS.md);
export const isLargeScreen = useBreakpoint(DEFAULT_BREAKPOINTS.lg);
export const isExtraLargeScreen = useBreakpoint(DEFAULT_BREAKPOINTS.xl);
export const isXXLargeScreen = useBreakpoint(DEFAULT_BREAKPOINTS['xxl']);
