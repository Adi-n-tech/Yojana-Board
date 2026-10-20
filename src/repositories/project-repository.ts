import { Project } from '@/types';
import { getGoogleSheetsClient, SPREADSHEET_ID } from '@/services/google-sheets';

const SHEET_NAME = 'Projects';
const RANGE = `${SHEET_NAME}!A:D`;

export class GoogleSheetsProjectRepository {
  async getProjects(): Promise<Project[]> {
    const sheets = await getGoogleSheetsClient();
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });

      let rows = response.data.values;
      if (!rows || rows.length === 0) return [];

      if (rows[0][0] && rows[0][0].toLowerCase() === 'id') {
        rows = rows.slice(1);
      }

      return rows.map((row: string[]) => ({
        id: row[0],
        name: row[1],
        description: row[2] || '',
        workspaceId: row[3] || 'WS-1',
      }));
    } catch (error) {
      console.error('Failed to get projects', error);
      return [];
    }
  }

  async getProject(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  async createProject(project: Project): Promise<Project> {
    const sheets = await getGoogleSheetsClient();
    
    const rowData = [
      project.id,
      project.name,
      project.description || '',
      project.workspaceId || 'WS-1',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return project;
  }
}

export const projectRepository = new GoogleSheetsProjectRepository();
