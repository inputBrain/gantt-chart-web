'use client';

import { useGantt } from '@/context/GanttContext';
import { useTheme, THEMES } from '@/context/ThemeContext';
import { getHeaderLabel } from '@/utils/dateUtils';
import { ViewMode } from '@/types/gantt';

export function GanttHeader() {
  const { state, setViewMode, navigate, goToToday } = useGantt();
  const { theme, setTheme } = useTheme();

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="flex items-center justify-between border-b border-border-primary bg-bg-primary px-6 py-3">
      {/* Left: Logo & View Mode */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <svg className="h-4 w-4 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-base font-bold text-text-primary">Gantt</h1>
        </div>

        <div className="flex items-center rounded-lg bg-bg-tertiary p-1">
          <button
            onClick={() => handleViewModeChange('month')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              state.viewMode === 'month'
                ? 'bg-bg-primary text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleViewModeChange('year')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              state.viewMode === 'year'
                ? 'bg-bg-primary text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Center: Today + Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={goToToday}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover"
        >
          Today
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('prev')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex min-w-[150px] items-center justify-center rounded-lg border border-border-primary bg-bg-primary px-4 py-2">
            <span className="text-sm font-semibold tabular-nums text-text-primary">
              {getHeaderLabel(state.currentDate, state.viewMode)}
            </span>
          </div>

          <button
            onClick={() => navigate('next')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right: Theme Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-tertiary">Theme</span>
        <div className="flex items-center gap-1 rounded-lg bg-bg-tertiary p-1">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`h-6 w-6 rounded-md ${
                theme === t.id ? 'ring-2 ring-text-tertiary ring-offset-1' : ''
              }`}
              style={{ backgroundColor: t.color }}
              title={t.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
