'use client';

import { useState, useRef, useEffect } from 'react';
import { useGantt } from '@/context/GanttContext';
import { TASK_COLORS, Task, Subtask, getTaskColorStyles } from '@/types/gantt';
import { TaskForm } from '@/components/gantt/TaskForm';
import { calculateTaskProgress, formatDateShort } from '@/utils/dateUtils';
import { generateUUID } from '@/utils/helpers';

// Storage key for custom columns
const COLUMNS_STORAGE_KEY = 'kanban-columns';

interface Column {
  id: string;
  title: string;
  color: string;
}

const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-text-tertiary' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-warning' },
  { id: 'done', title: 'Completed', color: 'bg-success' },
];

function loadColumns(): Column[] {
  if (typeof window === 'undefined') return DEFAULT_COLUMNS;
  const stored = localStorage.getItem(COLUMNS_STORAGE_KEY);
  if (!stored) return DEFAULT_COLUMNS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_COLUMNS;
  }
}

function saveColumns(columns: Column[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
}

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

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function DragIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

interface SubtaskItemProps {
  taskId: string;
  subtask: Subtask;
  index: number;
  colorClass: string;
  colorStyle?: string;
  onToggle: (e: React.MouseEvent) => void;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  isDragging: boolean;
}

function SubtaskItem({
  subtask,
  index,
  colorClass,
  colorStyle,
  onToggle,
  onClick,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: SubtaskItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={`group flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all ${
        isDragging ? 'opacity-50 bg-bg-tertiary' : 'hover:bg-bg-hover'
      }`}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div className="mt-1 cursor-grab active:cursor-grabbing text-text-quaternary opacity-0 group-hover:opacity-100 transition-opacity">
        <DragIcon className="h-4 w-4" />
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`mt-0.5 h-5 w-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          subtask.completed
            ? `${colorClass} border-transparent`
            : 'border-border-secondary hover:border-border-focus'
        }`}
        style={subtask.completed && colorStyle ? { backgroundColor: colorStyle } : undefined}
      >
        {subtask.completed && <CheckIcon className="h-3 w-3 text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className={`text-sm block ${
          subtask.completed ? 'text-text-tertiary line-through' : 'text-text-primary'
        }`}>
          {subtask.name}
        </span>
        {subtask.comment && (
          <div className="flex items-start gap-1.5 mt-1">
            <CommentIcon className="h-3.5 w-3.5 text-text-quaternary flex-shrink-0 mt-0.5" />
            <span className="text-xs text-text-tertiary line-clamp-2">{subtask.comment}</span>
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1 rounded text-text-quaternary opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger-light transition-all"
        title="Delete"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onEditSubtask: (task: Task, subtask: Subtask) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onReorderSubtasks: (taskId: string, fromIndex: number, toIndex: number) => void;
}

function TaskCard({
  task,
  onToggleSubtask,
  onAddSubtask,
  onEditTask,
  onEditSubtask,
  onDeleteSubtask,
  onReorderSubtasks,
}: TaskCardProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const progress = calculateTaskProgress(task.subtasks);
  const colorStyles = getTaskColorStyles(task);
  const colors = colorStyles.classes;
  const subtasks = task.subtasks || [];
  const completedCount = subtasks.filter(s => s.completed).length;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndex;
    if (fromIndex !== null && fromIndex !== toIndex) {
      onReorderSubtasks(task.id, fromIndex, toIndex);
    }
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="bg-bg-primary rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`h-10 w-1.5 rounded-full flex-shrink-0 ${colors.progress}`}
              style={colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
            />
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
            <EditIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.progress} transition-all duration-300`}
              style={{
                width: `${progress}%`,
                ...(colorStyles.progressColor && { backgroundColor: colorStyles.progressColor })
              }}
            />
          </div>
          <span className="text-xs font-bold text-text-secondary tabular-nums w-12 text-right">
            {progress}%
          </span>
        </div>
      </div>

      {/* Subtasks */}
      <div className="p-3" onDragEnd={handleDragEnd}>
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
            <div className="space-y-0.5">
              {subtasks.map((subtask, index) => (
                <SubtaskItem
                  key={subtask.id}
                  taskId={task.id}
                  subtask={subtask}
                  index={index}
                  colorClass={colors.progress}
                  colorStyle={colorStyles.progressColor}
                  onToggle={(e) => {
                    e.stopPropagation();
                    onToggleSubtask(task.id, subtask.id);
                  }}
                  onClick={() => onEditSubtask(task, subtask)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    onDeleteSubtask(task.id, subtask.id);
                  }}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={dragIndex === index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-text-tertiary mb-2">No subtasks yet</p>
          </div>
        )}

        {/* Add subtask button - accent color on hover */}
        <button
          onClick={() => onAddSubtask(task)}
          className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-border-secondary text-text-tertiary hover:text-accent hover:border-accent hover:bg-accent-light transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Add subtask</span>
        </button>
      </div>
    </div>
  );
}

interface SubtaskModalProps {
  task: Task;
  subtask?: Subtask;
  onClose: () => void;
  onSave: (taskId: string, subtask: Subtask) => void;
  onDelete?: () => void;
}

function SubtaskModal({ task, subtask, onClose, onSave, onDelete }: SubtaskModalProps) {
  const [name, setName] = useState(subtask?.name || '');
  const [comment, setComment] = useState(subtask?.comment || '');
  const isEditing = !!subtask;
  const colorStyles = getTaskColorStyles(task);
  const colors = colorStyles.classes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(task.id, {
        id: subtask?.id || generateUUID(),
        name: name.trim(),
        completed: subtask?.completed || false,
        comment: comment.trim() || undefined,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Header with task color */}
          <div
            className={`h-2 ${colors.progress}`}
            style={colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
          />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {isEditing ? 'Edit Subtask' : 'Add Subtask'}
                </h3>
                <p className="text-sm text-text-tertiary mt-0.5">
                  {isEditing ? 'Update' : 'Adding to'} <span className="font-medium text-text-secondary">{task.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter subtask name..."
                  className="w-full px-4 py-3 rounded-xl border border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  autoFocus
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Comment <span className="text-text-tertiary font-normal">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or description..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border-primary bg-bg-secondary space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border-secondary bg-transparent px-4 py-2.5 text-sm font-semibold text-text-secondary hover:border-text-tertiary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-text hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Save' : 'Add'}
              </button>
            </div>
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="w-full rounded-xl border border-danger bg-transparent px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger-light transition-colors"
              >
                Delete Subtask
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddColumnModalProps {
  onClose: () => void;
  onAdd: (title: string) => void;
}

function AddColumnModal({ onClose, onAdd }: AddColumnModalProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-base font-bold text-text-primary mb-4">Add Column</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Column name..."
              className="w-full px-4 py-3 rounded-xl border border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>
          <div className="p-4 border-t border-border-primary bg-bg-secondary">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border-secondary bg-transparent px-4 py-2.5 text-sm font-semibold text-text-secondary hover:border-text-tertiary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-text hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditColumnModalProps {
  column: Column;
  onClose: () => void;
  onSave: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

function EditColumnModal({ column, onClose, onSave, onDelete }: EditColumnModalProps) {
  const [title, setTitle] = useState(column.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(column.id, title.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-base font-bold text-text-primary mb-4">Edit Column</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Column name..."
              className="w-full px-4 py-3 rounded-xl border border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>
          <div className="p-4 border-t border-border-primary bg-bg-secondary space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border-secondary bg-transparent px-4 py-2.5 text-sm font-semibold text-text-secondary hover:border-text-tertiary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-text hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onDelete(column.id);
                onClose();
              }}
              className="w-full rounded-xl border border-danger bg-transparent px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger-light transition-colors"
            >
              Delete Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BoardsPage() {
  const { state, toggleSubtask, updateSubtask, deleteSubtask, reorderSubtasks, updateTask, openForm } = useGantt();

  // Columns state
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal states
  const [subtaskModal, setSubtaskModal] = useState<{ task: Task; subtask?: Subtask } | null>(null);
  const [addColumnModal, setAddColumnModal] = useState(false);
  const [editColumnModal, setEditColumnModal] = useState<Column | null>(null);

  // Load columns on mount
  useEffect(() => {
    setColumns(loadColumns());
    setIsLoaded(true);
  }, []);

  // Save columns when changed
  useEffect(() => {
    if (isLoaded) {
      saveColumns(columns);
    }
  }, [columns, isLoaded]);

  const handleSaveSubtask = (taskId: string, subtask: Subtask) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const existingSubtask = task.subtasks?.find(s => s.id === subtask.id);
    if (existingSubtask) {
      updateSubtask(taskId, subtask);
    } else {
      updateTask({
        ...task,
        subtasks: [...(task.subtasks || []), subtask],
      });
    }
  };

  const handleDeleteSubtaskFromModal = () => {
    if (subtaskModal?.subtask) {
      deleteSubtask(subtaskModal.task.id, subtaskModal.subtask.id);
      setSubtaskModal(null);
    }
  };

  const handleAddColumn = (title: string) => {
    const newColumn: Column = {
      id: generateUUID(),
      title,
      color: 'bg-accent',
    };
    setColumns([...columns, newColumn]);
  };

  const handleEditColumn = (id: string, title: string) => {
    setColumns(columns.map(c => c.id === id ? { ...c, title } : c));
  };

  const handleDeleteColumn = (id: string) => {
    setColumns(columns.filter(c => c.id !== id));
  };

  // Filter tasks by progress for default columns, or show all for custom
  const getTasksForColumn = (column: Column) => {
    const progress = (t: Task) => calculateTaskProgress(t.subtasks);

    switch (column.id) {
      case 'todo':
        return state.tasks.filter(t => progress(t) === 0);
      case 'in-progress':
        return state.tasks.filter(t => {
          const p = progress(t);
          return p > 0 && p < 100;
        });
      case 'done':
        return state.tasks.filter(t => progress(t) === 100);
      default:
        // Custom columns - for now empty (could be extended for manual task assignment)
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-full mx-auto p-6">
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
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => {
              const columnTasks = getTasksForColumn(column);
              const isDefaultColumn = ['todo', 'in-progress', 'done'].includes(column.id);

              return (
                <div key={column.id} className="flex-shrink-0 w-80 space-y-4">
                  {/* Column Header */}
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${column.color}`} />
                    <h2
                      className={`text-sm font-bold text-text-primary ${!isDefaultColumn ? 'cursor-pointer hover:text-accent' : ''}`}
                      onClick={() => !isDefaultColumn && setEditColumnModal(column)}
                    >
                      {column.title}
                    </h2>
                    <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                      {columnTasks.length}
                    </span>
                    {!isDefaultColumn && (
                      <button
                        onClick={() => setEditColumnModal(column)}
                        className="ml-auto p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-hover"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleSubtask={toggleSubtask}
                        onAddSubtask={(t) => setSubtaskModal({ task: t })}
                        onEditTask={openForm}
                        onEditSubtask={(t, s) => setSubtaskModal({ task: t, subtask: s })}
                        onDeleteSubtask={deleteSubtask}
                        onReorderSubtasks={reorderSubtasks}
                      />
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="rounded-xl border border-dashed border-border-secondary p-6 text-center">
                        <p className="text-xs text-text-tertiary">No tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add Column Button */}
            <div className="flex-shrink-0 w-80">
              <button
                onClick={() => setAddColumnModal(true)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border-secondary text-text-tertiary hover:text-accent hover:border-accent hover:bg-accent-light transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Add column</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subtask Modal (Add/Edit) */}
      {subtaskModal && (
        <SubtaskModal
          task={subtaskModal.task}
          subtask={subtaskModal.subtask}
          onClose={() => setSubtaskModal(null)}
          onSave={handleSaveSubtask}
          onDelete={subtaskModal.subtask ? handleDeleteSubtaskFromModal : undefined}
        />
      )}

      {/* Add Column Modal */}
      {addColumnModal && (
        <AddColumnModal
          onClose={() => setAddColumnModal(false)}
          onAdd={handleAddColumn}
        />
      )}

      {/* Edit Column Modal */}
      {editColumnModal && (
        <EditColumnModal
          column={editColumnModal}
          onClose={() => setEditColumnModal(null)}
          onSave={handleEditColumn}
          onDelete={handleDeleteColumn}
        />
      )}

      {/* Task Form for editing main tasks */}
      <TaskForm />
    </div>
  );
}
