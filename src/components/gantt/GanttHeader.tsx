'use client';

import { useGantt } from '@/context/GanttContext';
import { useTheme } from '@/context/ThemeContext';
import { getHeaderLabel } from '@/utils/dateUtils';
import { ViewMode } from '@/types/gantt';

export function GanttHeader() {
  const { state, setViewMode, navigate, goToToday } = useGantt();
  const { theme, toggleTheme } = useTheme();

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div
      className="flex items-center justify-between border-b px-6 py-3"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {/* Left: Logo & View Mode */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--accent)' }}>
            <svg className="h-4 w-4" style={{ color: 'var(--bg-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Gantt</h1>
        </div>

        <div className="flex items-center rounded-md p-0.5" style={{ background: 'var(--bg-surface-hover)' }}>
          <button
            onClick={() => handleViewModeChange('month')}
            className="rounded px-3 py-1.5 text-xs font-semibold"
            style={state.viewMode === 'month'
              ? { background: 'var(--tab-active-bg)', color: 'var(--text-primary)' }
              : { color: 'var(--text-secondary)' }
            }
          >
            Month
          </button>
          <button
            onClick={() => handleViewModeChange('year')}
            className="rounded px-3 py-1.5 text-xs font-semibold"
            style={state.viewMode === 'year'
              ? { background: 'var(--tab-active-bg)', color: 'var(--text-primary)' }
              : { color: 'var(--text-secondary)' }
            }
          >
            Year
          </button>
        </div>
      </div>

      {/* Center: Today + Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={goToToday}
          className="rounded px-3 py-1.5 text-xs font-semibold"
          style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          Today
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('prev')}
            className="flex h-8 w-8 items-center justify-center rounded border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex min-w-[150px] items-center justify-center rounded border px-4 py-1.5" style={{ borderColor: 'var(--border)', background: 'var(--bg-input)' }}>
            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {getHeaderLabel(state.currentDate, state.viewMode)}
            </span>
          </div>

          <button
            onClick={() => navigate('next')}
            className="flex h-8 w-8 items-center justify-center rounded border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right: Theme toggle */}
      <div className="flex w-[180px] justify-end">
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded border"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
