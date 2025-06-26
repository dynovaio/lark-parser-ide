import { getContext, hasContext, setContext } from 'svelte';
import { createIdeState } from '$lib/stores/Ide';

export type IdeStateContext = ReturnType<typeof createIdeState>;

const contextKey = Symbol('lark-ide-state');

export function setIdeContext(value: IdeStateContext) {
  setContext(contextKey, value);
}

export function getIdeContext(): IdeStateContext {
  if (hasContext(contextKey)) {
    return getContext(contextKey);
  }

  return {} as IdeStateContext;
}
