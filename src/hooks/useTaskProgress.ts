'use client';

import { useMemo } from 'react';
import { Task } from '@/types/gantt';
import { calculateTaskProgress } from '@/utils/dateUtils';

export function useTaskProgress(task: Task): number {
  return useMemo(() => {
    return calculateTaskProgress(task.subtasks);
  }, [task.subtasks]);
}
