'use client';

import { useState, useMemo, useRef } from 'react';
import { useGantt } from '@/context/GanttContext';
import { TaskColor, TASK_COLORS, Task } from '@/types/gantt';
import { formatDate, parseDate } from '@/utils/dateUtils';
import { DatePicker } from '@/components/ui/DatePicker';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';

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
  const [description, setDescription] = useState(editingTask?.description ?? '');
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
      description: description.trim() || undefined,
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
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Task"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-text-secondary">{editingTask?.name}</span>?
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-primary bg-bg-tertiary shadow-2xl">
        {/* Header */}
        <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeForm}
              aria-label="Close"
              className="!p-1"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
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

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-sm text-text-secondary placeholder-text-quaternary hover:border-border-secondary focus:border-accent focus:outline-none resize-none"
                placeholder="Add task description or notes..."
                rows={3}
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
              <div className="flex gap-2 items-center flex-wrap">
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
              </div>
            </div>

            {/* Custom Color */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Custom Color
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCustomColorClick}
                  className={`relative h-10 w-10 rounded-full overflow-hidden transition-transform ${
                    customColor ? 'ring-2 ring-text-tertiary ring-offset-2 scale-110' : 'hover:scale-110'
                  }`}
                  style={customColor ? { backgroundColor: customColor } : undefined}
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
                {customColor && (
                  <span className="text-sm text-text-secondary font-mono">{customColor.toUpperCase()}</span>
                )}
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
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingTask ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
            {editingTask && (
              <Button variant="danger" fullWidth onClick={handleDelete}>
                Delete Task
              </Button>
            )}
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
