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

  // Calculate visible portion of the task bar
  const visibleLeft = Math.max(0, position.left);
  const visibleRight = Math.min(position.left + position.width, config.totalWidth);
  const visibleWidth = visibleRight - visibleLeft;

  // Hide if task is completely outside the visible area
  if (visibleWidth <= 0) {
    return null;
  }

  // Check if task is clipped on left or right side
  const isClippedLeft = position.left < 0;
  const isClippedRight = position.left + position.width > config.totalWidth;

  return (
    <div
      className={`group absolute flex cursor-pointer items-center ${colors.bg} border ${colors.border} ${
        isSelected ? 'ring-2 ring-accent ring-offset-1 shadow-md' : ''
      } ${isDragging ? 'shadow-lg' : 'hover:shadow-md'} ${
        isClippedLeft ? 'rounded-l-none' : 'rounded-l-md'
      } ${isClippedRight ? 'rounded-r-none' : 'rounded-r-md'}`}
      style={{
        left: visibleLeft,
        width: visibleWidth,
        top: position.top + 10,
        height: 30,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Left resize handle - only show if not clipped on left */}
      {!isClippedLeft && (
        <div
          className={`absolute -left-1 top-0 h-full w-2.5 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100 ${
            isDragging && dragType === 'left' ? 'opacity-100' : ''
          }`}
          onMouseDown={handleLeftHandleMouseDown}
        >
          <div className="absolute left-0.5 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white/70" />
        </div>
      )}

      {/* Progress bar - adjusted for visible portion */}
      {(() => {
        // Calculate progress bar width relative to visible area
        const totalWidth = position.width;
        const progressWidth = (progress / 100) * totalWidth;
        const clippedLeft = Math.max(0, -position.left);
        const visibleProgressWidth = Math.max(0, Math.min(progressWidth - clippedLeft, visibleWidth));
        const progressPercent = (visibleProgressWidth / visibleWidth) * 100;

        return progressPercent > 0 ? (
          <div
            className={`absolute left-0 top-0 h-full ${colors.progress} ${!isClippedLeft ? 'rounded-l-md' : ''}`}
            style={{ width: `${progressPercent}%`, opacity: 0.35 }}
          />
        ) : null;
      })()}

      {/* Task name */}
      <div
        className="relative z-10 flex-1 truncate px-2.5 text-xs font-semibold text-text-primary"
        onMouseDown={handleBarMouseDown}
      >
        {task.name}
      </div>

      {/* Right resize handle - only show if not clipped on right */}
      {!isClippedRight && (
        <div
          className={`absolute -right-1 top-0 h-full w-2.5 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100 ${
            isDragging && dragType === 'right' ? 'opacity-100' : ''
          }`}
          onMouseDown={handleRightHandleMouseDown}
        >
          <div className="absolute right-0.5 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white/70" />
        </div>
      )}
    </div>
  );
}
