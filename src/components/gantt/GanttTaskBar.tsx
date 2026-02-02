'use client';

import { useState, useRef, useEffect } from 'react';
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSelected = state.selectedTaskId === task.id;
  const colors = TASK_COLORS[task.color];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleToggleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask({ ...task, blocked: !task.blocked });
    setIsMenuOpen(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

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
      {/* Left resize handle - only show if not clipped on left and not blocked */}
      {!isClippedLeft && !task.blocked && (
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
        onMouseDown={task.blocked ? undefined : handleBarMouseDown}
      >
        {task.name}
      </div>

      {/* Menu button (three dots or lock icon) */}
      <div ref={menuRef} className="relative z-20 flex-shrink-0 mr-1">
        <button
          onClick={handleMenuClick}
          className={`flex h-5 w-5 items-center justify-center rounded hover:bg-black/10 ${
            task.blocked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity`}
        >
          {task.blocked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 text-text-primary"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 text-text-primary"
            >
              <circle cx="10" cy="5" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="15" r="1.5" />
            </svg>
          )}
        </button>

        {/* Dropdown menu - positioned above */}
        {isMenuOpen && (
          <div className="absolute bottom-full right-0 mb-1 min-w-[100px] rounded-md border border-border-primary bg-bg-primary shadow-lg">
            <button
              onClick={handleToggleBlock}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-bg-hover"
            >
              {task.blocked ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M14.5 1A4.5 4.5 0 0010 5.5V9H3a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V5.5a3 3 0 116 0v4.25a.75.75 0 101.5 0V5.5A4.5 4.5 0 0014.5 1z" />
                  </svg>
                  Unlock
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lock
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right resize handle - only show if not clipped on right and not blocked */}
      {!isClippedRight && !task.blocked && (
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
