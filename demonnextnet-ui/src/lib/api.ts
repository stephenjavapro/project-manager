import { UserSettings, ProjectItem, TaskItem } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5106';

// Project Items
export async function getProjects(): Promise<ProjectItem[]> {
  const res = await fetch(`${BASE_URL}/api/projectitems`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function getProject(id: number): Promise<ProjectItem> {
  const res = await fetch(`${BASE_URL}/api/projectitems/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch project ${id}`);
  return res.json();
}

export async function createProject(
  data: Omit<ProjectItem, 'id' | 'tasks'>
): Promise<ProjectItem> {
  const res = await fetch(`${BASE_URL}/api/projectitems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateProject(
  id: number,
  data: Omit<ProjectItem, 'tasks'>
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/projectitems/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update project ${id}`);
}

export async function toggleProjectStatus(id: number): Promise<ProjectItem> {
  const res = await fetch(`${BASE_URL}/api/projectitems/${id}/toggle-status`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error(`Failed to toggle status for project ${id}`);
  return res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/projectitems/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete project ${id}`);
}

// Task Items
export async function createTask(
  data: Omit<TaskItem, 'id'>
): Promise<TaskItem> {
  const res = await fetch(`${BASE_URL}/api/taskitems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function getTasks(projectId?: number): Promise<TaskItem[]> {
  const url = projectId
    ? `${BASE_URL}/api/taskitems?projectId=${projectId}`
    : `${BASE_URL}/api/taskitems`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function getTask(id: number): Promise<TaskItem> {
  const res = await fetch(`${BASE_URL}/api/taskitems/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch task ${id}`);
  return res.json();
}

export async function updateTask(
  id: number,
  data: Omit<TaskItem, 'id'>
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/taskitems/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update task ${id}`);
}

export async function toggleTask(id: number): Promise<TaskItem> {
  const res = await fetch(`${BASE_URL}/api/taskitems/${id}/toggle`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error(`Failed to toggle task ${id}`);
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/taskitems/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete task ${id}`);
}

// User Settings
export async function getUserSettings(): Promise<UserSettings> {
  const res = await fetch(`${BASE_URL}/api/usersettings`);
  if (!res.ok) throw new Error('Failed to fetch user settings');
  return res.json();
}

export async function updateUserSettings(
  data: Omit<UserSettings, 'id'>
): Promise<UserSettings> {
  const res = await fetch(`${BASE_URL}/api/usersettings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user settings');
  return res.json();
}
