'use client';

import { useState } from 'react';
import { useGantt } from '@/context/GanttContext';
import { TASK_COLORS, Task, getTaskColorStyles } from '@/types/gantt';
import { formatDateShort, calculateTaskProgress } from '@/utils/dateUtils';

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

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function GanttTaskList() {
  const { state, selectTask, openForm, deleteTask } = useGantt();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const HEADER_HEIGHT = 52;

  return (
    <div className="w-80 flex-shrink-0 border-r border-border-primary bg-bg-secondary flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-border-primary px-4"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">Tasks</span>
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
      <div className="flex-1 overflow-auto">
        {state.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-3">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-tertiary">
              <svg className="h-7 w-7 text-text-quaternary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-secondary">No tasks yet</p>
            <p className="mt-1 text-xs text-text-tertiary">Create your first task</p>
          </div>
        ) : (
          <div>
            {state.tasks.map((task) => {
              const progress = calculateTaskProgress(task.subtasks);
              const colorStyles = getTaskColorStyles(task);
              const colors = colorStyles.classes;
              const isExpanded = expandedTasks.has(task.id);
              const dependencyNames = task.dependsOn.map(
                (id) => state.tasks.find((t) => t.id === id)?.name || '?'
              );
              const subtasks = task.subtasks || [];
              const completedSubs = subtasks.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  className={`border-b border-border-primary transition-colors ${isExpanded ? 'bg-card-expanded-bg' : ''}`}
                >
                  {/* Task Row */}
                  <div
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${!isExpanded ? 'hover:bg-bg-hover' : ''}`}
                    onClick={() => {
                      selectTask(task.id);
                      toggleExpand(task.id);
                    }}
                  >
                    {/* Color indicator */}
                    <div
                      className={`h-8 w-1 rounded-full flex-shrink-0 ${colors.progress}`}
                      style={colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
                    />

                    {/* Task name */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                    </div>

                    {/* Progress and chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.progress}`}
                          style={{
                            width: `${progress}%`,
                            ...(colorStyles.progressColor && { backgroundColor: colorStyles.progressColor })
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text-secondary w-8">{progress}%</span>
                      <ChevronIcon className="h-3.5 w-3.5 text-text-tertiary" expanded={isExpanded} />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-3">
                      {/* Date Grid */}
                      <div className="grid grid-cols-2 gap-2 text-center mb-2">
                        <div className="bg-card-content-bg rounded-lg p-2 border border-card-expanded-border">
                          <div className="text-xs font-bold text-text-primary">{formatDateShort(task.startDate)}</div>
                          <div className="text-[9px] text-text-tertiary uppercase">Start</div>
                        </div>
                        <div className="bg-card-content-bg rounded-lg p-2 border border-card-expanded-border">
                          <div className="text-xs font-bold text-text-primary">{formatDateShort(task.endDate)}</div>
                          <div className="text-[9px] text-text-tertiary uppercase">End</div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 text-center mb-3">
                        <div className="bg-card-content-bg rounded-lg p-2 border border-card-expanded-border">
                          <div className="text-xs font-bold text-text-primary">{task.dependsOn.length}</div>
                          <div className="text-[9px] text-text-tertiary uppercase">Dependencies</div>
                        </div>
                        <div className="bg-card-content-bg rounded-lg p-2 border border-card-expanded-border">
                          <div className="text-xs font-bold text-text-primary">{completedSubs}/{subtasks.length}</div>
                          <div className="text-[9px] text-text-tertiary uppercase">Subtasks</div>
                        </div>
                      </div>

                      {/* Dependencies List */}
                      {dependencyNames.length > 0 && (
                        <div className="mb-2 p-2 bg-card-content-bg rounded-lg border border-card-expanded-border">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary uppercase mb-1.5">
                            <LinkIcon className="h-3 w-3" />
                            Blocked by
                          </div>
                          <div className="space-y-1">
                            {dependencyNames.map((name, i) => (
                              <div key={i} className="text-xs text-text-secondary truncate">• {name}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Subtasks List */}
                      {subtasks.length > 0 && (
                        <div className="mb-3 p-2 bg-card-content-bg rounded-lg border border-card-expanded-border">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary uppercase mb-1.5">
                            <ListIcon className="h-3 w-3" />
                            Subtasks
                          </div>
                          <div className="space-y-1">
                            {subtasks.map((sub) => (
                              <div key={sub.id} className="flex items-center gap-2 text-xs">
                                <div
                                  className={`h-3 w-3 rounded border flex items-center justify-center ${
                                    sub.completed ? `${colors.progress} border-transparent` : 'border-border-secondary'
                                  }`}
                                  style={sub.completed && colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
                                >
                                  {sub.completed && <CheckIcon className="h-2 w-2 text-accent-text" />}
                                </div>
                                <span className={sub.completed ? 'text-text-tertiary line-through' : 'text-text-secondary'}>
                                  {sub.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskToDelete(task);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-danger bg-danger-light hover:bg-danger/20 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openForm(task);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-warning bg-warning-light hover:bg-warning/20 rounded-lg transition-colors"
                        >
                          <EditIcon className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </div>
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
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary bg-bg-tertiary shadow-2xl">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                <TrashIcon className="h-6 w-6 text-danger" />
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
                  className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-xs font-semibold text-accent-text hover:opacity-90"
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
