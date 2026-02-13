'use client';

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useGantt } from '@/context/GanttContext';
import { getTimelineConfig, isWeekend, isToday, getDaysInMonth, getTaskPosition } from '@/utils/dateUtils';
import { GanttTaskBar } from './GanttTaskBar';
import { GanttDependencyArrows } from './GanttDependencyArrows';

const ROW_HEIGHT = 57;
const HEADER_HEIGHT = 52;

export function GanttTimeline() {
  const { state } = useGantt();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [handleResize]);

  const baseConfig = useMemo(
    () => getTimelineConfig(state.currentDate, state.viewMode),
    [state.currentDate, state.viewMode]
  );

  const config = useMemo(() => {
    if (!containerWidth || containerWidth <= baseConfig.totalWidth) return baseConfig;
    const scale = containerWidth / baseConfig.totalWidth;
    return {
      ...baseConfig,
      pixelsPerDay: baseConfig.pixelsPerDay * scale,
      totalWidth: containerWidth,
    };
  }, [baseConfig, containerWidth]);

  const taskPositions = useMemo(() => {
    return state.tasks.map((task, index) => ({
      task,
      position: getTaskPosition(task, config, index, ROW_HEIGHT),
    }));
  }, [state.tasks, config]);

  const timelineHeight = Math.max(state.tasks.length * ROW_HEIGHT, 400);

  return (
    <div ref={containerRef} className="relative flex-1 overflow-auto bg-bg-primary">
      <div
        className="relative"
        style={{ minWidth: config.totalWidth, minHeight: timelineHeight + HEADER_HEIGHT }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-20 border-b border-border-primary bg-bg-secondary"
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
                    className={`flex flex-col items-center justify-center border-r border-border-primary ${
                      weekend ? 'bg-bg-tertiary' : ''
                    } ${today ? 'bg-today-bg' : ''}`}
                    style={{ flex: `0 0 ${config.pixelsPerDay}px`, minWidth: config.pixelsPerDay }}
                  >
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      today ? 'text-today' : 'text-text-quaternary'
                    }`}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][col.date.getDay()]}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        today
                          ? 'flex h-6 w-6 items-center justify-center rounded-full bg-today text-accent-text'
                          : 'text-text-secondary'
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
                const isCurrentMonth = col.date.getMonth() === new Date().getMonth() && col.date.getFullYear() === new Date().getFullYear();
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-center border-r border-border-primary ${
                      isCurrentMonth ? 'bg-today-bg' : ''
                    }`}
                    style={{ flex: `0 0 ${monthWidth}px`, minWidth: monthWidth }}
                  >
                    <span className={`text-xs font-bold ${isCurrentMonth ? 'text-today-text' : 'text-text-secondary'}`}>
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
                      className={`absolute top-0 border-r border-border-primary/50 ${
                        weekend ? 'bg-bg-tertiary/50' : ''
                      } ${today ? 'bg-today-bg/30' : ''}`}
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
                      className="absolute top-0 border-r border-border-primary"
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
                className="absolute left-0 right-0 border-b border-border-primary/50"
                style={{ top: (idx + 1) * ROW_HEIGHT }}
              />
            ))}
          </div>

          {/* Today indicator line */}
          {(() => {
            const today = new Date();
            const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const timelineStart = new Date(config.startDate.getFullYear(), config.startDate.getMonth(), config.startDate.getDate());
            const daysFromStart = Math.round((todayNormalized.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
            const todayX = daysFromStart * config.pixelsPerDay + config.pixelsPerDay / 2;
            if (todayX >= 0 && todayX <= config.totalWidth) {
              return (
                <div
                  className="pointer-events-none absolute z-10 bg-today"
                  style={{
                    left: todayX,
                    top: 0,
                    width: 2,
                    height: timelineHeight,
                  }}
                />
              );
            }
            return null;
          })()}

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
