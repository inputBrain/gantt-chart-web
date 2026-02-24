'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GanttProvider } from '@/context/GanttContext';
import { useProjects } from '@/context/ProjectsContext';

const PROJECT_COLOR_BG: Record<string, string> = {
  blue:   'bg-blue-500',
  green:  'bg-success',
  purple: 'bg-purple-500',
  orange: 'bg-orange-400',
  red:    'bg-red-500',
  yellow: 'bg-yellow-400',
};

function ProjectSubHeader({ projectId }: { projectId: string }) {
  const { getProject } = useProjects();
  const pathname = usePathname();
  const project = getProject(projectId);

  const tabs = [
    { label: 'Gantt',      href: `/projects/${projectId}` },
    { label: 'Board',      href: `/projects/${projectId}/boards` },
    { label: 'Statistics', href: `/projects/${projectId}/statistics` },
  ];

  const colorBg = project?.customColor
    ? ''
    : (PROJECT_COLOR_BG[project?.color ?? 'blue'] ?? 'bg-blue-500');

  return (
    <div className="border-b border-border-primary bg-bg-secondary px-6 py-2.5 flex items-center gap-2">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="text-sm text-text-tertiary hover:text-accent transition-colors font-medium"
      >
        Projects
      </Link>
      <svg
        className="h-3.5 w-3.5 text-text-quaternary flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      <div className="flex items-center gap-1.5">
        <div
          className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${colorBg}`}
          style={project?.customColor ? { backgroundColor: project.customColor } : undefined}
        />
        <span className="text-sm font-semibold text-text-primary">
          {project?.name ?? 'Project'}
        </span>
      </div>

      {/* View tabs */}
      <nav className="ml-auto flex items-center gap-1 bg-bg-tertiary rounded-xl p-1" aria-label="Project views">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-bg-primary text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function ProjectClientShell({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  return (
    <GanttProvider projectId={projectId}>
      <ProjectSubHeader projectId={projectId} />
      {children}
    </GanttProvider>
  );
}
