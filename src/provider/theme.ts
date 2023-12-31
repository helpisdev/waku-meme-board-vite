import { atom } from 'nanostores';

import type { Theme } from '../types/type';

export const themeStore = atom<Theme | null>(null);

export function toggleTheme(theme?: Theme | undefined): void {
  const currentTheme = themeStore.get();
  const root = document.getElementById('html');

  if (!theme) {
    // eslint-disable-next-line no-param-reassign
    theme = currentTheme === 'light' ? 'dark' : 'light';
  }

  themeStore.set(theme);

  if (root) {
    const hasTheme = root.classList.contains(theme);

    if (theme === 'light') {
      root.classList.remove('dark');
    } else if (!hasTheme) {
      root.classList.add('dark');
    }
  }
}

export function setupTheme(): void {
  const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
  const preferredTheme = darkModePreference.matches ? 'dark' : 'light';

  toggleTheme(preferredTheme);

  darkModePreference.addEventListener('change', (e) => {
    toggleTheme(e.matches ? 'dark' : 'light');
  });
}
