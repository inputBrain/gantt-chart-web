'use client';

import { useGantt } from '@/context/GanttContext';
import { getHeaderLabel } from '@/utils/dateUtils';
import { ViewMode } from '@/types/gantt';

export function GanttHeader() {
  const { state, setViewMode, navigate, goToToday } = useGantt();

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="flex h-12 items-center justify-center space-x-10 mt-16  border-b border-border-primary bg-bg-primary px-4">
      {/* Left: View Mode with underline */}
      <div className="flex items-center">
        <button
          onClick={() => handleViewModeChange('month')}
          className={`relative px-3 py-3 text-xs font-medium transition-colors ${
            state.viewMode === 'month'
              ? 'text-accent'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          Month
          {state.viewMode === 'month' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
        <button
          onClick={() => handleViewModeChange('year')}
          className={`relative px-3 py-3 text-xs font-medium transition-colors ${
            state.viewMode === 'year'
              ? 'text-accent'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          Year
          {state.viewMode === 'year' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
      </div>

      {/* Center: Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('prev')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="min-w-[150px] text-center text-sm font-semibold tabular-nums text-text-primary">
          {getHeaderLabel(state.currentDate, state.viewMode)}
        </span>
        <button
          onClick={() => navigate('next')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Right: Today button */}
      <button
        onClick={goToToday}
        className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover"
      >
        Today
      </button>
    </div>
  );
}
