import { useEffect, useState, useCallback } from 'react';
import {
  getProjects,
  createProject as createProjectApi,
  deleteProject as deleteProjectApi,
  toggleProjectStatus as toggleProjectStatusApi,
} from '@/lib/api';
import type { ProjectItem, TaskItem } from '@/types';
import { ProjectFormData } from '@/components/CreateProjectForm/CreateProjectForm';

export function useProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [hasLoadedProjects, setHasLoadedProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
      setHasLoadedProjects(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (data: ProjectFormData) => {
      try {
        await createProjectApi(data);
        await fetchProjects();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create project'
        );
      }
    },
    [fetchProjects]
  );

  const deleteProject = useCallback(
    async (id: number) => {
      try {
        await deleteProjectApi(id);
        await fetchProjects();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : `Failed to delete project ${id}`
        );
      }
    },
    [fetchProjects]
  );

  const updateTaskInProjects = useCallback((updatedTask: TaskItem) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) => ({
        ...project,
        tasks: project.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
      }))
    );
  }, []);

  const updateProjectInProjects = useCallback((updatedProject: ProjectItem) => {
    setProjects((current) =>
      current.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  }, []);

  const toggleProjectStatus = useCallback(
    async (id: number) => {
      try {
        const updatedProject = await toggleProjectStatusApi(id);
        updateProjectInProjects(updatedProject);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : `Failed to toggle status for project ${id}`
        );
      }
    },
    [updateProjectInProjects]
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    hasLoadedProjects,
    isLoading,
    error,
    refetch: fetchProjects,
    createProject,
    deleteProject,
    updateTaskInProjects,
    updateProjectInProjects,
    toggleProjectStatus,
  };
}
