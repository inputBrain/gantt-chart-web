'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task, TimelineConfig } from '@/types/gantt';
import { addDays } from '@/utils/dateUtils';

type DragType = 'left' | 'right' | 'move' | null;

interface DragState {
  isDragging: boolean;
  dragType: DragType;
  startX: number;
  originalTask: Task | null;
}

interface UseTaskDragProps {
  task: Task;
  config: TimelineConfig;
  onUpdate: (task: Task) => void;
}

interface UseTaskDragReturn {
  isDragging: boolean;
  dragType: DragType;
  handleLeftHandleMouseDown: (e: React.MouseEvent) => void;
  handleRightHandleMouseDown: (e: React.MouseEvent) => void;
  handleBarMouseDown: (e: React.MouseEvent) => void;
}

export function useTaskDrag({ task, config, onUpdate }: UseTaskDragProps): UseTaskDragReturn {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startX: 0,
    originalTask: null,
  });

  const startDrag = useCallback((e: React.MouseEvent, type: DragType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({
      isDragging: true,
      dragType: type,
      startX: e.clientX,
      originalTask: { ...task },
    });
  }, [task]);

  const handleLeftHandleMouseDown = useCallback(
    (e: React.MouseEvent) => startDrag(e, 'left'),
    [startDrag]
  );

  const handleRightHandleMouseDown = useCallback(
    (e: React.MouseEvent) => startDrag(e, 'right'),
    [startDrag]
  );

  const handleBarMouseDown = useCallback(
    (e: React.MouseEvent) => startDrag(e, 'move'),
    [startDrag]
  );

  useEffect(() => {
    if (!dragState.isDragging || !dragState.originalTask) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragState.startX;
      const deltaDays = Math.round(deltaX / config.pixelsPerDay);

      if (deltaDays === 0) return;

      const original = dragState.originalTask!;
      let newStartDate = new Date(original.startDate);
      let newEndDate = new Date(original.endDate);

      switch (dragState.dragType) {
        case 'left':
          newStartDate = addDays(original.startDate, deltaDays);
          if (newStartDate >= newEndDate) {
            newStartDate = addDays(newEndDate, -1);
          }
          break;
        case 'right':
          newEndDate = addDays(original.endDate, deltaDays);
          if (newEndDate <= newStartDate) {
            newEndDate = addDays(newStartDate, 1);
          }
          break;
        case 'move':
          newStartDate = addDays(original.startDate, deltaDays);
          newEndDate = addDays(original.endDate, deltaDays);
          break;
      }

      onUpdate({
        ...task,
        startDate: newStartDate,
        endDate: newEndDate,
      });
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        dragType: null,
        startX: 0,
        originalTask: null,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, dragState.startX, dragState.dragType, dragState.originalTask, config.pixelsPerDay, task, onUpdate]);

  return {
    isDragging: dragState.isDragging,
    dragType: dragState.dragType,
    handleLeftHandleMouseDown,
    handleRightHandleMouseDown,
    handleBarMouseDown,
  };
}
