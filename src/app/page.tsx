'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/context/ProjectsContext';
import { Project, ProjectColor } from '@/types/gantt';
import { storageGet, storageRemove, STORAGE_KEYS } from '@/lib/storage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';

function CloseIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
}

// ─── Color palette ────────────────────────────────────────────

const PROJECT_COLORS: { value: ProjectColor; bg: string; text: string; hex: string }[] = [
  { value: 'blue',   bg: 'bg-blue-500',   text: 'text-blue-500',   hex: '#3b82f6' },
  { value: 'green',  bg: 'bg-success',    text: 'text-success',    hex: '#0ecb81' },
  { value: 'purple', bg: 'bg-purple-500', text: 'text-purple-500', hex: '#8b5cf6' },
  { value: 'orange', bg: 'bg-orange-400', text: 'text-orange-500', hex: '#f97316' },
  { value: 'red',    bg: 'bg-red-500',    text: 'text-red-500',    hex: '#ef4444' },
  { value: 'yellow', bg: 'bg-yellow-400', text: 'text-yellow-500', hex: '#eab308' },
];

function getColorBg(color: ProjectColor) {
  return PROJECT_COLORS.find(c => c.value === color)?.bg ?? 'bg-blue-500';
}
function getColorText(color: ProjectColor) {
  return PROJECT_COLORS.find(c => c.value === color)?.text ?? 'text-blue-500';
}
function getColorHex(color: ProjectColor) {
  return PROJECT_COLORS.find(c => c.value === color)?.hex ?? '#3b82f6';
}

// ─── Project stats (read from localStorage) ───────────────────

interface ProjectStats {
  taskCount: number;
  completedCount: number;
  subtaskCount: number;
  subtasksDone: number;
  startDate: string | null;
  endDate: string | null;
}

const EMPTY_STATS: ProjectStats = {
  taskCount: 0, completedCount: 0, subtaskCount: 0, subtasksDone: 0, startDate: null, endDate: null,
};

type RawTask = { startDate: string; endDate: string; subtasks?: Array<{ completed: boolean }> };

function loadProjectStats(projectId: string): ProjectStats {
  const tasks = storageGet<RawTask[]>(STORAGE_KEYS.tasks(projectId));
  if (!tasks) {
    return EMPTY_STATS;
  }
  try {
    const taskCount = tasks.length;
    const completedCount = tasks.filter(t => {
      const subs = t.subtasks ?? [];
      return subs.length > 0 && subs.every(s => s.completed);
    }).length;
    const subtaskCount = tasks.reduce((s, t) => s + (t.subtasks?.length ?? 0), 0);
    const subtasksDone = tasks.reduce((s, t) => s + (t.subtasks?.filter(sub => sub.completed).length ?? 0), 0);

    const startTimes = tasks.map(t => new Date(t.startDate).getTime()).filter(n => !isNaN(n));
    const endTimes = tasks.map(t => new Date(t.endDate).getTime()).filter(n => !isNaN(n));
    const fmt = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      taskCount,
      completedCount,
      subtaskCount,
      subtasksDone,
      startDate: startTimes.length > 0 ? fmt(Math.min(...startTimes)) : null,
      endDate:   endTimes.length > 0   ? fmt(Math.max(...endTimes))   : null,
    };
  } catch {
    return EMPTY_STATS;
  }
}

// ─── Icons ────────────────────────────────────────────────────

function PlusIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}
function PencilIcon() {
  return <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>;
}
function CalendarIcon() {
  return <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
}
function UsersIcon() {
  return <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
}

// ─── Shared styles ────────────────────────────────────────────

const inputCls = 'w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-sm text-text-secondary placeholder-text-quaternary hover:border-border-secondary focus:border-accent focus:outline-none';

// ─── Color Picker ─────────────────────────────────────────────

function ColorPicker({ value, onChange, activeCustom = false }: { value: ProjectColor; onChange: (c: ProjectColor) => void; activeCustom?: boolean }) {
  return (
    <div className="flex gap-2">
      {PROJECT_COLORS.map(c => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={`h-7 w-7 rounded-full ${c.bg} transition-all ${
            value === c.value && !activeCustom
              ? 'ring-2 ring-text-tertiary ring-offset-2 ring-offset-bg-primary scale-110'
              : 'opacity-60 hover:opacity-100'
          }`}
        />
      ))}
    </div>
  );
}

// ─── New Project Modal ────────────────────────────────────────

function NewProjectModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, desc: string, color: ProjectColor, customColor?: string) => void;
}) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState<ProjectColor>('blue');
  const [customColor, setCustomColor] = useState<string | undefined>();
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const submit = () => { if (name.trim()) onCreate(name.trim(), desc.trim(), color, customColor); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-primary bg-bg-tertiary shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="border-b border-border-primary bg-bg-secondary px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">New Project</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="!p-1"><CloseIcon /></Button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Project name</label>
            <input autoFocus type="text" placeholder="e.g. Website Redesign" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Description <span className="normal-case font-normal text-text-quaternary">(optional)</span></label>
            <textarea placeholder="What is this project about?" value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Color</label>
            <ColorPicker value={color} onChange={c => { setColor(c); setCustomColor(undefined); }} activeCustom={!!customColor} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Custom Color</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => colorPickerRef.current?.click()}
                className={`relative h-10 w-10 rounded-full overflow-hidden transition-transform ${customColor ? 'ring-2 ring-text-tertiary ring-offset-2 scale-110' : 'hover:scale-110'}`}
                style={customColor ? { backgroundColor: customColor } : undefined}
              >
                {!customColor && (
                  <div className="absolute inset-0" style={{ background: 'conic-gradient(from 0deg, #f6465d, #f59e0b, #eab308, #0ecb81, #14b8a6, #1e88e5, #7c3aed, #ec4899, #f6465d)' }} />
                )}
              </button>
              {customColor && <span className="text-sm text-text-secondary font-mono">{customColor.toUpperCase()}</span>}
              <input ref={colorPickerRef} type="color" value={customColor || getColorHex(color)} onChange={e => setCustomColor(e.target.value)} className="sr-only" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={submit} disabled={!name.trim()}>Create Project</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Project Modal ───────────────────────────────────────

function EditProjectModal({ project, onClose, onSave, onDelete }: {
  project: Project;
  onClose: () => void;
  onSave: (id: string, name: string, desc: string, color: ProjectColor, customColor?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState(project.name);
  const [desc, setDesc] = useState(project.description);
  const [color, setColor] = useState<ProjectColor>(project.color);
  const [customColor, setCustomColor] = useState<string | undefined>(project.customColor);
  const [showConfirm, setShowConfirm] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const submit = () => { if (name.trim()) onSave(project.id, name.trim(), desc.trim(), color, customColor); };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-primary bg-bg-tertiary shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="border-b border-border-primary bg-bg-secondary px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">Edit Project</h2>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="!p-1"><CloseIcon /></Button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Project name</label>
              <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Color</label>
              <ColorPicker value={color} onChange={c => { setColor(c); setCustomColor(undefined); }} activeCustom={!!customColor} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">Custom Color</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => colorPickerRef.current?.click()}
                  className={`relative h-10 w-10 rounded-full overflow-hidden transition-transform ${customColor ? 'ring-2 ring-text-tertiary ring-offset-2 scale-110' : 'hover:scale-110'}`}
                  style={customColor ? { backgroundColor: customColor } : undefined}
                >
                  {!customColor && (
                    <div className="absolute inset-0" style={{ background: 'conic-gradient(from 0deg, #f6465d, #f59e0b, #eab308, #0ecb81, #14b8a6, #1e88e5, #7c3aed, #ec4899, #f6465d)' }} />
                  )}
                </button>
                {customColor && <span className="text-sm text-text-secondary font-mono">{customColor.toUpperCase()}</span>}
                <input ref={colorPickerRef} type="color" value={customColor || getColorHex(color)} onChange={e => setCustomColor(e.target.value)} className="sr-only" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={submit} disabled={!name.trim()}>Save Changes</Button>
              </div>
              <Button variant="danger" fullWidth onClick={() => setShowConfirm(true)}>Delete Project</Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title={`Delete "${project.name}"?`}
        message="This will permanently delete the project and all its tasks. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => onDelete(project.id)}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

// ─── Project Card ─────────────────────────────────────────────

function ProjectCard({ project, stats, onClick, onEdit, onDragStart, onDragOver, onDrop, onDragEnd, isDragging, isDragOver }: {
  project: Project;
  stats: ProjectStats;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}) {
  const colorBg = project.customColor ? '' : getColorBg(project.color);
  const colorText = project.customColor ? '' : getColorText(project.color);
  const customStyle = project.customColor ? { color: project.customColor } : undefined;
  const customBgStyle = project.customColor ? { backgroundColor: project.customColor } : undefined;
  const progress = stats.taskCount > 0 ? Math.round((stats.completedCount / stats.taskCount) * 100) : 0;
  const subProgress = stats.subtaskCount > 0 ? Math.round((stats.subtasksDone / stats.subtaskCount) * 100) : 0;
  const isComplete = stats.taskCount > 0 && progress === 100;

  // Prevent click from firing after a drag
  const hasDragged = useRef(false);

  const handleDragStart = (e: React.DragEvent) => {
    hasDragged.current = true;
    onDragStart(e);
  };

  const handleClick = () => {
    if (hasDragged.current) { hasDragged.current = false; return; }
    onClick();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={() => { onDragEnd(); }}
      onClick={handleClick}
      className={`group relative flex flex-col bg-bg-primary border rounded-2xl p-6 cursor-grab active:cursor-grabbing transition-all
        ${isDragging ? 'opacity-40 scale-[0.97] border-border-primary shadow-none' : ''}
        ${isDragOver && !isDragging ? 'border-accent shadow-lg shadow-accent/10 scale-[1.01]' : ''}
        ${!isDragging && !isDragOver ? 'border-border-primary hover:border-border-secondary hover:shadow-lg' : ''}`}
    >
      {/* Color stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${colorBg}`} style={customBgStyle} />

      {/* Edit button */}
      <button
        onClick={onEdit}
        aria-label={`Edit project ${project.name}`}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
      >
        <PencilIcon />
      </button>

      {/* Header */}
      <div className="mt-1 pr-6">
        <div className="flex items-start gap-2">
          <h3 className="min-w-0 break-words font-semibold text-text-primary text-base leading-snug group-hover:text-accent transition-colors">
            {project.name}
          </h3>
          {isComplete && (
            <span className="flex-shrink-0 mt-0.5 text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
              DONE
            </span>
          )}
        </div>
        {project.description && (
          <p className="text-xs text-text-tertiary mt-1 line-clamp-3 break-words leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-medium ${colorText}`} style={customStyle}>{stats.completedCount} / {stats.taskCount} tasks</span>
          <span className={`text-xs font-semibold ${colorText}`} style={customStyle}>{progress}%</span>
        </div>
        <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isComplete ? 'bg-success' : colorBg}`}
            style={{ width: `${progress}%`, ...(isComplete ? {} : customBgStyle) }}
          />
        </div>

        {stats.subtaskCount > 0 && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs ${colorText} opacity-60`} style={customStyle}>{stats.subtasksDone} / {stats.subtaskCount} subtasks</span>
              <span className={`text-xs ${colorText} opacity-60`} style={customStyle}>{subProgress}%</span>
            </div>
            <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all opacity-50 ${colorBg}`}
                style={{ width: `${subProgress}%`, ...customBgStyle }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-primary">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-text-tertiary">
            <CalendarIcon />
            {stats.startDate && stats.endDate
              ? `${stats.startDate} — ${stats.endDate}`
              : 'No tasks yet'}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-tertiary">
            <UsersIcon />
            1
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-text-tertiary group-hover:text-accent transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h8M3 10h13M3 15h6M3 20h10" /></svg>
          Open
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = useProjects();
  const [statsMap, setStatsMap] = useState<Record<string, ProjectStats>>({});
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Load stats from localStorage on mount and when projects change
  useEffect(() => {
    const map: Record<string, ProjectStats> = {};
    projects.forEach(p => { map[p.id] = loadProjectStats(p.id); });
    setStatsMap(map);
  }, [projects]);

  const handleCreate = (name: string, desc: string, color: ProjectColor, customColor?: string) => {
    const project = addProject(name, desc, color, customColor);
    setShowNew(false);
    router.push(`/projects/${project.id}`);
  };

  const handleSave = (id: string, name: string, desc: string, color: ProjectColor, customColor?: string) => {
    updateProject(id, name, desc, color, customColor);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    storageRemove(STORAGE_KEYS.tasks(id));
    storageRemove(STORAGE_KEYS.kanban(id));
    deleteProject(id);
    setEditing(null);
  };

  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (toIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      reorderProjects(draggedIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const totalTasks = Object.values(statsMap).reduce((s, st) => s + st.taskCount, 0);
  const doneTasks  = Object.values(statsMap).reduce((s, st) => s + st.completedCount, 0);
  const activeProjects = projects.filter(p => {
    const st = statsMap[p.id];
    return st ? st.taskCount > 0 && st.completedCount < st.taskCount : true;
  }).length;
  const completedProjects = projects.filter(p => {
    const st = statsMap[p.id];
    return st ? st.taskCount > 0 && st.completedCount === st.taskCount : false;
  }).length;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">My Projects</h1>
            <p className="text-text-tertiary text-sm mt-1">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} · {doneTasks} / {totalTasks} tasks done
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-text text-sm font-semibold hover:bg-accent-hover transition-colors"
          >
            <PlusIcon />
            New Project
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active',      value: activeProjects },
            { label: 'Completed',   value: completedProjects },
            { label: 'Total tasks', value: totalTasks },
          ].map(s => (
            <div key={s.label} className="bg-bg-primary border border-border-primary rounded-2xl px-5 py-4">
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              stats={statsMap[project.id] ?? { taskCount: 0, completedCount: 0, subtaskCount: 0, subtasksDone: 0, startDate: null, endDate: null }}
              onClick={() => router.push(`/projects/${project.id}`)}
              onEdit={e => { e.stopPropagation(); setEditing(project); }}
              onDragStart={e => handleDragStart(index, e)}
              onDragOver={e => handleDragOver(index, e)}
              onDrop={e => handleDrop(index, e)}
              onDragEnd={handleDragEnd}
              isDragging={draggedIndex === index}
              isDragOver={dragOverIndex === index}
            />
          ))}
          <button
            onClick={() => setShowNew(true)}
            className="border-2 border-dashed border-border-secondary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-text-quaternary hover:text-text-tertiary hover:border-border-primary transition-all min-h-[200px]"
          >
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-current flex items-center justify-center">
              <PlusIcon />
            </div>
            <span className="text-sm">New Project</span>
          </button>
        </div>

      </div>

      {showNew && (
        <NewProjectModal onClose={() => setShowNew(false)} onCreate={handleCreate} />
      )}
      {editing && (
        <EditProjectModal
          project={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
