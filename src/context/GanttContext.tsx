'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GanttState, GanttAction, Task, ViewMode, Subtask } from '@/types/gantt';
import { addMonths } from '@/utils/dateUtils';

const STORAGE_KEY = 'gantt-tasks';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts (HTTP)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function serializeTasks(tasks: Task[]): string {
  return JSON.stringify(
    tasks.map((task) => ({
      ...task,
      startDate: task.startDate.toISOString(),
      endDate: task.endDate.toISOString(),
    }))
  );
}

function deserializeTasks(json: string): Task[] {
  try {
    const data = JSON.parse(json);
    return data.map((task: Record<string, unknown>) => ({
      ...task,
      startDate: new Date(task.startDate as string),
      endDate: new Date(task.endDate as string),
    }));
  } catch {
    return [];
  }
}

function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return deserializeTasks(stored);
}

function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, serializeTasks(tasks));
}

const initialState: GanttState = {
  tasks: [],
  viewMode: 'year',
  currentDate: new Date(),
  selectedTaskId: null,
  isFormOpen: false,
  editingTask: null,
};

function ganttReducer(state: GanttState, action: GanttAction): GanttState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTasks = [...state.tasks, action.payload];
      saveTasksToStorage(newTasks);
      return {
        ...state,
        tasks: newTasks,
        isFormOpen: false,
        editingTask: null,
      };
    }
    case 'UPDATE_TASK': {
      const newTasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
      saveTasksToStorage(newTasks);
      return {
        ...state,
        tasks: newTasks,
        isFormOpen: false,
        editingTask: null,
      };
    }
    case 'DELETE_TASK': {
      const newTasks = state.tasks
        .filter((task) => task.id !== action.payload)
        .map((task) => ({
          ...task,
          dependsOn: task.dependsOn.filter((id) => id !== action.payload),
        }));
      saveTasksToStorage(newTasks);
      return {
        ...state,
        tasks: newTasks,
        selectedTaskId: state.selectedTaskId === action.payload ? null : state.selectedTaskId,
        isFormOpen: false,
        editingTask: null,
      };
    }
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };
    case 'NAVIGATE': {
      const offset = action.payload === 'next' ? 1 : -1;
      const newDate =
        state.viewMode === 'month'
          ? addMonths(state.currentDate, offset)
          : new Date(state.currentDate.getFullYear() + offset, 0, 1);
      return {
        ...state,
        currentDate: newDate,
      };
    }
    case 'SET_CURRENT_DATE':
      return {
        ...state,
        currentDate: action.payload,
      };
    case 'SELECT_TASK':
      return {
        ...state,
        selectedTaskId: action.payload,
      };
    case 'OPEN_FORM':
      return {
        ...state,
        isFormOpen: true,
        editingTask: action.payload || null,
      };
    case 'CLOSE_FORM':
      return {
        ...state,
        isFormOpen: false,
        editingTask: null,
      };
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
    case 'TOGGLE_SUBTASK': {
      const { taskId, subtaskId } = action.payload;
      const newTasks = state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: (task.subtasks || []).map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          ),
        };
      });
      saveTasksToStorage(newTasks);
      return {
        ...state,
        tasks: newTasks,
      };
    }
    case 'UPDATE_SUBTASK': {
      const { taskId, subtask } = action.payload;
      const newTasks = state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: (task.subtasks || []).map((sub) =>
            sub.id === subtask.id ? subtask : sub
          ),
        };
      });
      saveTasksToStorage(newTasks);
      return {
        ...state,
        tasks: newTasks,
      };
    }
    case 'DELETE_SUBTASK': {
      const { taskId, subtaskId } = action.payload;
      const newTasks = state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: (task.subtasks || []).filter((sub) => sub.id !== subtaskId),
        };
      });
      saveTasksToStorage(newTasks);
      return {
        ...state,
        tasks: newTasks,
      };
    }
    case 'REORDER_SUBTASKS': {
      const { taskId, fromIndex, toIndex } = action.payload;
      const newTasks = state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const subtasks = [...(task.subtasks || [])];
        const [removed] = subtasks.splice(fromIndex, 1);
        subtasks.splice(toIndex, 0, removed);
        return {
          ...task,
          subtasks,
        };
      });
      saveTasksToStorage(newTasks);
      return {
        ...state,
        tasks: newTasks,
      };
    }
    default:
      return state;
  }
}

interface GanttContextValue {
  state: GanttState;
  dispatch: React.Dispatch<GanttAction>;
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

export function GanttProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ganttReducer, initialState);

  useEffect(() => {
    const tasks = loadTasksFromStorage();
    if (tasks.length > 0) {
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: generateUUID(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
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

  const reorderSubtasks = useCallback((taskId: string, fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_SUBTASKS', payload: { taskId, fromIndex, toIndex } });
  }, []);

  const value: GanttContextValue = {
    state,
    dispatch,
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

export function useGantt() {
  const context = useContext(GanttContext);
  if (!context) {
    throw new Error('useGantt must be used within a GanttProvider');
  }
  return context;
}
