import { writable } from 'svelte/store';
import type { PyodideModule } from '$lib/utils/Pyodide';

export const pyodideInstance = writable<PyodideModule | null>(null);
