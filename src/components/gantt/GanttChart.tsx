'use client';

import { GanttProvider } from '@/context/GanttContext';
import { GanttHeader } from './GanttHeader';
import { GanttTimeline } from './GanttTimeline';
import { GanttTaskList } from './GanttTaskList';
import { TaskForm } from './TaskForm';

export function GanttChart() {
  return (
    <GanttProvider>
      <div className="flex h-screen flex-col" style={{ background: 'var(--bg-primary)' }}>
        <GanttHeader />
        <div className="flex flex-1 overflow-hidden px-3 pb-3 gap-3">
          <GanttTaskList />
          <GanttTimeline />
        </div>
        <TaskForm />
      </div>
    </GanttProvider>
  );
}
