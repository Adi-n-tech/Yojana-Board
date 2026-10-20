import { Activity } from '@/types';
import { getGoogleSheetsClient, SPREADSHEET_ID } from '@/services/google-sheets';

const SHEET_NAME = 'Activities';
const RANGE = `${SHEET_NAME}!A:E`;

export class GoogleSheetsActivityRepository {
  async getActivitiesForTask(taskId: string): Promise<Activity[]> {
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

      const activities = rows.map((row: string[]) => ({
        id: row[0],
        taskId: row[1],
        userId: row[2],
        action: row[3],
        timestamp: row[4],
      }));

      return activities.filter((a: Activity) => a.taskId === taskId);
    } catch (error) {
      console.error('Failed to get activities', error);
      return [];
    }
  }

  async createActivity(activity: Activity): Promise<Activity> {
    const sheets = await getGoogleSheetsClient();
    
    const rowData = [
      activity.id,
      activity.taskId,
      activity.userId,
      activity.action,
      activity.timestamp,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return activity;
  }
}

export const activityRepository = new GoogleSheetsActivityRepository();
