'use client';

import { useGantt } from '@/context/GanttContext';
import { TASK_COLORS } from '@/types/gantt';
import { formatDate, calculateProgress } from '@/utils/dateUtils';

export function GanttTaskList() {
  const { state, selectTask, openForm, deleteTask } = useGantt();

  return (
    <div className="w-80 flex-shrink-0 border-r border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tasks</h2>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-57px)] overflow-auto">
        {state.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No tasks yet</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Click &quot;Add Task&quot; to create one</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {state.tasks.map((task) => {
              const progress = calculateProgress(task.startDate, task.endDate);
              const colors = TASK_COLORS[task.color];
              const isSelected = state.selectedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`cursor-pointer px-4 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => selectTask(task.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${colors.progress}`} />
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {task.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openForm(task);
                        }}
                        className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-600 dark:hover:text-zinc-200"
                        title="Edit task"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this task?')) {
                            deleteTask(task.id);
                          }
                        }}
                        className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                        title="Delete task"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(task.startDate)} - {formatDate(task.endDate)}
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{progress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className={`h-full transition-all ${colors.progress}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {task.dependsOn.length > 0 && (
                    <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      Depends on:{' '}
                      {task.dependsOn
                        .map((id) => state.tasks.find((t) => t.id === id)?.name || 'Unknown')
                        .join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
