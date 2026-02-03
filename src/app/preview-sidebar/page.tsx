'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock data
const mockTasks = [
  { id: '1', name: 'Design System Setup', color: 'blue', progress: 100, startDate: 'Jan 15', endDate: 'Jan 20', dependsOn: [] },
  { id: '2', name: 'API Integration', color: 'green', progress: 65, startDate: 'Jan 18', endDate: 'Feb 5', dependsOn: ['Design System Setup'] },
  { id: '3', name: 'User Authentication', color: 'purple', progress: 30, startDate: 'Jan 25', endDate: 'Feb 10', dependsOn: ['API Integration'] },
];

const COLORS: Record<string, { bg: string; border: string; dot: string; progress: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', progress: 'bg-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', progress: 'bg-green-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500', progress: 'bg-purple-500' },
};

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ChevronIcon({ className, expanded }: { className?: string; expanded?: boolean }) {
  return (
    <svg className={`${className} transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

// Variant A: Clean List (Binance-inspired)
function SidebarVariantA() {
  const [expanded, setExpanded] = useState<string | null>('2');
  const [selected, setSelected] = useState<string | null>('2');

  return (
    <div className="w-72 border-r border-border-primary bg-bg-primary h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">Tasks</span>
          <span className="text-xs text-text-tertiary">{mockTasks.length}</span>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover">
          <PlusIcon className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;
          const isSelected = selected === task.id;

          return (
            <div
              key={task.id}
              className={`border-b border-border-primary ${isSelected ? 'bg-bg-secondary' : ''}`}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg-hover"
                onClick={() => {
                  setSelected(task.id);
                  setExpanded(isExpanded ? null : task.id);
                }}
              >
                <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                <span className="flex-1 text-sm font-medium text-text-primary truncate">
                  {task.name}
                </span>
                <ChevronIcon className="h-4 w-4 text-text-tertiary" expanded={isExpanded} />
              </div>

              {isExpanded && (
                <div className="px-4 pb-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>{task.startDate} — {task.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                      <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{task.progress}%</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded">
                      <EditIcon className="h-3 w-3" /> Edit
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-danger hover:bg-danger-light rounded">
                      <TrashIcon className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Variant B: Card Style (Coinbase-inspired)
function SidebarVariantB() {
  const [selected, setSelected] = useState<string | null>('2');

  return (
    <div className="w-72 bg-bg-secondary h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12">
        <span className="text-sm font-semibold text-text-primary">Tasks</span>
        <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-accent text-accent-text hover:bg-accent-hover">
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-auto px-3 pb-3 space-y-2">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isSelected = selected === task.id;

          return (
            <div
              key={task.id}
              className={`rounded-xl bg-bg-primary p-3 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-accent shadow-md' : 'hover:shadow-md'
              }`}
              onClick={() => setSelected(task.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                  <span className="text-sm font-semibold text-text-primary">{task.name}</span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg text-text-tertiary hover:bg-bg-hover hover:text-text-primary">
                    <EditIcon className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg text-text-tertiary hover:bg-danger-light hover:text-danger">
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-text-tertiary mb-2">
                {task.startDate} — {task.endDate}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-bg-tertiary rounded-full overflow-hidden">
                  <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                </div>
                <span className="text-xs font-semibold text-text-secondary">{task.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Variant C: Minimal Rows (Trading-style)
function SidebarVariantC() {
  const [selected, setSelected] = useState<string | null>('2');

  return (
    <div className="w-72 border-r border-border-primary bg-bg-primary h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-border-primary bg-bg-secondary">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Tasks</span>
        <button className="text-xs font-semibold text-accent hover:text-accent-hover">+ New</button>
      </div>

      {/* Compact rows */}
      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isSelected = selected === task.id;

          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 px-4 py-2.5 border-b border-border-primary cursor-pointer ${
                isSelected ? 'bg-accent-light' : 'hover:bg-bg-hover'
              }`}
              onClick={() => setSelected(task.id)}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                <div className="text-[10px] text-text-tertiary">{task.startDate} — {task.endDate}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-text-primary">{task.progress}%</div>
                <div className="w-12 h-1 bg-bg-tertiary rounded-full overflow-hidden mt-1">
                  <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Variant D: Accent Left Border
function SidebarVariantD() {
  const [expanded, setExpanded] = useState<string | null>('2');
  const [selected, setSelected] = useState<string | null>('2');

  return (
    <div className="w-72 bg-bg-primary h-[400px] flex flex-col">
      {/* Header with underline style */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <div className="relative py-3">
          <span className="text-sm font-medium text-accent">Tasks</span>
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
        </div>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          New Task
        </button>
      </div>

      {/* List with left border accent */}
      <div className="flex-1 overflow-auto py-2">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;
          const isSelected = selected === task.id;

          return (
            <div
              key={task.id}
              className={`mx-2 mb-2 rounded-lg overflow-hidden border transition-all ${
                isSelected ? 'border-accent bg-bg-secondary' : 'border-transparent hover:bg-bg-hover'
              }`}
            >
              <div
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                onClick={() => {
                  setSelected(task.id);
                  setExpanded(isExpanded ? null : task.id);
                }}
              >
                <div className={`w-1 h-8 rounded-full ${colors.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                  <div className="text-xs text-text-tertiary">{task.progress}% complete</div>
                </div>
                <ChevronIcon className="h-4 w-4 text-text-tertiary" expanded={isExpanded} />
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 ml-4 border-l-2 border-border-primary space-y-2">
                  <div className="text-xs text-text-secondary pl-3">
                    <CalendarIcon className="h-3 w-3 inline mr-1.5" />
                    {task.startDate} — {task.endDate}
                  </div>
                  {task.dependsOn.length > 0 && (
                    <div className="text-xs text-text-tertiary pl-3">
                      Depends on: {task.dependsOn.join(', ')}
                    </div>
                  )}
                  <div className="flex gap-2 pl-3 pt-1">
                    <button className="text-xs text-text-secondary hover:text-accent">Edit</button>
                    <button className="text-xs text-text-secondary hover:text-danger">Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Variant E: Floating Cards
function SidebarVariantE() {
  const [selected, setSelected] = useState<string | null>('2');

  return (
    <div className="w-72 bg-bg-tertiary h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 bg-bg-primary border-b border-border-primary">
        <div>
          <div className="text-sm font-semibold text-text-primary">My Tasks</div>
          <div className="text-xs text-text-tertiary">{mockTasks.length} active</div>
        </div>
        <button className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          <PlusIcon className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Floating cards */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isSelected = selected === task.id;

          return (
            <div
              key={task.id}
              className={`rounded-2xl bg-bg-primary border-2 p-4 cursor-pointer transition-all ${
                isSelected ? 'border-accent shadow-lg' : 'border-transparent shadow-sm hover:shadow-md'
              }`}
              onClick={() => setSelected(task.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${colors.bg} text-${task.color}-600`}>
                  {task.progress === 100 ? 'Done' : 'In Progress'}
                </div>
                <div className="flex gap-1">
                  <button className="p-1 rounded text-text-tertiary hover:text-text-primary">
                    <EditIcon className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1 rounded text-text-tertiary hover:text-danger">
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-sm font-semibold text-text-primary mb-1">{task.name}</div>
              <div className="text-xs text-text-tertiary mb-3">{task.startDate} — {task.endDate}</div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                </div>
                <span className="text-xs font-bold text-text-primary">{task.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PreviewSidebar() {
  return (
    <div className="min-h-screen bg-bg-secondary p-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Sidebar Variants Preview</h1>
          <p className="text-text-secondary">Click on tasks to see selection/expansion states</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Variant A */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">A: Clean List</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantA />
            </div>
          </div>

          {/* Variant B */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">B: Card Style</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantB />
            </div>
          </div>

          {/* Variant C */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">C: Minimal Rows</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantC />
            </div>
          </div>

          {/* Variant D */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">D: Left Border Accent</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantD />
            </div>
          </div>

          {/* Variant E */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">E: Floating Cards</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantE />
            </div>
          </div>
        </div>

        <div className="pt-8 text-center">
          <Link
            href="/"
            className="text-sm text-accent hover:text-accent-hover font-medium"
          >
            ← Back to app
          </Link>
        </div>
      </div>
    </div>
  );
}
