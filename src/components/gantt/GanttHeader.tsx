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
    <div className="flex items-center justify-between border-b px-6 py-3" style={{ background: '#1e2329', borderColor: '#2b3139' }}>
      {/* Left: Logo & View Mode */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: '#f0b90b' }}>
            <svg className="h-4 w-4" style={{ color: '#0b0e11' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-base font-bold" style={{ color: '#eaecef' }}>Gantt</h1>
        </div>

        <div className="flex items-center rounded-md p-0.5" style={{ background: '#2b3139' }}>
          <button
            onClick={() => handleViewModeChange('month')}
            className={`rounded px-3 py-1.5 text-xs font-semibold ${
              state.viewMode === 'month'
                ? ''
                : ''
            }`}
            style={state.viewMode === 'month'
              ? { background: '#363c45', color: '#eaecef' }
              : { color: '#848e9c' }
            }
          >
            Month
          </button>
          <button
            onClick={() => handleViewModeChange('year')}
            className={`rounded px-3 py-1.5 text-xs font-semibold`}
            style={state.viewMode === 'year'
              ? { background: '#363c45', color: '#eaecef' }
              : { color: '#848e9c' }
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
          style={{ background: '#f0b90b', color: '#0b0e11' }}
        >
          Today
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('prev')}
            className="flex h-8 w-8 items-center justify-center rounded border"
            style={{ borderColor: '#2b3139', background: '#1e2329', color: '#848e9c' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex min-w-[150px] items-center justify-center rounded border px-4 py-1.5" style={{ borderColor: '#2b3139', background: '#181a20' }}>
            <span className="text-sm font-semibold tabular-nums" style={{ color: '#eaecef' }}>
              {getHeaderLabel(state.currentDate, state.viewMode)}
            </span>
          </div>

          <button
            onClick={() => navigate('next')}
            className="flex h-8 w-8 items-center justify-center rounded border"
            style={{ borderColor: '#2b3139', background: '#1e2329', color: '#848e9c' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right: empty for balance */}
      <div className="w-[180px]" />
    </div>
  );
}
