import { TimelineConfig, ViewMode } from '@/types/gantt';

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getDaysBetween(start: Date, end: Date): number {
  const startNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endNormalized.getTime() - startNormalized.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateShort(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function getMonthName(date: Date, short = false): string {
  return short ? MONTH_NAMES_SHORT[date.getMonth()] : MONTH_NAMES[date.getMonth()];
}

export function getTimelineConfig(currentDate: Date, viewMode: ViewMode): TimelineConfig {
  const PIXELS_PER_DAY_MONTH = 40;
  const PIXELS_PER_DAY_YEAR = 3;

  if (viewMode === 'month') {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);

    const columns = [];
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
      columns.push({
        date,
        label: String(i + 1),
      });
    }

    return {
      startDate: start,
      endDate: end,
      columns,
      pixelsPerDay: PIXELS_PER_DAY_MONTH,
      totalWidth: daysInMonth * PIXELS_PER_DAY_MONTH,
    };
  } else {
    const start = startOfYear(currentDate);
    const end = endOfYear(currentDate);

    const columns = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), i, 1);
      columns.push({
        date,
        label: MONTH_NAMES_SHORT[i],
      });
    }

    const daysInYear = getDaysBetween(start, end) + 1;

    return {
      startDate: start,
      endDate: end,
      columns,
      pixelsPerDay: PIXELS_PER_DAY_YEAR,
      totalWidth: daysInYear * PIXELS_PER_DAY_YEAR,
    };
  }
}

export function calculateTaskProgress(subtasks?: { completed: boolean }[]): number {
  if (!subtasks || subtasks.length === 0) return 0;
  const completed = subtasks.filter(s => s.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

export function getTaskPosition(
  task: { startDate: Date; endDate: Date },
  config: TimelineConfig,
  rowIndex: number,
  rowHeight: number = 50
): { left: number; width: number; top: number } {
  const taskStart = new Date(task.startDate.getFullYear(), task.startDate.getMonth(), task.startDate.getDate());
  const taskEnd = new Date(task.endDate.getFullYear(), task.endDate.getMonth(), task.endDate.getDate());
  const timelineStart = new Date(config.startDate.getFullYear(), config.startDate.getMonth(), config.startDate.getDate());

  const daysFromStart = getDaysBetween(timelineStart, taskStart);
  const taskDuration = getDaysBetween(taskStart, taskEnd) + 1;

  const left = daysFromStart * config.pixelsPerDay;
  const width = taskDuration * config.pixelsPerDay;
  const top = rowIndex * rowHeight;

  return { left, width, top };
}

export function getHeaderLabel(date: Date, viewMode: ViewMode): string {
  if (viewMode === 'month') {
    return `${getMonthName(date)} ${date.getFullYear()}`;
  }
  return String(date.getFullYear());
}
