'use client';

import { useState } from 'react';
import { useGantt } from '@/context/GanttContext';
import { TASK_COLORS, Task } from '@/types/gantt';
import { formatDate, calculateProgress } from '@/utils/dateUtils';

export function GanttTaskList() {
  const { state, selectTask, openForm, deleteTask } = useGantt();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  return (
    <div className="w-80 flex-shrink-0 border-r border-border-primary bg-bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-primary bg-bg-primary px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Tasks</span>
          {state.tasks.length > 0 && (
            <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs font-semibold text-text-secondary">
              {state.tasks.length}
            </span>
          )}
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

      {/* Task List */}
      <div className="h-[calc(100%-49px)] overflow-auto p-3">
        {state.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-tertiary">
              <svg className="h-7 w-7 text-text-quaternary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-secondary">No tasks yet</p>
            <p className="mt-1 text-xs text-text-tertiary">Create your first task</p>
          </div>
        ) : (
          <div className="space-y-2">
            {state.tasks.map((task) => {
              const progress = calculateProgress(task.startDate, task.endDate);
              const colors = TASK_COLORS[task.color];
              const isSelected = state.selectedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`cursor-pointer rounded-xl border bg-bg-primary p-3 hover:shadow-sm ${
                    isSelected
                      ? 'border-accent shadow-sm'
                      : 'border-border-primary hover:border-border-secondary'
                  }`}
                  onClick={() => selectTask(task.id)}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${colors.progress}`} />
                      <span className="truncate text-sm font-semibold text-text-primary">
                        {task.name}
                      </span>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openForm(task);
                        }}
                        className="rounded-lg p-1.5 text-text-quaternary hover:bg-bg-hover hover:text-text-secondary"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTaskToDelete(task);
                        }}
                        className="rounded-lg p-1.5 text-text-quaternary hover:bg-danger-light hover:text-danger"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-text-tertiary">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="tabular-nums">{formatDate(task.startDate)}</span>
                    <span className="text-text-quaternary">—</span>
                    <span className="tabular-nums">{formatDate(task.endDate)}</span>
                  </div>

                  {/* Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-text-quaternary">Progress</span>
                      <span className="text-xs font-bold tabular-nums text-text-secondary">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className={`h-full rounded-full ${colors.progress}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Dependencies */}
                  {task.dependsOn.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-info">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="truncate">
                        {task.dependsOn.map((id) => state.tasks.find((t) => t.id === id)?.name || '?').join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-2xl">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="mb-1 text-base font-bold text-text-primary">Delete Task</h3>
              <p className="mb-6 text-sm text-text-tertiary">
                Are you sure you want to delete <span className="font-semibold text-text-secondary">{taskToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTaskToDelete(null)}
                  className="flex-1 rounded-xl border border-border-primary bg-bg-primary px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg-hover"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteTask(taskToDelete.id);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
