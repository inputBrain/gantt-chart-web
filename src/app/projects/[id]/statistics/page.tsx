'use client';

import { useState, useMemo } from 'react';
import { useGantt } from '@/context/GanttContext';
import { Task, TASK_COLORS, getTaskColorStyles } from '@/types/gantt';
import { calculateTaskProgress, formatDateShort } from '@/utils/dateUtils';
import { DatePicker } from '@/components/ui/DatePicker';

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse YYYY-MM-DD string to Date
function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Icons
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
    </svg>
  );
}

// Simple Pie Chart component
function PieChart({ data, size = 160 }: { data: { value: number; color: string; label: string }[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-text-tertiary text-sm">No data</div>
      </div>
    );
  }

  let currentAngle = -90;
  const radius = size / 2 - 10;
  const center = size / 2;

  const paths = data.filter(d => d.value > 0).map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathD = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return <path key={i} d={pathD} fill={d.color} className="transition-opacity hover:opacity-80" />;
  });

  return (
    <svg width={size} height={size} className="drop-shadow-sm">
      {paths}
      <circle cx={center} cy={center} r={radius * 0.5} className="fill-bg-tertiary" />
    </svg>
  );
}

// Simple Bar Chart component
function BarChart({ data, height = 200 }: { data: { value: number; color: string; label: string }[]; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex items-end justify-around gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <div className="text-xs font-semibold text-text-secondary">{d.value}</div>
          <div
            className="w-full max-w-[40px] rounded-t-lg transition-all duration-300"
            style={{
              height: `${(d.value / maxValue) * (height - 40)}px`,
              backgroundColor: d.color,
              minHeight: d.value > 0 ? '8px' : '2px',
            }}
          />
          <div className="text-[10px] text-text-tertiary text-center truncate w-full">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// Stat Card component
function StatCard({ icon: Icon, label, value, subValue, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="bg-bg-primary rounded-xl border border-border-primary p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-text-primary">{value}</div>
          {subValue && <div className="text-xs text-text-tertiary">{subValue}</div>}
        </div>
      </div>
      <div className="mt-3 text-sm font-medium text-text-secondary">{label}</div>
    </div>
  );
}

// Progress Ring component
function ProgressRing({ progress, size = 80, strokeWidth = 8, color }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-bg-tertiary"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}


// Calculate statistics
function useStatistics(tasks: Task[], startDate: Date, endDate: Date) {
  return useMemo(() => {
    // Filter tasks within date range
    const filteredTasks = tasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return taskStart <= endDate && taskEnd >= startDate;
    });

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => calculateTaskProgress(t.subtasks) === 100).length;
    const inProgressTasks = filteredTasks.filter(t => {
      const p = calculateTaskProgress(t.subtasks);
      return p > 0 && p < 100;
    }).length;
    const notStartedTasks = filteredTasks.filter(t => calculateTaskProgress(t.subtasks) === 0).length;

    const totalSubtasks = filteredTasks.reduce((sum, t) => sum + (t.subtasks?.length || 0), 0);
    const completedSubtasks = filteredTasks.reduce(
      (sum, t) => sum + (t.subtasks?.filter(s => s.completed).length || 0),
      0
    );

    const avgProgress = totalTasks > 0
      ? Math.round(filteredTasks.reduce((sum, t) => sum + calculateTaskProgress(t.subtasks), 0) / totalTasks)
      : 0;

    // Tasks by color
    const tasksByColor = filteredTasks.reduce((acc, task) => {
      const colorKey = task.customColor || task.color;
      acc[colorKey] = (acc[colorKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average task duration in days
    const avgDuration = totalTasks > 0
      ? Math.round(
          filteredTasks.reduce((sum, t) => {
            const start = new Date(t.startDate).getTime();
            const end = new Date(t.endDate).getTime();
            return sum + (end - start) / (1000 * 60 * 60 * 24);
          }, 0) / totalTasks
        )
      : 0;

    // Tasks with most subtasks
    const tasksBySubtaskCount = [...filteredTasks]
      .sort((a, b) => (b.subtasks?.length || 0) - (a.subtasks?.length || 0))
      .slice(0, 5);

    // Longest tasks by duration
    const longestTasks = [...filteredTasks]
      .map(t => ({
        ...t,
        duration: Math.round((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    // Tasks ending soon (next 7 days)
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(now.getDate() + 7);
    const upcomingDeadlines = filteredTasks
      .filter(t => {
        const endDate = new Date(t.endDate);
        return endDate >= now && endDate <= weekFromNow && calculateTaskProgress(t.subtasks) < 100;
      })
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

    // Overdue tasks
    const overdueTasks = filteredTasks.filter(t => {
      const endDate = new Date(t.endDate);
      return endDate < now && calculateTaskProgress(t.subtasks) < 100;
    });

    return {
      filteredTasks,
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      totalSubtasks,
      completedSubtasks,
      avgProgress,
      tasksByColor,
      avgDuration,
      tasksBySubtaskCount,
      longestTasks,
      upcomingDeadlines,
      overdueTasks,
    };
  }, [tasks, startDate, endDate]);
}

export default function StatisticsPage() {
  const { state } = useGantt();

  // Date range state - default to last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDateStr, setStartDateStr] = useState(formatDate(thirtyDaysAgo));
  const [endDateStr, setEndDateStr] = useState(formatDate(today));

  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);

  const stats = useStatistics(state.tasks, startDate, endDate);

  // Quick date range presets
  const setPreset = (preset: string) => {
    const now = new Date();
    let start = new Date();

    switch (preset) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        start = new Date(2020, 0, 1);
        break;
    }

    setStartDateStr(formatDate(start));
    setEndDateStr(formatDate(now));
  };

  const progressData = [
    { value: stats.completedTasks, color: 'var(--success)', label: 'Completed' },
    { value: stats.inProgressTasks, color: 'var(--warning)', label: 'In Progress' },
    { value: stats.notStartedTasks, color: 'var(--text-quaternary)', label: 'Not Started' },
  ];

  const colorData = Object.entries(stats.tasksByColor).map(([color, count]) => {
    const isHex = color.startsWith('#');
    const colorMap: Record<string, string> = {
      blue: 'var(--task-blue)',
      green: 'var(--task-green)',
      purple: 'var(--task-purple)',
      orange: 'var(--task-orange)',
      red: 'var(--task-red)',
      teal: 'var(--task-teal)',
      pink: 'var(--task-pink)',
      yellow: 'var(--task-yellow)',
    };
    return {
      value: count,
      color: isHex ? color : colorMap[color] || 'var(--accent)',
      label: isHex ? 'Custom' : color.charAt(0).toUpperCase() + color.slice(1),
    };
  });

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <ChartBarIcon className="h-8 w-8 text-accent" />
          <div>
            <h1 className="text-xl font-bold text-text-primary">Statistics</h1>
            <p className="text-sm text-text-tertiary">Track your project progress</p>
          </div>
        </div>

        {/* Date Range Selector - Swapped layout */}
        <div className="bg-bg-primary rounded-xl border border-border-primary p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Custom Date Pickers - Now first */}
            <div className="flex items-center gap-2">
              <div className="w-40">
                <DatePicker value={startDateStr} onChange={setStartDateStr} placeholder="Start date" />
              </div>
              <span className="text-text-tertiary">—</span>
              <div className="w-40">
                <DatePicker value={endDateStr} onChange={setEndDateStr} minDate={startDateStr} placeholder="End date" />
              </div>
            </div>

            <div className="flex-1" />

            {/* Quick Presets - Now after */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CalendarIcon className="h-5 w-5" />
              <span>Quick:</span>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'week', label: 'Week' },
                { id: 'month', label: 'Month' },
                { id: 'quarter', label: 'Quarter' },
                { id: 'year', label: 'Year' },
                { id: 'all', label: 'All' },
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setPreset(preset.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
            <div className="bg-bg-primary rounded-xl border border-border-primary p-4 mb-6">
              <div className="grid grid-cols-4 divide-x divide-border-primary">
                <div className="text-center px-4">
                  <div className="text-3xl font-bold text-text-primary">{stats.totalTasks}</div>
                  <div className="text-xs text-text-tertiary uppercase">Total</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-3xl font-bold text-success">{stats.completedTasks}</div>
                  <div className="text-xs text-text-tertiary uppercase">Done</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-3xl font-bold text-warning">{stats.inProgressTasks}</div>
                  <div className="text-xs text-text-tertiary uppercase">Active</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-3xl font-bold text-text-quaternary">{stats.notStartedTasks}</div>
                  <div className="text-xs text-text-tertiary uppercase">Pending</div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={FolderIcon} label="Total Tasks" value={stats.totalTasks} color="bg-accent" />
          <StatCard icon={CheckCircleIcon} label="Completed" value={stats.completedTasks} subValue={`${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%`} color="bg-success" />
          <StatCard icon={ClockIcon} label="In Progress" value={stats.inProgressTasks} color="bg-warning" />
          <StatCard icon={ListIcon} label="Subtasks Done" value={`${stats.completedSubtasks}/${stats.totalSubtasks}`} color="bg-task-purple" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress Pie Chart */}
              <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Task Progress</h3>
                <div className="flex items-center justify-around">
                  <PieChart data={progressData} size={160} />
                  <div className="space-y-3">
                    {progressData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-sm text-text-secondary">{d.label}</span>
                        <span className="text-sm font-semibold text-text-primary ml-auto">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks by Color Bar Chart */}
              <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Tasks by Category</h3>
                {colorData.length > 0 ? (
                  <BarChart data={colorData} height={160} />
                ) : (
                  <div className="flex items-center justify-center h-[160px] text-text-tertiary">No data</div>
                )}
              </div>
            </div>

            {/* Progress Overview (from Version B) */}
            <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Progress Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Tasks Completion</span>
                    <span className="font-semibold text-text-primary">
                      {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Subtasks Completion</span>
                    <span className="font-semibold text-text-primary">
                      {stats.totalSubtasks > 0 ? Math.round((stats.completedSubtasks / stats.totalSubtasks) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalSubtasks > 0 ? (stats.completedSubtasks / stats.totalSubtasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Average Progress</span>
                    <span className="font-semibold text-text-primary">{stats.avgProgress}%</span>
                  </div>
                  <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-task-purple rounded-full transition-all duration-500"
                      style={{ width: `${stats.avgProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats (from Version B) */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Avg. Duration</span>
                  <span className="text-sm font-bold text-text-primary">{stats.avgDuration} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Total Subtasks</span>
                  <span className="text-sm font-bold text-text-primary">{stats.totalSubtasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Completed Subtasks</span>
                  <span className="text-sm font-bold text-success">{stats.completedSubtasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Overdue Tasks</span>
                  <span className={`text-sm font-bold ${stats.overdueTasks.length > 0 ? 'text-danger' : 'text-text-primary'}`}>
                    {stats.overdueTasks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Due This Week</span>
                  <span className="text-sm font-bold text-warning">{stats.upcomingDeadlines.length}</span>
                </div>
              </div>
            </div>

            {/* Average Progress Ring */}
            <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 text-center">Overall Progress</h3>
              <div className="flex justify-center">
                <ProgressRing progress={stats.avgProgress} size={120} strokeWidth={10} color="var(--accent)" />
              </div>
              <div className="text-center mt-4 text-sm text-text-tertiary">
                Average across all tasks
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Upcoming Deadlines Table */}
          <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon className="h-5 w-5 text-warning" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Upcoming Deadlines</h3>
            </div>
            {stats.upcomingDeadlines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left text-xs font-semibold text-text-tertiary uppercase py-2">Task</th>
                      <th className="text-left text-xs font-semibold text-text-tertiary uppercase py-2">Due Date</th>
                      <th className="text-right text-xs font-semibold text-text-tertiary uppercase py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.upcomingDeadlines.slice(0, 5).map(task => {
                      const progress = calculateTaskProgress(task.subtasks);
                      const colorStyles = getTaskColorStyles(task);
                      return (
                        <tr key={task.id} className="border-b border-border-primary last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-6 rounded-full ${colorStyles.classes.progress}`}
                                style={colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
                              />
                              <span className="text-sm text-text-primary truncate max-w-[150px]">{task.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-text-secondary">{formatDateShort(task.endDate)}</td>
                          <td className="py-3 text-right">
                            <span className={`text-sm font-semibold ${progress === 100 ? 'text-success' : 'text-text-primary'}`}>
                              {progress}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-tertiary text-sm">
                No upcoming deadlines this week
              </div>
            )}
          </div>

          {/* Overdue Tasks Table */}
          <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendUpIcon className="h-5 w-5 text-danger" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Overdue Tasks</h3>
            </div>
            {stats.overdueTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left text-xs font-semibold text-text-tertiary uppercase py-2">Task</th>
                      <th className="text-left text-xs font-semibold text-text-tertiary uppercase py-2">Was Due</th>
                      <th className="text-right text-xs font-semibold text-text-tertiary uppercase py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.overdueTasks.slice(0, 5).map(task => {
                      const progress = calculateTaskProgress(task.subtasks);
                      const colorStyles = getTaskColorStyles(task);
                      return (
                        <tr key={task.id} className="border-b border-border-primary last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-6 rounded-full ${colorStyles.classes.progress}`}
                                style={colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
                              />
                              <span className="text-sm text-text-primary truncate max-w-[150px]">{task.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-danger">{formatDateShort(task.endDate)}</td>
                          <td className="py-3 text-right">
                            <span className="text-sm font-semibold text-text-primary">{progress}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-success text-sm">
                No overdue tasks
              </div>
            )}
          </div>
        </div>

        {/* More Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Longest Tasks Table */}
          <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-task-teal" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Longest Tasks</h3>
            </div>
            {stats.longestTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left text-xs font-semibold text-text-tertiary uppercase py-2">Task</th>
                      <th className="text-right text-xs font-semibold text-text-tertiary uppercase py-2">Duration</th>
                      <th className="text-right text-xs font-semibold text-text-tertiary uppercase py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.longestTasks.map(task => {
                      const progress = calculateTaskProgress(task.subtasks);
                      const colorStyles = getTaskColorStyles(task);
                      return (
                        <tr key={task.id} className="border-b border-border-primary last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-6 rounded-full ${colorStyles.classes.progress}`}
                                style={colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
                              />
                              <span className="text-sm text-text-primary truncate max-w-[150px]">{task.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm text-text-secondary">{task.duration} days</td>
                          <td className="py-3 text-right">
                            <span className={`text-sm font-semibold ${progress === 100 ? 'text-success' : 'text-text-primary'}`}>
                              {progress}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-tertiary text-sm">
                No tasks in selected range
              </div>
            )}
          </div>

          {/* Tasks with Most Subtasks Table */}
          <div className="bg-bg-primary rounded-xl border border-border-primary p-6">
            <div className="flex items-center gap-2 mb-4">
              <TableIcon className="h-5 w-5 text-task-pink" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Most Subtasks</h3>
            </div>
            {stats.tasksBySubtaskCount.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left text-xs font-semibold text-text-tertiary uppercase py-2">Task</th>
                      <th className="text-right text-xs font-semibold text-text-tertiary uppercase py-2">Subtasks</th>
                      <th className="text-right text-xs font-semibold text-text-tertiary uppercase py-2">Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.tasksBySubtaskCount.map(task => {
                      const colorStyles = getTaskColorStyles(task);
                      const completed = task.subtasks?.filter(s => s.completed).length || 0;
                      const total = task.subtasks?.length || 0;
                      return (
                        <tr key={task.id} className="border-b border-border-primary last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-6 rounded-full ${colorStyles.classes.progress}`}
                                style={colorStyles.progressColor ? { backgroundColor: colorStyles.progressColor } : undefined}
                              />
                              <span className="text-sm text-text-primary truncate max-w-[150px]">{task.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm text-text-secondary">{total}</td>
                          <td className="py-3 text-right">
                            <span className={`text-sm font-semibold ${completed === total && total > 0 ? 'text-success' : 'text-text-primary'}`}>
                              {completed}/{total}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-tertiary text-sm">
                No tasks in selected range
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
