import { Task } from '@/types';
import { getGoogleSheetsClient, SPREADSHEET_ID } from '@/services/google-sheets';

const SHEET_NAME = 'Tasks';
const RANGE = `${SHEET_NAME}!A2:S`; // Skip header row

export interface TaskRepository {
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  createTask(task: Task): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

export class GoogleSheetsTaskRepository implements TaskRepository {
  async getTasks(): Promise<Task[]> {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map((row: string[]) => ({
      id: row[0],
      projectId: row[1],
      teamId: row[2],
      title: row[3],
      description: row[4],
      type: row[5] as any,
      status: row[6] as any,
      priority: row[7] as any,
      assigneeId: row[8],
      reporterId: row[9],
      dueDate: row[10],
      startDate: row[11],
      labels: row[12] ? row[12].split(',') : [],
      milestoneId: row[13],
      githubIssueId: row[14],
      githubIssueNumber: row[15] ? parseInt(row[15]) : undefined,
      githubIssueUrl: row[16],
      createdAt: row[17],
      updatedAt: row[18],
    }));
  }

  async getTask(id: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find(t => t.id === id) || null;
  }

  async createTask(task: Task): Promise<Task> {
    const sheets = await getGoogleSheetsClient();
    
    const rowData = [
      task.id,
      task.projectId,
      task.teamId || '',
      task.title,
      task.description,
      task.type,
      task.status,
      task.priority,
      task.assigneeId || '',
      task.reporterId,
      task.dueDate || '',
      task.startDate || '',
      task.labels.join(','),
      task.milestoneId || '',
      task.githubIssueId || '',
      task.githubIssueNumber?.toString() || '',
      task.githubIssueUrl || '',
      task.createdAt,
      task.updatedAt,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:S`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return task;
  }

  async updateTask(task: Task): Promise<Task> {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows) return task;

    const rowIndex = rows.findIndex((row: string[]) => row[0] === task.id);
    if (rowIndex === -1) throw new Error('Task not found');

    const rowData = [
      task.id,
      task.projectId,
      task.teamId || '',
      task.title,
      task.description,
      task.type,
      task.status,
      task.priority,
      task.assigneeId || '',
      task.reporterId,
      task.dueDate || '',
      task.startDate || '',
      task.labels.join(','),
      task.milestoneId || '',
      task.githubIssueId || '',
      task.githubIssueNumber?.toString() || '',
      task.githubIssueUrl || '',
      task.createdAt,
      task.updatedAt,
    ];

    // +2 because rows are 0-indexed and we skip the header row (A1)
    const updateRange = `${SHEET_NAME}!A${rowIndex + 2}:S${rowIndex + 2}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return task;
  }

  async deleteTask(id: string): Promise<void> {
    // In a real Google Sheets integration, deleting a row requires using the batchUpdate API.
    // For simplicity, we could also just mark it as deleted in a "Status" column if we had one.
    // We'll leave this as a stub for now.
    console.warn(`Deleting task ${id} is not fully implemented yet.`);
  }
}

// Export singleton instance
export const taskRepository = new GoogleSheetsTaskRepository();
