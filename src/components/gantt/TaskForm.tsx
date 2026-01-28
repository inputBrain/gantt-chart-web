'use client';

import { useState, useMemo } from 'react';
import { useGantt } from '@/context/GanttContext';
import { TaskColor, TASK_COLORS, Task } from '@/types/gantt';
import { formatDate, parseDate } from '@/utils/dateUtils';

const COLORS: TaskColor[] = ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'pink', 'yellow'];

function getDefaultDates() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  return { startDate: formatDate(today), endDate: formatDate(nextWeek) };
}

function TaskFormContent({ editingTask, tasks }: { editingTask: Task | null; tasks: Task[] }) {
  const { addTask, updateTask, deleteTask, closeForm } = useGantt();

  const defaultDates = useMemo(() => getDefaultDates(), []);

  const [name, setName] = useState(editingTask?.name ?? '');
  const [startDate, setStartDate] = useState(
    editingTask ? formatDate(editingTask.startDate) : defaultDates.startDate
  );
  const [endDate, setEndDate] = useState(
    editingTask ? formatDate(editingTask.endDate) : defaultDates.endDate
  );
  const [color, setColor] = useState<TaskColor>(editingTask?.color ?? 'blue');
  const [dependsOn, setDependsOn] = useState<string[]>(editingTask?.dependsOn ?? []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !startDate || !endDate) return;

    const taskData = {
      name: name.trim(),
      startDate: parseDate(startDate),
      endDate: parseDate(endDate),
      color,
      dependsOn,
    };

    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      addTask(taskData);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
    }
  };

  const handleDependencyToggle = (taskId: string) => {
    setDependsOn((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const availableDependencies = tasks.filter((t) => !editingTask || t.id !== editingTask.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="mb-1 text-base font-bold text-neutral-800">Delete Task</h3>
              <p className="mb-6 text-sm text-neutral-500">
                Are you sure you want to delete <span className="font-semibold text-neutral-700">{editingTask?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-800">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={closeForm}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Task Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Task Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Enter task name"
                required
                autoFocus
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Color
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full shadow-sm ${TASK_COLORS[c].progress} ${
                      color === c ? 'ring-2 ring-neutral-400 ring-offset-2 scale-110' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Dependencies */}
            {availableDependencies.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Dependencies
                </label>
                <div className="max-h-32 space-y-1 overflow-auto rounded-xl border border-neutral-200 bg-neutral-50 p-2">
                  {availableDependencies.map((task) => (
                    <label
                      key={task.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={dependsOn.includes(task.id)}
                        onChange={() => handleDependencyToggle(task.id)}
                        className="h-4 w-4 rounded border-neutral-300 text-cyan-500 focus:ring-cyan-400"
                      />
                      <div className={`h-2.5 w-2.5 rounded-full ${TASK_COLORS[task.color].progress}`} />
                      <span className="text-sm text-neutral-700">{task.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              {editingTask && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                >
                  Delete Task
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TaskForm() {
  const { state } = useGantt();
  const { isFormOpen, editingTask, tasks } = state;

  if (!isFormOpen) return null;

  return <TaskFormContent key={editingTask?.id ?? 'new'} editingTask={editingTask} tasks={tasks} />;
}
