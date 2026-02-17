'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeName = 'warm-light' | 'premium-dark' | 'graphite-dark';

export interface ThemeOption {
  id: ThemeName;
  label: string;
  description: string;
}

const THEME_STORAGE_KEY = 'acep_theme';

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'warm-light',
    label: 'Warm Light',
    description: 'Soft daylight workspace with warm accents.'
  },
  {
    id: 'premium-dark',
    label: 'Premium Dark',
    description: 'High-contrast AI console with neon highlights.'
  },
  {
    id: 'graphite-dark',
    label: 'Graphite Dark',
    description: 'Muted dark theme for long focused sessions.'
  }
];

const isThemeName = (value: string): value is ThemeName => THEME_OPTIONS.some((option) => option.id === value);

const applyTheme = (theme: ThemeName) => {
  document.documentElement.setAttribute('data-theme', theme);
};

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>('warm-light');

  useEffect(() => {
    const fromStorage = localStorage.getItem(THEME_STORAGE_KEY);
    if (fromStorage && isThemeName(fromStorage)) {
      setThemeState(fromStorage);
      applyTheme(fromStorage);
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('premium-dark');
      applyTheme('premium-dark');
      return;
    }

    applyTheme('warm-light');
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      themes: THEME_OPTIONS
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
