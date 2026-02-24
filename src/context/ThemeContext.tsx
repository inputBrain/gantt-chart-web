'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

export type Theme =
  | 'yellow'
  | 'blue'
  | 'green'
  | 'neutral'
  | 'dark-purple'
  | 'dark-blue'
  | 'teams-dark'
  | 'teams-contrast';

export const THEMES: { id: Theme; name: string; color: string }[] = [
  { id: 'yellow',      name: 'Yellow',      color: '#f0b90b' },
  { id: 'blue',        name: 'Blue',        color: '#2563eb' },
  { id: 'green',       name: 'Green',       color: '#00c805' },
  { id: 'neutral',     name: 'Neutral',     color: '#171717' },
  { id: 'dark-purple', name: 'Dark Purple', color: '#7c4dff' },
  { id: 'dark-blue',   name: 'Dark Blue',   color: '#3b82f6' },
];

// Teams-specific themes (not shown in settings, auto-applied)
export const TEAMS_THEMES: { id: Theme; name: string }[] = [
  { id: 'teams-dark',     name: 'Teams Dark' },
  { id: 'teams-contrast', name: 'Teams High Contrast' },
];

const USER_THEMES = new Set<Theme>(THEMES.map((t) => t.id));

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isTeamsTheme: boolean;
  setTeamsTheme: (teamsTheme: 'default' | 'dark' | 'contrast') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('yellow');
  const [isTeamsTheme, setIsTeamsTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let saved = storageGet<string>(STORAGE_KEYS.theme);

    // Migrate old misspelled key that was persisted before the fix
    if (saved === 'dark-purpule') {
      saved = 'dark-purple';
      storageSet(STORAGE_KEYS.theme, 'dark-purple');
    }

    if (saved && USER_THEMES.has(saved as Theme)) {
      setThemeState(saved as Theme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (theme === 'yellow') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    if (!isTeamsTheme) {
      storageSet(STORAGE_KEYS.theme, theme);
    }
  }, [theme, mounted, isTeamsTheme]);

  const setTheme = (newTheme: Theme) => {
    setIsTeamsTheme(false);
    setThemeState(newTheme);
  };

  const setTeamsTheme = (teamsTheme: 'default' | 'dark' | 'contrast') => {
    switch (teamsTheme) {
      case 'dark': {
        setIsTeamsTheme(true);
        setThemeState('teams-dark');
        break;
      }
      case 'contrast': {
        setIsTeamsTheme(true);
        setThemeState('teams-contrast');
        break;
      }
      default: {
        // For Teams default/light theme, restore the user's saved preference
        setIsTeamsTheme(false);
        const saved = storageGet<Theme>(STORAGE_KEYS.theme);
        setThemeState(saved && USER_THEMES.has(saved) ? saved : 'yellow');
        break;
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isTeamsTheme, setTeamsTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
