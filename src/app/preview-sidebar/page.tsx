'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock data
const mockTasks = [
  { id: '1', name: 'Design System Setup', color: 'blue', progress: 100, startDate: 'Jan 15', endDate: 'Jan 20', dependsOn: [] },
  { id: '2', name: 'API Integration', color: 'green', progress: 65, startDate: 'Jan 18', endDate: 'Feb 5', dependsOn: ['Design System Setup'] },
  { id: '3', name: 'User Authentication', color: 'purple', progress: 30, startDate: 'Jan 25', endDate: 'Feb 10', dependsOn: ['API Integration'] },
];

const COLORS: Record<string, { bg: string; border: string; dot: string; progress: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', progress: 'bg-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', progress: 'bg-green-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500', progress: 'bg-purple-500' },
};

// Icons
function ChevronIcon({ className, expanded }: { className?: string; expanded?: boolean }) {
  return (
    <svg className={`${className} transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

// Custom Variant: Variant 2 base + Variant 3 vertical stripe + Variant 3 buttons (swapped)
function SidebarCustom() {
  const [expanded, setExpanded] = useState<string | null>('2');

  return (
    <div className="w-80 border-r border-border-primary bg-bg-primary h-[450px] flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <span className="text-sm font-semibold text-text-primary">Tasks</span>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;

          return (
            <div
              key={task.id}
              className={`border-b border-border-primary transition-colors ${isExpanded ? 'bg-bg-secondary' : ''}`}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${!isExpanded ? 'hover:bg-bg-hover' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : task.id)}
              >
                {/* Vertical color stripe instead of dot */}
                <div className={`h-8 w-1 rounded-full flex-shrink-0 ${colors.dot}`} />

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-8">{task.progress}%</span>
                  <ChevronIcon className="h-3.5 w-3.5 text-text-tertiary" expanded={isExpanded} />
                </div>
              </div>

              {isExpanded && (
                <div>
                  <div className="px-4 pb-4 space-y-3">
                    {/* Timeline */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-primary rounded-md border border-border-primary">
                        <CalendarIcon className="h-3.5 w-3.5 text-text-tertiary" />
                        <span className="text-text-secondary">{task.startDate}</span>
                      </div>
                      <div className="flex-1 border-t border-dashed border-border-secondary" />
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-primary rounded-md border border-border-primary">
                        <CalendarIcon className="h-3.5 w-3.5 text-text-tertiary" />
                        <span className="text-text-secondary">{task.endDate}</span>
                      </div>
                    </div>

                    {task.dependsOn.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <LinkIcon className="h-3.5 w-3.5 text-text-tertiary" />
                        <span>Dependencies: {task.dependsOn.join(', ')}</span>
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="flex justify-end">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${colors.bg} ${colors.border} border`}>
                        {task.progress === 100 ? 'Completed' : task.progress > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>
                  </div>

                  {/* Actions bar - Edit | Delete (swapped from variant 3) */}
                  <div className="flex border-t border-border-primary">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-text-secondary hover:bg-bg-hover transition-colors">
                      <EditIcon className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <div className="w-px bg-border-primary" />
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-danger hover:bg-danger-light transition-colors">
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PreviewSidebar() {
  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Sidebar Preview</h1>
          <p className="text-text-secondary">Click on tasks to expand</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-text-secondary px-1">Custom: V2 + V3 stripe + V3 buttons</h2>
          <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
            <SidebarCustom />
          </div>
        </div>

        <div className="pt-6 text-center">
          <Link href="/" className="text-sm text-accent hover:text-accent-hover font-medium">
            ← Back to app
          </Link>
        </div>
      </div>
    </div>
  );
}
