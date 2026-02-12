'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'yellow' | 'blue' | 'green' | 'neutral' | 'teams-dark' | 'teams-contrast';

export const THEMES: { id: Theme; name: string; color: string }[] = [
  { id: 'yellow', name: 'Yellow', color: '#f0b90b' },
  { id: 'blue', name: 'Blue', color: '#2563eb' },
  { id: 'green', name: 'Green', color: '#00c805' },
  { id: 'neutral', name: 'Neutral', color: '#171717' },
];

// Teams-specific themes (not shown in settings, auto-applied)
export const TEAMS_THEMES: { id: Theme; name: string }[] = [
  { id: 'teams-dark', name: 'Teams Dark' },
  { id: 'teams-contrast', name: 'Teams High Contrast' },
];

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
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved && THEMES.some(t => t.id === saved)) {
      setThemeState(saved);
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

    // Only save to localStorage if not a Teams theme
    if (!isTeamsTheme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted, isTeamsTheme]);

  const setTheme = (newTheme: Theme) => {
    setIsTeamsTheme(false);
    setThemeState(newTheme);
  };

  const setTeamsTheme = (teamsTheme: 'default' | 'dark' | 'contrast') => {
    setIsTeamsTheme(true);

    switch (teamsTheme) {
      case 'dark':
        setThemeState('teams-dark');
        break;
      case 'contrast':
        setThemeState('teams-contrast');
        break;
      default:
        // For Teams default/light theme, use user's saved preference
        setIsTeamsTheme(false);
        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved && THEMES.some(t => t.id === saved)) {
          setThemeState(saved);
        } else {
          setThemeState('yellow');
        }
        break;
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
