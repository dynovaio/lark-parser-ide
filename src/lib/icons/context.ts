import { getContext, hasContext, setContext } from 'svelte';
import type { IconContextProps } from './shared.js';

const contextKey = Symbol('phosphor-svelte');

export function setIconContext(value: IconContextProps['values']) {
  setContext(contextKey, value);
}

export function getIconContext(): IconContextProps['values'] {
  if (hasContext(contextKey)) {
    return getContext(contextKey);
  }

  return {};
}
