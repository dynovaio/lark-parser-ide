import { writable } from 'svelte/store';

export const isLoading = writable(true);
export const loadingMessage = writable('Loading...');
export const loadingProgress = writable(0);
