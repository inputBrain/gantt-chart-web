'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { GanttState, GanttAction, Task, ViewMode, Subtask } from '@/types/gantt';
import { addMonths } from '@/utils/dateUtils';
import { generateUUID } from '@/utils/helpers';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

// ─── Serialisation ────────────────────────────────────────────

type SerializedTask = Omit<Task, 'startDate' | 'endDate'> & {
  startDate: string;
  endDate: string;
};

function serializeTasks(tasks: Task[]): SerializedTask[] {
  return tasks.map((task) => ({
    ...task,
    startDate: task.startDate.toISOString(),
    endDate: task.endDate.toISOString(),
  }));
}

function deserializeTasks(data: SerializedTask[]): Task[] {
  return data.map((task) => ({
    ...task,
    startDate: new Date(task.startDate),
    endDate: new Date(task.endDate),
  }));
}

function loadTasksFromStorage(projectId: string): Task[] {
  // Migrate legacy key for the default project
  if (projectId === 'default') {
    const legacy = storageGet<SerializedTask[]>(STORAGE_KEYS.legacyTasks);
    const current = storageGet<SerializedTask[]>(STORAGE_KEYS.tasks(projectId));
    if (legacy && !current) {
      storageSet(STORAGE_KEYS.tasks(projectId), legacy);
      localStorage.removeItem(STORAGE_KEYS.legacyTasks);
    }
  }

  const data = storageGet<SerializedTask[]>(STORAGE_KEYS.tasks(projectId));
  return data ? deserializeTasks(data) : [];
}

// ─── Reducer (pure — no side effects) ─────────────────────────

/**
 * Pure reducer — state transitions only.
 * Persistence is handled by a useEffect in GanttProvider
 * so that React Strict Mode double-invocation does not cause
 * duplicate writes.
 */
function ganttReducer(state: GanttState, action: GanttAction): GanttState {
  switch (action.type) {
    case 'ADD_TASK': {
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        isFormOpen: false,
        editingTask: null,
      };
    }
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        isFormOpen: false,
        editingTask: null,
      };
    }
    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks
          .filter((task) => task.id !== action.payload)
          .map((task) => ({
            ...task,
            dependsOn: task.dependsOn.filter((id) => id !== action.payload),
          })),
        selectedTaskId:
          state.selectedTaskId === action.payload ? null : state.selectedTaskId,
        isFormOpen: false,
        editingTask: null,
      };
    }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'NAVIGATE': {
      const offset = action.payload === 'next' ? 1 : -1;
      const newDate =
        state.viewMode === 'month'
          ? addMonths(state.currentDate, offset)
          : new Date(state.currentDate.getFullYear() + offset, 0, 1);
      return { ...state, currentDate: newDate };
    }
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'SELECT_TASK':
      return { ...state, selectedTaskId: action.payload };
    case 'OPEN_FORM':
      return { ...state, isFormOpen: true, editingTask: action.payload ?? null };
    case 'CLOSE_FORM':
      return { ...state, isFormOpen: false, editingTask: null };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'TOGGLE_SUBTASK': {
      const { taskId, subtaskId } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            subtasks: (task.subtasks ?? []).map((sub) =>
              sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
            ),
          };
        }),
      };
    }
    case 'UPDATE_SUBTASK': {
      const { taskId, subtask } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            subtasks: (task.subtasks ?? []).map((sub) =>
              sub.id === subtask.id ? subtask : sub
            ),
          };
        }),
      };
    }
    case 'DELETE_SUBTASK': {
      const { taskId, subtaskId } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            subtasks: (task.subtasks ?? []).filter((sub) => sub.id !== subtaskId),
          };
        }),
      };
    }
    case 'REORDER_SUBTASKS': {
      const { taskId, fromIndex, toIndex } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task;
          const subtasks = [...(task.subtasks ?? [])];
          const [removed] = subtasks.splice(fromIndex, 1);
          subtasks.splice(toIndex, 0, removed);
          return { ...task, subtasks };
        }),
      };
    }
    default:
      return state;
  }
}

// ─── Initial state ─────────────────────────────────────────────

const initialState: GanttState = {
  tasks: [],
  viewMode: 'year',
  currentDate: new Date(),
  selectedTaskId: null,
  isFormOpen: false,
  editingTask: null,
};

// ─── Context ───────────────────────────────────────────────────

/**
 * Encapsulated context API — dispatch is intentionally omitted to
 * enforce the Single Responsibility / Open-Closed principles:
 * all mutations go through typed action-creator methods.
 */
interface GanttContextValue {
  state: GanttState;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  navigate: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  selectTask: (id: string | null) => void;
  openForm: (task?: Task) => void;
  closeForm: () => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  updateSubtask: (taskId: string, subtask: Subtask) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  reorderSubtasks: (taskId: string, fromIndex: number, toIndex: number) => void;
}

const GanttContext = createContext<GanttContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────

export function GanttProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const [state, dispatch] = useReducer(ganttReducer, initialState);

  // Load tasks on mount (once per projectId)
  const projectIdRef = useRef(projectId);
  useEffect(() => {
    const tasks = loadTasksFromStorage(projectIdRef.current);
    if (tasks.length > 0) {
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }
  }, []);

  // Persist tasks whenever they change — side effects belong here,
  // NOT inside the reducer (reducers must be pure functions).
  useEffect(() => {
    storageSet(STORAGE_KEYS.tasks(projectId), serializeTasks(state.tasks));
  }, [state.tasks, projectId]);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    dispatch({ type: 'ADD_TASK', payload: { ...task, id: generateUUID() } });
  }, []);

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const navigate = useCallback((direction: 'prev' | 'next') => {
    dispatch({ type: 'NAVIGATE', payload: direction });
  }, []);

  const goToToday = useCallback(() => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  }, []);

  const selectTask = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_TASK', payload: id });
  }, []);

  const openForm = useCallback((task?: Task) => {
    dispatch({ type: 'OPEN_FORM', payload: task });
  }, []);

  const closeForm = useCallback(() => {
    dispatch({ type: 'CLOSE_FORM' });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { taskId, subtaskId } });
  }, []);

  const updateSubtask = useCallback((taskId: string, subtask: Subtask) => {
    dispatch({ type: 'UPDATE_SUBTASK', payload: { taskId, subtask } });
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    dispatch({ type: 'DELETE_SUBTASK', payload: { taskId, subtaskId } });
  }, []);

  const reorderSubtasks = useCallback(
    (taskId: string, fromIndex: number, toIndex: number) => {
      dispatch({ type: 'REORDER_SUBTASKS', payload: { taskId, fromIndex, toIndex } });
    },
    []
  );

  const value: GanttContextValue = {
    state,
    addTask,
    updateTask,
    deleteTask,
    setViewMode,
    navigate,
    goToToday,
    selectTask,
    openForm,
    closeForm,
    toggleSubtask,
    updateSubtask,
    deleteSubtask,
    reorderSubtasks,
  };

  return <GanttContext.Provider value={value}>{children}</GanttContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────

export function useGantt() {
  const context = useContext(GanttContext);
  if (!context) {
    throw new Error('useGantt must be used within a GanttProvider');
  }
  return context;
}
