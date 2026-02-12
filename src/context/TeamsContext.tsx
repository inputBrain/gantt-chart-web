'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  TeamsContext as TeamsContextType,
  defaultTeamsContext,
  initializeTeams,
  registerTeamsThemeHandler,
  notifyTeamsAppLoaded,
  getTeamsAuthToken,
} from '@/lib/teams';

interface TeamsContextValue extends TeamsContextType {
  getAuthToken: () => Promise<string | null>;
}

const TeamsContext = createContext<TeamsContextValue>({
  ...defaultTeamsContext,
  getAuthToken: async () => null,
});

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<TeamsContextType>(defaultTeamsContext);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const teamsContext = await initializeTeams();

      if (mounted) {
        setContext(teamsContext);

        if (teamsContext.isInTeams) {
          // Register for theme changes
          registerTeamsThemeHandler((theme) => {
            setContext((prev) => ({ ...prev, theme }));
          });

          // Notify Teams that we're ready
          notifyTeamsAppLoaded();
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const getAuthToken = useCallback(async () => {
    if (!context.isInTeams) return null;
    return getTeamsAuthToken();
  }, [context.isInTeams]);

  const value: TeamsContextValue = {
    ...context,
    getAuthToken,
  };

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

export function useTeams() {
  return useContext(TeamsContext);
}

/**
 * Hook to check if app is running in Teams
 */
export function useIsInTeams(): boolean {
  const { isInTeams } = useTeams();
  return isInTeams;
}

/**
 * Hook to get Teams theme
 */
export function useTeamsTheme(): 'default' | 'dark' | 'contrast' {
  const { theme } = useTeams();
  return theme;
}
