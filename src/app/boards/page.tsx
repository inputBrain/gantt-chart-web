'use client';

import { useState } from 'react';
import { useGantt } from '@/context/GanttContext';
import { TASK_COLORS, Task } from '@/types/gantt';
import { calculateTaskProgress, formatDateShort } from '@/utils/dateUtils';

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

function TaskCard({ task, onToggleSubtask, onAddSubtask, onEditTask }: TaskCardProps) {
  const progress = calculateTaskProgress(task.subtasks);
  const colors = TASK_COLORS[task.color];
  const subtasks = task.subtasks || [];
  const completedCount = subtasks.filter(s => s.completed).length;

  return (
    <div className="bg-bg-primary rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-10 w-1.5 rounded-full flex-shrink-0 ${colors.progress}`} />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary truncate">{task.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <CalendarIcon className="h-3.5 w-3.5 text-text-tertiary" />
                <span className="text-xs text-text-tertiary">
                  {formatDateShort(task.startDate)} — {formatDateShort(task.endDate)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onEditTask(task)}
            className="flex-shrink-0 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.progress} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-text-secondary tabular-nums w-12 text-right">
            {progress}%
          </span>
        </div>
      </div>

      {/* Subtasks */}
      <div className="p-3">
        {subtasks.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                Subtasks
              </span>
              <span className="text-xs font-semibold text-text-secondary">
                {completedCount}/{subtasks.length}
              </span>
            </div>
            <div className="space-y-1">
              {subtasks.map((subtask) => (
                <button
                  key={subtask.id}
                  onClick={() => onToggleSubtask(task.id, subtask.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-bg-hover transition-colors text-left group"
                >
                  <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    subtask.completed
                      ? `${colors.progress} border-transparent`
                      : 'border-border-secondary group-hover:border-border-focus'
                  }`}>
                    {subtask.completed && <CheckIcon className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`text-sm flex-1 ${
                    subtask.completed
                      ? 'text-text-tertiary line-through'
                      : 'text-text-primary'
                  }`}>
                    {subtask.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-text-tertiary mb-2">No subtasks yet</p>
          </div>
        )}

        {/* Add subtask button */}
        <button
          onClick={() => onAddSubtask(task)}
          className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-border-secondary text-text-tertiary hover:text-text-secondary hover:border-border-focus hover:bg-bg-hover transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Add subtask</span>
        </button>
      </div>
    </div>
  );
}

interface AddSubtaskModalProps {
  task: Task;
  onClose: () => void;
  onAdd: (taskId: string, subtaskName: string) => void;
}

function AddSubtaskModal({ task, onClose, onAdd }: AddSubtaskModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(task.id, name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-base font-bold text-text-primary mb-1">Add Subtask</h3>
            <p className="text-sm text-text-tertiary mb-4">
              Adding to <span className="font-medium text-text-secondary">{task.name}</span>
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subtask name..."
              className="w-full px-4 py-3 rounded-xl border border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>
          <div className="flex gap-3 p-4 border-t border-border-primary bg-bg-secondary">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-text hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BoardsPage() {
  const { state, toggleSubtask, updateTask, openForm } = useGantt();
  const [addSubtaskTask, setAddSubtaskTask] = useState<Task | null>(null);

  const handleAddSubtask = (taskId: string, subtaskName: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubtask = {
      id: crypto.randomUUID(),
      name: subtaskName,
      completed: false,
    };

    updateTask({
      ...task,
      subtasks: [...(task.subtasks || []), newSubtask],
    });
  };

  // Group tasks by progress status
  const todoTasks = state.tasks.filter(t => calculateTaskProgress(t.subtasks) === 0);
  const inProgressTasks = state.tasks.filter(t => {
    const p = calculateTaskProgress(t.subtasks);
    return p > 0 && p < 100;
  });
  const doneTasks = state.tasks.filter(t => calculateTaskProgress(t.subtasks) === 100);

  const columns = [
    { title: 'To Do', tasks: todoTasks, color: 'bg-text-tertiary' },
    { title: 'In Progress', tasks: inProgressTasks, color: 'bg-warning' },
    { title: 'Completed', tasks: doneTasks, color: 'bg-success' },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-text-primary">Boards</h1>
          <p className="text-sm text-text-tertiary mt-1">Manage your tasks and subtasks</p>
        </div>

        {state.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-tertiary">
              <svg className="h-8 w-8 text-text-quaternary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-base font-semibold text-text-secondary">No tasks yet</p>
            <p className="mt-1 text-sm text-text-tertiary">Create a task on the Plan page first</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div key={column.title} className="space-y-4">
                {/* Column Header */}
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${column.color}`} />
                  <h2 className="text-sm font-bold text-text-primary">{column.title}</h2>
                  <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                    {column.tasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleSubtask={toggleSubtask}
                      onAddSubtask={setAddSubtaskTask}
                      onEditTask={openForm}
                    />
                  ))}
                  {column.tasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border-secondary p-6 text-center">
                      <p className="text-xs text-text-tertiary">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Subtask Modal */}
      {addSubtaskTask && (
        <AddSubtaskModal
          task={addSubtaskTask}
          onClose={() => setAddSubtaskTask(null)}
          onAdd={handleAddSubtask}
        />
      )}
    </div>
  );
}
