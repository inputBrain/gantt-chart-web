'use client';

import { useGantt } from '@/context/GanttContext';
import { useTaskDrag } from '@/hooks/useTaskDrag';
import { useTaskProgress } from '@/hooks/useTaskProgress';
import { Task, TimelineConfig, TASK_COLORS } from '@/types/gantt';

interface GanttTaskBarProps {
  task: Task;
  position: { left: number; width: number; top: number };
  config: TimelineConfig;
}

export function GanttTaskBar({ task, position, config }: GanttTaskBarProps) {
  const { state, updateTask, selectTask, openForm } = useGantt();
  const progress = useTaskProgress(task);
  const { isDragging, dragType, handleLeftHandleMouseDown, handleRightHandleMouseDown, handleBarMouseDown } =
    useTaskDrag({ task, config, onUpdate: updateTask });

  const isSelected = state.selectedTaskId === task.id;
  const colors = TASK_COLORS[task.color];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectTask(task.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openForm(task);
  };

  if (position.width <= 0 || position.left + position.width < 0 || position.left > config.totalWidth) {
    return null;
  }

  return (
    <div
      className={`group absolute flex cursor-pointer items-center rounded-md ${colors.bg} border ${colors.border} ${
        isSelected ? 'ring-2 ring-accent ring-offset-1 shadow-md' : ''
      } ${isDragging ? 'shadow-lg' : 'hover:shadow-md'}`}
      style={{
        left: Math.max(0, position.left),
        width: Math.min(position.width, config.totalWidth - position.left),
        top: position.top + 10,
        height: 30,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Left resize handle */}
      <div
        className={`absolute -left-1 top-0 h-full w-2.5 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100 ${
          isDragging && dragType === 'left' ? 'opacity-100' : ''
        }`}
        onMouseDown={handleLeftHandleMouseDown}
      >
        <div className="absolute left-0.5 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white/70" />
      </div>

      {/* Progress bar */}
      <div
        className={`absolute left-0 top-0 h-full rounded-l-md ${colors.progress}`}
        style={{ width: `${progress}%`, opacity: 0.35 }}
      />

      {/* Task name */}
      <div
        className="relative z-10 flex-1 truncate px-2.5 text-xs font-semibold text-text-primary"
        onMouseDown={handleBarMouseDown}
      >
        {task.name}
      </div>

      {/* Right resize handle */}
      <div
        className={`absolute -right-1 top-0 h-full w-2.5 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100 ${
          isDragging && dragType === 'right' ? 'opacity-100' : ''
        }`}
        onMouseDown={handleRightHandleMouseDown}
      >
        <div className="absolute right-0.5 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white/70" />
      </div>
    </div>
  );
}
