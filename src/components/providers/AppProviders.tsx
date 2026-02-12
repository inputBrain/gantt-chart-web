'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { GanttProvider } from '@/context/GanttContext';
import { TeamsProvider, useTeams } from '@/context/TeamsContext';
import { Header } from '@/components/layout';

/**
 * Bridge component that connects Teams theme to our theme system
 */
function TeamsThemeBridge({ children }: { children: ReactNode }) {
  const { theme: teamsTheme, isInTeams } = useTeams();
  const { setTeamsTheme } = useTheme();

  useEffect(() => {
    if (isInTeams) {
      setTeamsTheme(teamsTheme);
    }
  }, [teamsTheme, isInTeams, setTeamsTheme]);

  return <>{children}</>;
}

/**
 * Conditional header - hidden when running in Teams (Teams has its own chrome)
 */
function ConditionalHeader() {
  const { isInTeams } = useTeams();

  // In Teams, we might want to hide the header or show a simplified version
  // For now, we show it but it could be customized
  if (isInTeams) {
    return null; // Hide header in Teams - Teams provides its own navigation
  }

  return <Header />;
}

/**
 * Main app providers wrapper
 * Combines all providers in the correct order
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TeamsProvider>
        <TeamsThemeBridge>
          <GanttProvider>
            <ConditionalHeader />
            {children}
          </GanttProvider>
        </TeamsThemeBridge>
      </TeamsProvider>
    </ThemeProvider>
  );
}
