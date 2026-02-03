'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock data with subtasks
const mockTasks = [
  {
    id: '1',
    name: 'Design System Setup',
    color: 'blue',
    progress: 100,
    startDate: 'Jan 15',
    endDate: 'Jan 20',
    dependsOn: [],
    dependsOnNames: [],
    subtasks: [
      { id: 's1', name: 'Color palette', completed: true },
      { id: 's2', name: 'Typography', completed: true },
      { id: 's3', name: 'Components', completed: true },
    ]
  },
  {
    id: '2',
    name: 'API Integration',
    color: 'green',
    progress: 65,
    startDate: 'Jan 18',
    endDate: 'Feb 5',
    dependsOn: ['1'],
    dependsOnNames: ['Design System Setup'],
    subtasks: [
      { id: 's4', name: 'Auth endpoints', completed: true },
      { id: 's5', name: 'Data fetching', completed: true },
      { id: 's6', name: 'Error handling', completed: false },
      { id: 's7', name: 'Caching', completed: false },
    ]
  },
  {
    id: '3',
    name: 'User Authentication',
    color: 'purple',
    progress: 30,
    startDate: 'Jan 25',
    endDate: 'Feb 10',
    dependsOn: ['1', '2'],
    dependsOnNames: ['Design System Setup', 'API Integration'],
    subtasks: [
      { id: 's8', name: 'Login form', completed: true },
      { id: 's9', name: 'Registration', completed: false },
      { id: 's10', name: 'Password reset', completed: false },
    ]
  },
];

const COLORS: Record<string, { bg: string; border: string; dot: string; progress: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', progress: 'bg-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', progress: 'bg-green-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500', progress: 'bg-purple-500' },
};

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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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

// Variant D: Current favorite (unchanged)
function SidebarVariantD() {
  const [expanded, setExpanded] = useState<string | null>('2');

  return (
    <div className="w-80 border-r border-border-primary bg-bg-primary h-[450px] flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <span className="text-sm font-semibold text-text-primary">Tasks</span>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;

          return (
            <div
              key={task.id}
              className={`border-b border-border-primary transition-colors ${isExpanded ? 'bg-bg-secondary' : ''}`}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${!isExpanded ? 'hover:bg-bg-hover' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : task.id)}
              >
                <div className={`h-8 w-1 rounded-full flex-shrink-0 ${colors.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-8">{task.progress}%</span>
                  <ChevronIcon className="h-3.5 w-3.5 text-text-tertiary" expanded={isExpanded} />
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3">
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-xs font-bold text-text-primary">{task.startDate}</div>
                      <div className="text-[9px] text-text-tertiary uppercase">Start</div>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-xs font-bold text-text-primary">{task.endDate}</div>
                      <div className="text-[9px] text-text-tertiary uppercase">End</div>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-xs font-bold text-text-primary">{task.dependsOn.length}</div>
                      <div className="text-[9px] text-text-tertiary uppercase">Deps</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-danger bg-danger-light hover:bg-danger/20 rounded-lg transition-colors">
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors">
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
    </div>
  );
}

// Variant E: Grid 4 cols (Start, End, Deps, Subs)
function SidebarVariantE() {
  const [expanded, setExpanded] = useState<string | null>('2');

  return (
    <div className="w-80 border-r border-border-primary bg-bg-primary h-[520px] flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <span className="text-sm font-semibold text-text-primary">Tasks</span>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;
          const completedSubs = task.subtasks.filter(s => s.completed).length;

          return (
            <div
              key={task.id}
              className={`border-b border-border-primary transition-colors ${isExpanded ? 'bg-bg-secondary' : ''}`}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${!isExpanded ? 'hover:bg-bg-hover' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : task.id)}
              >
                <div className={`h-8 w-1 rounded-full flex-shrink-0 ${colors.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-8">{task.progress}%</span>
                  <ChevronIcon className="h-3.5 w-3.5 text-text-tertiary" expanded={isExpanded} />
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3">
                  {/* 4 column grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-center mb-3">
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-[10px] font-bold text-text-primary">{task.startDate}</div>
                      <div className="text-[8px] text-text-tertiary uppercase">Start</div>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-[10px] font-bold text-text-primary">{task.endDate}</div>
                      <div className="text-[8px] text-text-tertiary uppercase">End</div>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-[10px] font-bold text-text-primary">{task.dependsOn.length}</div>
                      <div className="text-[8px] text-text-tertiary uppercase">Deps</div>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-[10px] font-bold text-text-primary">{completedSubs}/{task.subtasks.length}</div>
                      <div className="text-[8px] text-text-tertiary uppercase">Subs</div>
                    </div>
                  </div>

                  {/* Subtasks list */}
                  {task.subtasks.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {task.subtasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2 text-xs">
                          <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${
                            sub.completed ? 'bg-accent border-accent' : 'border-border-secondary'
                          }`}>
                            {sub.completed && <CheckIcon className="h-2.5 w-2.5 text-accent-text" />}
                          </div>
                          <span className={sub.completed ? 'text-text-tertiary line-through' : 'text-text-secondary'}>
                            {sub.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-danger bg-danger-light hover:bg-danger/20 rounded-lg transition-colors">
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors">
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
    </div>
  );
}

// Variant F: 2 rows grid (dates top, deps/subs bottom) + lists
function SidebarVariantF() {
  const [expanded, setExpanded] = useState<string | null>('2');

  return (
    <div className="w-80 border-r border-border-primary bg-bg-primary h-[520px] flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <span className="text-sm font-semibold text-text-primary">Tasks</span>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;
          const completedSubs = task.subtasks.filter(s => s.completed).length;

          return (
            <div
              key={task.id}
              className={`border-b border-border-primary transition-colors ${isExpanded ? 'bg-bg-secondary' : ''}`}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${!isExpanded ? 'hover:bg-bg-hover' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : task.id)}
              >
                <div className={`h-8 w-1 rounded-full flex-shrink-0 ${colors.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-8">{task.progress}%</span>
                  <ChevronIcon className="h-3.5 w-3.5 text-text-tertiary" expanded={isExpanded} />
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3">
                  {/* Row 1: Dates */}
                  <div className="grid grid-cols-2 gap-2 text-center mb-2">
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-xs font-bold text-text-primary">{task.startDate}</div>
                      <div className="text-[9px] text-text-tertiary uppercase">Start</div>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-xs font-bold text-text-primary">{task.endDate}</div>
                      <div className="text-[9px] text-text-tertiary uppercase">End</div>
                    </div>
                  </div>

                  {/* Row 2: Deps & Subs counts */}
                  <div className="grid grid-cols-2 gap-2 text-center mb-3">
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-xs font-bold text-text-primary">{task.dependsOn.length}</div>
                      <div className="text-[9px] text-text-tertiary uppercase">Dependencies</div>
                    </div>
                    <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                      <div className="text-xs font-bold text-text-primary">{completedSubs}/{task.subtasks.length}</div>
                      <div className="text-[9px] text-text-tertiary uppercase">Subtasks</div>
                    </div>
                  </div>

                  {/* Dependencies list */}
                  {task.dependsOnNames.length > 0 && (
                    <div className="mb-2 p-2 bg-bg-primary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary uppercase mb-1.5">
                        <LinkIcon className="h-3 w-3" />
                        Blocked by
                      </div>
                      <div className="space-y-1">
                        {task.dependsOnNames.map((name, i) => (
                          <div key={i} className="text-xs text-text-secondary truncate">• {name}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subtasks list */}
                  {task.subtasks.length > 0 && (
                    <div className="mb-3 p-2 bg-bg-primary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary uppercase mb-1.5">
                        <ListIcon className="h-3 w-3" />
                        Subtasks
                      </div>
                      <div className="space-y-1">
                        {task.subtasks.map((sub) => (
                          <div key={sub.id} className="flex items-center gap-2 text-xs">
                            <div className={`h-3 w-3 rounded border flex items-center justify-center ${
                              sub.completed ? 'bg-accent border-accent' : 'border-border-secondary'
                            }`}>
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

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-danger bg-danger-light hover:bg-danger/20 rounded-lg transition-colors">
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors">
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
    </div>
  );
}

// Variant G: Compact with collapsible sections
function SidebarVariantG() {
  const [expanded, setExpanded] = useState<string | null>('2');
  const [showSubs, setShowSubs] = useState(true);
  const [showDeps, setShowDeps] = useState(true);

  return (
    <div className="w-80 border-r border-border-primary bg-bg-primary h-[520px] flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <span className="text-sm font-semibold text-text-primary">Tasks</span>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;
          const completedSubs = task.subtasks.filter(s => s.completed).length;

          return (
            <div
              key={task.id}
              className={`border-b border-border-primary transition-colors ${isExpanded ? 'bg-bg-secondary' : ''}`}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${!isExpanded ? 'hover:bg-bg-hover' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : task.id)}
              >
                <div className={`h-8 w-1 rounded-full flex-shrink-0 ${colors.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-8">{task.progress}%</span>
                  <ChevronIcon className="h-3.5 w-3.5 text-text-tertiary" expanded={isExpanded} />
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3">
                  {/* Inline stats */}
                  <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                    <span>{task.startDate} → {task.endDate}</span>
                    <span className="text-text-quaternary">•</span>
                    <span>{task.dependsOn.length} deps</span>
                    <span className="text-text-quaternary">•</span>
                    <span>{completedSubs}/{task.subtasks.length} subs</span>
                  </div>

                  {/* Collapsible Dependencies */}
                  {task.dependsOnNames.length > 0 && (
                    <div className="mb-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDeps(!showDeps); }}
                        className="flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary uppercase mb-1 hover:text-text-secondary"
                      >
                        <ChevronIcon className="h-2.5 w-2.5" expanded={showDeps} />
                        Dependencies ({task.dependsOnNames.length})
                      </button>
                      {showDeps && (
                        <div className="ml-4 space-y-0.5">
                          {task.dependsOnNames.map((name, i) => (
                            <div key={i} className="text-xs text-text-secondary flex items-center gap-1.5">
                              <LinkIcon className="h-3 w-3 text-text-quaternary" />
                              {name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collapsible Subtasks */}
                  {task.subtasks.length > 0 && (
                    <div className="mb-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowSubs(!showSubs); }}
                        className="flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary uppercase mb-1 hover:text-text-secondary"
                      >
                        <ChevronIcon className="h-2.5 w-2.5" expanded={showSubs} />
                        Subtasks ({completedSubs}/{task.subtasks.length})
                      </button>
                      {showSubs && (
                        <div className="ml-4 space-y-1">
                          {task.subtasks.map((sub) => (
                            <div key={sub.id} className="flex items-center gap-2 text-xs">
                              <div className={`h-3 w-3 rounded border flex items-center justify-center ${
                                sub.completed ? 'bg-accent border-accent' : 'border-border-secondary'
                              }`}>
                                {sub.completed && <CheckIcon className="h-2 w-2 text-accent-text" />}
                              </div>
                              <span className={sub.completed ? 'text-text-tertiary line-through' : 'text-text-secondary'}>
                                {sub.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-danger bg-danger-light hover:bg-danger/20 rounded-lg transition-colors">
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors">
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
    </div>
  );
}

// Variant H: Tabs for Details/Subtasks/Deps
function SidebarVariantH() {
  const [expanded, setExpanded] = useState<string | null>('2');
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'deps'>('subtasks');

  return (
    <div className="w-80 border-r border-border-primary bg-bg-primary h-[520px] flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-primary">
        <span className="text-sm font-semibold text-text-primary">Tasks</span>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-text hover:bg-accent-hover">
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {mockTasks.map((task) => {
          const colors = COLORS[task.color];
          const isExpanded = expanded === task.id;
          const completedSubs = task.subtasks.filter(s => s.completed).length;

          return (
            <div
              key={task.id}
              className={`border-b border-border-primary transition-colors ${isExpanded ? 'bg-bg-secondary' : ''}`}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${!isExpanded ? 'hover:bg-bg-hover' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : task.id)}
              >
                <div className={`h-8 w-1 rounded-full flex-shrink-0 ${colors.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{task.name}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className={`h-full ${colors.progress}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-8">{task.progress}%</span>
                  <ChevronIcon className="h-3.5 w-3.5 text-text-tertiary" expanded={isExpanded} />
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3">
                  {/* Tabs */}
                  <div className="flex gap-1 mb-3 p-1 bg-bg-tertiary rounded-lg">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab('details'); }}
                      className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
                        activeTab === 'details' ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-tertiary'
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab('subtasks'); }}
                      className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
                        activeTab === 'subtasks' ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-tertiary'
                      }`}
                    >
                      Subs ({completedSubs}/{task.subtasks.length})
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab('deps'); }}
                      className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
                        activeTab === 'deps' ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-tertiary'
                      }`}
                    >
                      Deps ({task.dependsOn.length})
                    </button>
                  </div>

                  {/* Tab content */}
                  {activeTab === 'details' && (
                    <div className="grid grid-cols-2 gap-2 text-center mb-3">
                      <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                        <div className="text-xs font-bold text-text-primary">{task.startDate}</div>
                        <div className="text-[9px] text-text-tertiary uppercase">Start</div>
                      </div>
                      <div className="bg-bg-primary rounded-lg p-2 border border-border-primary">
                        <div className="text-xs font-bold text-text-primary">{task.endDate}</div>
                        <div className="text-[9px] text-text-tertiary uppercase">End</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'subtasks' && (
                    <div className="mb-3 space-y-1.5 max-h-32 overflow-auto">
                      {task.subtasks.length > 0 ? task.subtasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2 text-xs">
                          <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${
                            sub.completed ? 'bg-accent border-accent' : 'border-border-secondary'
                          }`}>
                            {sub.completed && <CheckIcon className="h-2.5 w-2.5 text-accent-text" />}
                          </div>
                          <span className={sub.completed ? 'text-text-tertiary line-through' : 'text-text-secondary'}>
                            {sub.name}
                          </span>
                        </div>
                      )) : (
                        <div className="text-xs text-text-tertiary text-center py-2">No subtasks</div>
                      )}
                    </div>
                  )}

                  {activeTab === 'deps' && (
                    <div className="mb-3 space-y-1.5 max-h-32 overflow-auto">
                      {task.dependsOnNames.length > 0 ? task.dependsOnNames.map((name, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                          <LinkIcon className="h-3.5 w-3.5 text-text-tertiary" />
                          {name}
                        </div>
                      )) : (
                        <div className="text-xs text-text-tertiary text-center py-2">No dependencies</div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-danger bg-danger-light hover:bg-danger/20 rounded-lg transition-colors">
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors">
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
    </div>
  );
}

export default function PreviewSidebar() {
  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Sidebar Variants</h1>
          <p className="text-text-secondary">Click on tasks to expand</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-accent px-1">D: Grid Stats (favorite)</h2>
            <div className="overflow-hidden rounded-xl border-2 border-accent shadow-sm">
              <SidebarVariantD />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">E: 4-col Grid + Subtasks list</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantE />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">F: 2-row Grid + Both lists</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantF />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">G: Collapsible sections</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantG />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary px-1">H: Tabs navigation</h2>
            <div className="overflow-hidden rounded-xl border border-border-primary shadow-sm">
              <SidebarVariantH />
            </div>
          </div>
        </div>

        <div className="pt-6 text-center">
          <Link href="/" className="text-sm text-accent hover:text-accent-hover font-medium">
            ← Back to app
          </Link>
        </div>
      </div>
    </div>
  );
}
