'use client';

import { useMemo } from 'react';
import { Task, TimelineConfig } from '@/types/gantt';
import { getTaskPosition } from '@/utils/dateUtils';
import { generateBezierPath } from '@/utils/dependencyPath';

interface GanttDependencyArrowsProps {
  tasks: Task[];
  config: TimelineConfig;
  rowHeight: number;
  timelineHeight: number;
}

export function GanttDependencyArrows({ tasks, config, rowHeight, timelineHeight }: GanttDependencyArrowsProps) {
  const arrows = useMemo(() => {
    const result: { path: string; id: string }[] = [];

    tasks.forEach((task, taskIndex) => {
      task.dependsOn.forEach((dependencyId) => {
        const dependencyIndex = tasks.findIndex((t) => t.id === dependencyId);
        if (dependencyIndex === -1) return;

        const dependency = tasks[dependencyIndex];

        const fromPosition = getTaskPosition(dependency, config, dependencyIndex, rowHeight);
        const toPosition = getTaskPosition(task, config, taskIndex, rowHeight);

        const fromX = fromPosition.left + fromPosition.width;
        const fromY = fromPosition.top + 25;
        const toX = toPosition.left;
        const toY = toPosition.top + 25;

        const path = generateBezierPath({ x: fromX, y: fromY }, { x: toX, y: toY });
        result.push({ path, id: `${dependencyId}-${task.id}` });
      });
    });

    return result;
  }, [tasks, config, rowHeight]);

  if (arrows.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 text-violet-400"
      style={{ width: config.totalWidth, height: timelineHeight }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>
      {arrows.map(({ path, id }) => (
        <path
          key={id}
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      ))}
    </svg>
  );
}
