import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ProjectClientShell } from './ProjectClientShell';

interface Params {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Project ${id} — Planify`,
    description: 'Manage your project tasks with Gantt charts and Kanban boards.',
  };
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<Params>;
}) {
  const { id } = await params;
  return <ProjectClientShell projectId={id}>{children}</ProjectClientShell>;
}
