import { derived, writable } from 'svelte/store';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

const theme = writable(Theme.Dark);

export const isDarkMode = derived(theme, ($theme) => {
  return $theme === Theme.Dark;
});

export const setTheme = (newTheme: Theme) => {
  theme.set(newTheme);

  document.documentElement.classList.toggle('dark', newTheme === Theme.Dark);
  localStorage.setItem('theme', newTheme);
};
