'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
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
          <ProjectsProvider>
            <ConditionalHeader />
            {children}
          </ProjectsProvider>
        </TeamsThemeBridge>
      </TeamsProvider>
    </ThemeProvider>
  );
}
