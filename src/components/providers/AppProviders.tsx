'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { GanttProvider } from '@/context/GanttContext';
import { TeamsProvider, useTeams } from '@/context/TeamsContext';
import { Header } from '@/components/layout';


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


function ConditionalHeader() {
  const { isInTeams } = useTeams();


  if (isInTeams) {
    return null;
  }

  return <Header />;
}


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
