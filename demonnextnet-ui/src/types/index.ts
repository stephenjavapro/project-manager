export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export interface TaskItem {
  id: number;
  title: string;
  notes?: string;
  isComplete: boolean;
  projectItemId: number;
}

export interface ProjectItem {
  id: number;
  name: string;
  description?: string | null;
  priority: Priority;
  dueDate?: string;
  closedAt?: string | null;
  tasks: TaskItem[];
}

export interface UserSettings {
  id: number;
  dueDateWarningDays: number;
}

type WithCharacterLimit = {
  maxLength: number;
  warningBuffer: number;
};

type WithoutCharacterLimit = {
  maxLength?: never;
  warningBuffer?: never;
};

export type CharacterLimitProps = WithCharacterLimit | WithoutCharacterLimit;