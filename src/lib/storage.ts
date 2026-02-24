/**
 * Storage abstraction layer.
 *
 * Centralises all localStorage access so the rest of the codebase is
 * decoupled from the concrete storage mechanism (Dependency Inversion
 * Principle). Swapping to IndexedDB, sessionStorage, or a server-side
 * store only requires changes here.
 */

const isBrowser = typeof window !== 'undefined';

export function storageGet<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function storageRemove(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

/** Storage keys — single source of truth for all key names. */
export const STORAGE_KEYS = {
  projects: 'planify-projects',
  theme: 'theme',
  tasks: (projectId: string) => `planify-tasks-${projectId}`,
  kanban: (projectId: string) => `kanban-columns-${projectId}`,
  /** @deprecated Migrate to tasks(projectId) */
  legacyTasks: 'gantt-tasks',
} as const;
