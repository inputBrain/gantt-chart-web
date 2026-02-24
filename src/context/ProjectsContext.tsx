'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, ProjectColor } from '@/types/gantt';
import { generateUUID } from '@/utils/helpers';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

const DEFAULT_PROJECT: Project = {
  id: 'default',
  name: 'My Project',
  description: '',
  color: 'blue',
  createdAt: new Date().toISOString(),
};

function loadProjects(): Project[] {
  const projects = storageGet<Project[]>(STORAGE_KEYS.projects);
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return [DEFAULT_PROJECT];
  }
  return projects;
}

interface ProjectsContextValue {
  projects: Project[];
  addProject: (name: string, description: string, color: ProjectColor, customColor?: string) => Project;
  updateProject: (id: string, name: string, description: string, color: ProjectColor, customColor?: string) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([DEFAULT_PROJECT]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const addProject = useCallback((name: string, description: string, color: ProjectColor, customColor?: string): Project => {
    const newProject: Project = {
      id: generateUUID(),
      name,
      description,
      color,
      customColor,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => {
      const updated = [...prev, newProject];
      storageSet(STORAGE_KEYS.projects, updated);
      return updated;
    });
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, name: string, description: string, color: ProjectColor, customColor?: string) => {
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, name, description, color, customColor } : p
      );
      storageSet(STORAGE_KEYS.projects, updated);
      return updated;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      const updated = filtered.length > 0 ? filtered : [DEFAULT_PROJECT];
      storageSet(STORAGE_KEYS.projects, updated);
      return updated;
    });
  }, []);

  const getProject = useCallback((id: string): Project | undefined => {
    return projects.find((p) => p.id === id);
  }, [projects]);

  const reorderProjects = useCallback((fromIndex: number, toIndex: number) => {
    setProjects((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      storageSet(STORAGE_KEYS.projects, updated);
      return updated;
    });
  }, []);

  return (
    <ProjectsContext.Provider
      value={{ projects, addProject, updateProject, deleteProject, getProject, reorderProjects }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
