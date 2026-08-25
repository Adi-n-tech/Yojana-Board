export type TaskType = 'Feature' | 'Bug' | 'Task' | 'Improvement' | 'Chore';
export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'In Review' | 'Done' | 'Blocked' | 'Cancelled';
export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Admin' | 'Member' | 'Project Lead';
  workspaceId: string;
}

export interface Team {
  id: string;
  name: string;
  workspaceId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  githubRepositoryUrl?: string;
}

export interface Task {
  id: string;
  projectId: string;
  teamId?: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  reporterId: string;
  dueDate?: string;
  startDate?: string;
  labels: string[]; // e.g. "Firebase", "UI"
  milestoneId?: string;
  githubIssueId?: string;
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
}

export interface Activity {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  timestamp: string;
}
