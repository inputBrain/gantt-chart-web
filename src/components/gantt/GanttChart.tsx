'use client';

import { GanttProvider } from '@/context/GanttContext';
import { GanttHeader } from './GanttHeader';
import { GanttTimeline } from './GanttTimeline';
import { GanttTaskList } from './GanttTaskList';
import { TaskForm } from './TaskForm';

export function GanttChart() {
  return (
    <GanttProvider>
      <div className="flex h-screen flex-col bg-bg-secondary">
        <GanttHeader />
        <div className="flex flex-1 overflow-hidden">
          <GanttTaskList />
          <GanttTimeline />
        </div>
        <TaskForm />
      </div>
    </GanttProvider>
  );
}
