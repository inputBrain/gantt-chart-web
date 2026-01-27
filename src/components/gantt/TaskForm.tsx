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

const inputStyle: React.CSSProperties = {
  background: '#181a20',
  borderColor: '#2b3139',
  color: '#eaecef',
};

const inputFocusClass = 'w-full rounded border px-4 py-2.5 text-sm focus:border-[#f0b90b] focus:outline-none';

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
    if (editingTask && confirm('Delete this task?')) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-md overflow-hidden rounded-lg border" style={{ background: '#1e2329', borderColor: '#2b3139' }}>
        {/* Header */}
        <div className="border-b px-6 py-4" style={{ background: '#181a20', borderColor: '#2b3139' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: '#eaecef' }}>
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={closeForm}
              className="rounded p-1"
              style={{ color: '#5e6673' }}
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
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#848e9c' }}>
                Task Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputFocusClass}
                style={inputStyle}
                placeholder="Enter task name"
                required
                autoFocus
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#848e9c' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputFocusClass}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#848e9c' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className={inputFocusClass}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#848e9c' }}>
                Color
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full ${TASK_COLORS[c].progress}`}
                    style={{
                      outline: color === c ? '2px solid #f0b90b' : undefined,
                      outlineOffset: color === c ? '2px' : undefined,
                      transform: color === c ? 'scale(1.1)' : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Dependencies */}
            {availableDependencies.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#848e9c' }}>
                  Dependencies
                </label>
                <div className="max-h-32 space-y-1 overflow-auto rounded border p-2" style={{ background: '#181a20', borderColor: '#2b3139' }}>
                  {availableDependencies.map((task) => (
                    <label
                      key={task.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-3 py-2"
                      style={{ color: '#eaecef' }}
                    >
                      <input
                        type="checkbox"
                        checked={dependsOn.includes(task.id)}
                        onChange={() => handleDependencyToggle(task.id)}
                        className="h-4 w-4 rounded"
                        style={{ accentColor: '#f0b90b' }}
                      />
                      <div className={`h-2.5 w-2.5 rounded-full ${TASK_COLORS[task.color].progress}`} />
                      <span className="text-sm">{task.name}</span>
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
                  className="rounded px-3 py-2 text-xs font-semibold"
                  style={{ color: '#f6465d' }}
                >
                  Delete Task
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded border px-5 py-2.5 text-xs font-semibold"
                style={{ borderColor: '#2b3139', background: '#181a20', color: '#848e9c' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded px-5 py-2.5 text-xs font-semibold"
                style={{ background: '#f0b90b', color: '#0b0e11' }}
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
