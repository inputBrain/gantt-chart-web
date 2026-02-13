export type TaskColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'pink' | 'yellow';

export type ViewMode = 'month' | 'year';

export interface Subtask {
  id: string;
  name: string;
  completed: boolean;
  comment?: string;
}

export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color: TaskColor;
  customColor?: string; // Custom hex color (e.g., "#ff5500")
  dependsOn: string[];
  blocked?: boolean;
  subtasks?: Subtask[];
}

export interface GanttState {
  tasks: Task[];
  viewMode: ViewMode;
  currentDate: Date;
  selectedTaskId: string | null;
  isFormOpen: boolean;
  editingTask: Task | null;
}

export type GanttAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'NAVIGATE'; payload: 'prev' | 'next' }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SELECT_TASK'; payload: string | null }
  | { type: 'OPEN_FORM'; payload?: Task }
  | { type: 'CLOSE_FORM' }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subtaskId: string } }
  | { type: 'UPDATE_SUBTASK'; payload: { taskId: string; subtask: Subtask } }
  | { type: 'DELETE_SUBTASK'; payload: { taskId: string; subtaskId: string } }
  | { type: 'REORDER_SUBTASKS'; payload: { taskId: string; fromIndex: number; toIndex: number } };

export interface TimelineConfig {
  startDate: Date;
  endDate: Date;
  columns: { date: Date; label: string }[];
  pixelsPerDay: number;
  totalWidth: number;
}

export interface TaskPosition {
  left: number;
  width: number;
  top: number;
}

export const TASK_COLORS: Record<TaskColor, { bg: string; progress: string; border: string }> = {
  blue: { bg: 'bg-task-blue-bg', progress: 'bg-task-blue', border: 'border-task-blue' },
  green: { bg: 'bg-task-green-bg', progress: 'bg-task-green', border: 'border-task-green' },
  purple: { bg: 'bg-task-purple-bg', progress: 'bg-task-purple', border: 'border-task-purple' },
  orange: { bg: 'bg-task-orange-bg', progress: 'bg-task-orange', border: 'border-task-orange' },
  red: { bg: 'bg-task-red-bg', progress: 'bg-task-red', border: 'border-task-red' },
  teal: { bg: 'bg-task-teal-bg', progress: 'bg-task-teal', border: 'border-task-teal' },
  pink: { bg: 'bg-task-pink-bg', progress: 'bg-task-pink', border: 'border-task-pink' },
  yellow: { bg: 'bg-task-yellow-bg', progress: 'bg-task-yellow', border: 'border-task-yellow' },
};

// Helper to get task color styles (supports custom colors)
export function getTaskColorStyles(task: Task): { bgColor?: string; progressColor?: string; borderColor?: string; classes: { bg: string; progress: string; border: string } } {
  if (task.customColor) {
    // For custom colors, style like preset colors:
    // - Background: subtle version of the color (using transparency for theme compatibility)
    // - Progress: full saturated color
    // - Border: the custom color
    const hexToRgba = (hex: string, alpha: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = (num >> 16) & 0xFF;
      const g = (num >> 8) & 0xFF;
      const b = num & 0xFF;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
      bgColor: hexToRgba(task.customColor, 0.15),  // Subtle background with transparency
      progressColor: task.customColor,             // Full color for progress
      borderColor: task.customColor,
      classes: { bg: '', progress: '', border: '' }
    };
  }

  return {
    classes: TASK_COLORS[task.color]
  };
}
