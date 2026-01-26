'use client';

import { useMemo } from 'react';
import { Task } from '@/types/gantt';
import { calculateProgress } from '@/utils/dateUtils';

export function useTaskProgress(task: Task): number {
  return useMemo(() => {
    return calculateProgress(task.startDate, task.endDate);
  }, [task.startDate, task.endDate]);
}
