"use client";

import { Fragment } from "react";
import { FolderPlus } from "lucide-react";

import { useState, useRef, useEffect } from "react";

import type { ProjectFormData } from "@/components/CreateProjectForm/CreateProjectForm";
import EditProjectForm, { EditProjectFormData } from "@/components/EditProjectForm/EditProjectForm";
import type { ProjectItem } from "@/types";

import { updateProject, createTask, deleteTask } from "@/lib/api";

import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal";
import CreateProjectForm from "@/components/CreateProjectForm/CreateProjectForm";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";

import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";

import styles from "./page.module.scss";

export default function Home() {
    const {
        projects,
        hasLoadedProjects,
        isLoading,
        error,
        createProject,
        refetch,
        deleteProject,
        updateTaskInProjects,
        toggleProjectStatus,
    } = useProjects();
    const { toggleTask, error: taskError } = useTasks();
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const wasAddingProject = useRef(false);
    const togglingTaskIds = useRef(new Set<number>());

    useEffect(() => {
        if (wasAddingProject.current && !isAddingProject) {
            addButtonRef.current?.focus();
        }
        wasAddingProject.current = isAddingProject;
    }, [isAddingProject]);

    const handleCreateProject = async (data: ProjectFormData) => {
        await createProject(data);
        await refetch();
        setIsAddingProject(false);
    };

    const handleEditProject = async (data: EditProjectFormData) => {
        if (!projectToEdit) return;
        await updateProject(projectToEdit.id, {
            id: projectToEdit.id,
            name: data.name,
            priority: data.priority,
            dueDate: data.dueDate,
            description: data.description,
        });
        await Promise.all([
            ...data.tasksToDelete.map((id) => deleteTask(id)),
            ...data.tasksToAdd.map((task) => createTask(task)),
        ]);
        await refetch();
        setProjectToEdit(null);
    };

    const handleToggleProjectStatus = async (id: number) => {
        await toggleProjectStatus(id);
    };

    const handleDeleteProject = async (id: number) => {
        await deleteProject(id);
    }

    const handleToggleTask = async (id: number, isComplete: boolean) => {
        if (togglingTaskIds.current.has(id)) return;

        const previousTask = projects
            .flatMap((project) => project.tasks)
            .find((task) => task.id === id);
        if (!previousTask || previousTask.isComplete === isComplete) return;

        togglingTaskIds.current.add(id);
        updateTaskInProjects({ ...previousTask, isComplete });

        try {
            const updatedTask = await toggleTask(id);
            updateTaskInProjects(updatedTask ?? previousTask);
        } finally {
            togglingTaskIds.current.delete(id);
        }
    };

    const openProjects = projects.filter((p) => p.closedAt == null);
    const closedProjects = projects.filter((p) => p.closedAt != null);
    const orderedProjects = [...openProjects, ...closedProjects];

    if (isLoading && !hasLoadedProjects) return <p>Loading projects…</p>;

    if (error && !hasLoadedProjects) {
        return (
            <div role="alert">
                <p>Couldn&apos;t load projects: {error}</p>
                <Button
                    label="Try again"
                    variant="tertiary"
                    onClick={refetch}
                />
            </div>
        );
    }

    return (
        <main className={styles.main}>
            <h1>Project Manager</h1>
            {error && hasLoadedProjects && (
                <div role="alert">
                    <p>Couldn&apos;t refresh projects: {error}</p>
                    <Button
                        label="Try again"
                        variant="tertiary"
                        onClick={refetch}
                    />
                </div>
            )}
            {taskError && <p role="alert">{taskError}</p>}
            <Button
                className={styles.addProjectButton}
                ref={addButtonRef}
                label="Add project"
                variant="primary"
                icon={<FolderPlus size={16} />}
                onClick={() => setIsAddingProject(true)}
            />
            <div className={styles.projects}>
                {projects.length === 0 ? (
                    <p>No projects found. Click &quot;Add project&quot; to create one.</p>
                ) : (
                    <ul className={styles.projectSectionList}>
                        {orderedProjects.map((project, index) => {
                            const isClosed = project.closedAt != null;
                            const previousProject = orderedProjects[index - 1];
                            const previousIsClosed = previousProject != null && previousProject.closedAt != null;
                            const heading =
                                index === 0 || isClosed !== previousIsClosed
                                    ? isClosed
                                        ? "Closed"
                                        : "Open"
                                    : null;

                            return (
                                <Fragment key={project.id}>
                                    <li className={styles.projectSectionHeading}>
                                        {heading && <h2>{heading}</h2>}
                                    </li>
                                    <li>
                                        <ProjectCard
                                            project={project}
                                            onEdit={setProjectToEdit}
                                            onClose={handleToggleProjectStatus}
                                            onReopen={handleToggleProjectStatus}
                                            onDelete={handleDeleteProject}
                                            onToggleTask={handleToggleTask}
                                        />
                                    </li>
                                </Fragment>
                            );
                        })}
                    </ul>
                )}
            </div>
            <Modal
                isOpen={isAddingProject}
                onClose={() => setIsAddingProject(false)}
                title="Create Project"
            >
                <CreateProjectForm
                    onSubmit={handleCreateProject}
                    onCancel={() => setIsAddingProject(false)}
                />
            </Modal>
            <Modal
                isOpen={!!projectToEdit}
                onClose={() => setProjectToEdit(null)}
                title="Edit Project"
                >
                {projectToEdit && (
                    <EditProjectForm
                    project={projectToEdit}
                    onSubmit={handleEditProject}
                    onCancel={() => setProjectToEdit(null)}
                    />
                )}
            </Modal>
        </main>
    );
}