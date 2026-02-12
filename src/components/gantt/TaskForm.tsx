'use client';

import { useState, useMemo, useRef } from 'react';
import { useGantt } from '@/context/GanttContext';
import { TaskColor, TASK_COLORS, Task } from '@/types/gantt';
import { formatDate, parseDate } from '@/utils/dateUtils';
import { DatePicker } from '@/components/ui/DatePicker';

const COLORS: TaskColor[] = ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'pink', 'yellow'];

// Mapping preset colors to hex for initial color picker value
const COLOR_TO_HEX: Record<TaskColor, string> = {
  blue: '#1e88e5',
  green: '#0ecb81',
  purple: '#7c3aed',
  orange: '#f59e0b',
  red: '#f6465d',
  teal: '#14b8a6',
  pink: '#ec4899',
  yellow: '#eab308',
};

function getDefaultDates() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  return { startDate: formatDate(today), endDate: formatDate(nextWeek) };
}

function TaskFormContent({ editingTask, tasks }: { editingTask: Task | null; tasks: Task[] }) {
  const { addTask, updateTask, deleteTask, closeForm } = useGantt();
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const defaultDates = useMemo(() => getDefaultDates(), []);

  const [name, setName] = useState(editingTask?.name ?? '');
  const [startDate, setStartDate] = useState(
    editingTask ? formatDate(editingTask.startDate) : defaultDates.startDate
  );
  const [endDate, setEndDate] = useState(
    editingTask ? formatDate(editingTask.endDate) : defaultDates.endDate
  );
  const [color, setColor] = useState<TaskColor>(editingTask?.color ?? 'blue');
  const [customColor, setCustomColor] = useState<string | undefined>(editingTask?.customColor);
  const [dependsOn, setDependsOn] = useState<string[]>(editingTask?.dependsOn ?? []);
  const [blocked, setBlocked] = useState(editingTask?.blocked ?? false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !startDate || !endDate) return;

    const taskData = {
      name: name.trim(),
      startDate: parseDate(startDate),
      endDate: parseDate(endDate),
      color,
      customColor,
      dependsOn,
      blocked,
    };

    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      addTask(taskData);
    }
  };

  const handlePresetColorClick = (c: TaskColor) => {
    setColor(c);
    setCustomColor(undefined); // Clear custom color when selecting preset
  };

  const handleCustomColorClick = () => {
    colorPickerRef.current?.click();
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
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
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary bg-bg-tertiary shadow-2xl">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light">
                <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="mb-1 text-base font-bold text-text-primary">Delete Task</h3>
              <p className="mb-6 text-sm text-text-tertiary">
                Are you sure you want to delete <span className="font-semibold text-text-secondary">{editingTask?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-border-primary bg-bg-primary px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg-hover"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-xs font-semibold text-accent-text hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-primary bg-bg-tertiary shadow-2xl">
        {/* Header */}
        <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={closeForm}
              className="rounded-lg p-1 text-text-quaternary hover:bg-bg-hover hover:text-text-secondary"
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
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Task Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-sm text-text-secondary placeholder-text-quaternary hover:border-border-secondary focus:border-accent focus:outline-none"
                placeholder="Enter task name"
                required
                autoFocus
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Start Date
                </label>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Select start"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  End Date
                </label>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate}
                  placeholder="Select end"
                  required
                />
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Color
              </label>
              <div className="flex gap-2 items-center">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handlePresetColorClick(c)}
                    className={`h-8 w-8 rounded-full ${TASK_COLORS[c].progress} transition-transform ${
                      color === c && !customColor ? 'ring-2 ring-text-tertiary ring-offset-2 scale-110' : 'hover:scale-110'
                    }`}
                  />
                ))}
                {/* Custom color picker button */}
                <button
                  type="button"
                  onClick={handleCustomColorClick}
                  className={`relative h-8 w-8 rounded-full overflow-hidden transition-transform ${
                    customColor ? 'ring-2 ring-text-tertiary ring-offset-2 scale-110' : 'hover:scale-110'
                  }`}
                  style={customColor ? { backgroundColor: customColor } : undefined}
                  title="Custom color"
                >
                  {!customColor && (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'conic-gradient(from 0deg, #f6465d, #f59e0b, #eab308, #0ecb81, #14b8a6, #1e88e5, #7c3aed, #ec4899, #f6465d)'
                      }}
                    />
                  )}
                </button>
                <input
                  ref={colorPickerRef}
                  type="color"
                  value={customColor || COLOR_TO_HEX[color]}
                  onChange={handleCustomColorChange}
                  className="sr-only"
                />
              </div>
            </div>

            {/* Dependencies */}
            {availableDependencies.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Dependencies
                </label>
                <div className="max-h-32 space-y-1 overflow-auto rounded-xl border border-border-primary bg-bg-secondary p-2">
                  {availableDependencies.map((task) => (
                    <label
                      key={task.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-bg-primary"
                    >
                      <input
                        type="checkbox"
                        checked={dependsOn.includes(task.id)}
                        onChange={() => handleDependencyToggle(task.id)}
                        className="h-4 w-4 rounded border-border-secondary text-accent focus:ring-0 focus:ring-offset-0"
                      />
                      <div className={`h-2.5 w-2.5 rounded-full ${TASK_COLORS[task.color].progress}`} />
                      <span className="text-sm text-text-secondary">{task.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Lock Task */}
            <div className="flex items-center justify-between rounded-xl border border-border-primary bg-bg-secondary px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${blocked ? 'bg-accent-light' : 'bg-bg-tertiary'}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-4 w-4 ${blocked ? 'text-accent' : 'text-text-tertiary'}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">Lock Task</div>
                  <div className="text-xs text-text-tertiary">Prevent dragging and resizing</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBlocked(!blocked)}
                className={`relative h-6 w-11 rounded-full transition-colors ${blocked ? 'bg-accent' : 'bg-border-secondary'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-bg-primary shadow transition-transform ${blocked ? 'left-[22px]' : 'left-0.5'}`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              {editingTask && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-light"
                >
                  Delete Task
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-border-primary bg-bg-primary px-5 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-accent-text hover:bg-accent-hover"
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
