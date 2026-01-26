export type TaskColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'pink' | 'yellow';

export type ViewMode = 'month' | 'year';

export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color: TaskColor;
  dependsOn: string[];
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
  | { type: 'SET_TASKS'; payload: Task[] };

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
  blue: { bg: 'bg-blue-500/30', progress: 'bg-blue-500', border: 'border-blue-500' },
  green: { bg: 'bg-green-500/30', progress: 'bg-green-500', border: 'border-green-500' },
  purple: { bg: 'bg-purple-500/30', progress: 'bg-purple-500', border: 'border-purple-500' },
  orange: { bg: 'bg-orange-500/30', progress: 'bg-orange-500', border: 'border-orange-500' },
  red: { bg: 'bg-red-500/30', progress: 'bg-red-500', border: 'border-red-500' },
  teal: { bg: 'bg-teal-500/30', progress: 'bg-teal-500', border: 'border-teal-500' },
  pink: { bg: 'bg-pink-500/30', progress: 'bg-pink-500', border: 'border-pink-500' },
  yellow: { bg: 'bg-yellow-500/30', progress: 'bg-yellow-500', border: 'border-yellow-500' },
};
