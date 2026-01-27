'use client';

import { useMemo } from 'react';
import { useGantt } from '@/context/GanttContext';
import { getTimelineConfig, isWeekend, isToday, getDaysInMonth, getTaskPosition } from '@/utils/dateUtils';
import { GanttTaskBar } from './GanttTaskBar';
import { GanttDependencyArrows } from './GanttDependencyArrows';

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 52;

export function GanttTimeline() {
  const { state } = useGantt();
  const config = useMemo(
    () => getTimelineConfig(state.currentDate, state.viewMode),
    [state.currentDate, state.viewMode]
  );

  const taskPositions = useMemo(() => {
    return state.tasks.map((task, index) => ({
      task,
      position: getTaskPosition(task, config, index, ROW_HEIGHT),
    }));
  }, [state.tasks, config]);

  const timelineHeight = Math.max(state.tasks.length * ROW_HEIGHT, 400);

  return (
    <div className="relative flex-1 overflow-auto rounded-lg border" style={{ background: '#0b0e11', borderColor: '#2b3139' }}>
      <div
        className="relative"
        style={{ width: config.totalWidth, minHeight: timelineHeight + HEADER_HEIGHT }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-20 border-b"
          style={{ height: HEADER_HEIGHT, background: '#1e2329', borderColor: '#2b3139' }}
        >
          <div className="flex h-full">
            {state.viewMode === 'month' ? (
              config.columns.map((col, idx) => {
                const weekend = isWeekend(col.date);
                const today = isToday(col.date);
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center border-r"
                    style={{
                      width: config.pixelsPerDay,
                      minWidth: config.pixelsPerDay,
                      borderColor: '#2b3139',
                      background: today ? 'rgba(240, 185, 11, 0.08)' : weekend ? '#181a20' : undefined,
                    }}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{
                      color: today ? '#f0b90b' : '#5e6673'
                    }}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][col.date.getDay()]}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        today
                          ? 'flex h-6 w-6 items-center justify-center rounded-full'
                          : ''
                      }`}
                      style={today
                        ? { background: '#f0b90b', color: '#0b0e11' }
                        : { color: '#eaecef' }
                      }
                    >
                      {col.label}
                    </span>
                  </div>
                );
              })
            ) : (
              config.columns.map((col, idx) => {
                const daysInMonth = getDaysInMonth(col.date);
                const monthWidth = daysInMonth * config.pixelsPerDay;
                const isCurrentMonth = col.date.getMonth() === new Date().getMonth() && col.date.getFullYear() === new Date().getFullYear();
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center border-r"
                    style={{
                      width: monthWidth,
                      minWidth: monthWidth,
                      borderColor: '#2b3139',
                      background: isCurrentMonth ? 'rgba(240, 185, 11, 0.06)' : undefined,
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: isCurrentMonth ? '#f0b90b' : '#eaecef' }}>
                      {col.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="absolute left-0 right-0" style={{ top: HEADER_HEIGHT }}>
          {/* Vertical grid lines */}
          <div className="pointer-events-none absolute inset-0">
            {state.viewMode === 'month'
              ? config.columns.map((col, idx) => {
                  const weekend = isWeekend(col.date);
                  const today = isToday(col.date);
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 border-r"
                      style={{
                        left: idx * config.pixelsPerDay,
                        width: config.pixelsPerDay,
                        height: timelineHeight,
                        borderColor: '#181a20',
                        background: today ? 'rgba(240, 185, 11, 0.04)' : weekend ? 'rgba(24, 26, 32, 0.5)' : undefined,
                      }}
                    />
                  );
                })
              : config.columns.map((col, idx) => {
                  const daysInMonth = getDaysInMonth(col.date);
                  let offset = 0;
                  for (let i = 0; i < idx; i++) {
                    offset += getDaysInMonth(config.columns[i].date) * config.pixelsPerDay;
                  }
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 border-r"
                      style={{
                        left: offset,
                        width: daysInMonth * config.pixelsPerDay,
                        height: timelineHeight,
                        borderColor: '#2b3139',
                      }}
                    />
                  );
                })}
          </div>

          {/* Horizontal row lines */}
          <div className="pointer-events-none absolute inset-0">
            {state.tasks.map((_, idx) => (
              <div
                key={idx}
                className="absolute left-0 right-0 border-b"
                style={{ top: (idx + 1) * ROW_HEIGHT, borderColor: '#181a20' }}
              />
            ))}
          </div>

          {/* Dependency arrows */}
          <GanttDependencyArrows
            tasks={state.tasks}
            config={config}
            rowHeight={ROW_HEIGHT}
            timelineHeight={timelineHeight}
          />

          {/* Task bars */}
          {taskPositions.map(({ task, position }) => (
            <GanttTaskBar key={task.id} task={task} position={position} config={config} />
          ))}
        </div>
      </div>
    </div>
  );
}
