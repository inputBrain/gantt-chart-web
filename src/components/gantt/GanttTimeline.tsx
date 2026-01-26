'use client';

import { useMemo } from 'react';
import { useGantt } from '@/context/GanttContext';
import { getTimelineConfig, isWeekend, isToday, getDaysInMonth, getTaskPosition } from '@/utils/dateUtils';
import { GanttTaskBar } from './GanttTaskBar';
import { GanttDependencyArrows } from './GanttDependencyArrows';

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 60;

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
    <div className="relative flex-1 overflow-auto bg-white dark:bg-zinc-900">
      <div
        className="relative"
        style={{ width: config.totalWidth, minHeight: timelineHeight + HEADER_HEIGHT }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
          style={{ height: HEADER_HEIGHT }}
        >
          <div className="flex h-full">
            {state.viewMode === 'month' ? (
              config.columns.map((col, idx) => {
                const weekend = isWeekend(col.date);
                const today = isToday(col.date);
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-700 ${
                      weekend ? 'bg-zinc-100 dark:bg-zinc-800/50' : ''
                    } ${today ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    style={{ width: config.pixelsPerDay, minWidth: config.pixelsPerDay }}
                  >
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][col.date.getDay()]}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        today
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
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
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center border-r border-zinc-200 dark:border-zinc-700"
                    style={{ width: monthWidth, minWidth: monthWidth }}
                  >
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
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
                      className={`absolute top-0 border-r border-zinc-100 dark:border-zinc-800 ${
                        weekend ? 'bg-zinc-50/50 dark:bg-zinc-800/30' : ''
                      } ${today ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                      style={{
                        left: idx * config.pixelsPerDay,
                        width: config.pixelsPerDay,
                        height: timelineHeight,
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
                      className="absolute top-0 border-r border-zinc-200 dark:border-zinc-700"
                      style={{
                        left: offset,
                        width: daysInMonth * config.pixelsPerDay,
                        height: timelineHeight,
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
                className="absolute left-0 right-0 border-b border-zinc-100 dark:border-zinc-800"
                style={{ top: (idx + 1) * ROW_HEIGHT }}
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
