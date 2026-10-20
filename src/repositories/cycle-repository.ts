import { Cycle } from '@/types';
import { getGoogleSheetsClient, SPREADSHEET_ID } from '@/services/google-sheets';

const SHEET_NAME = 'Cycles';
const RANGE = `${SHEET_NAME}!A:E`;

export class GoogleSheetsCycleRepository {
  async getCycles(): Promise<Cycle[]> {
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
        projectId: row[1],
        name: row[2],
        startDate: row[3] || '',
        endDate: row[4] || '',
      }));
    } catch (error) {
      console.error('Failed to get cycles', error);
      return [];
    }
  }

  async createCycle(cycle: Cycle): Promise<Cycle> {
    const sheets = await getGoogleSheetsClient();
    
    const rowData = [
      cycle.id,
      cycle.projectId,
      cycle.name,
      cycle.startDate,
      cycle.endDate,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return cycle;
  }
}

export const cycleRepository = new GoogleSheetsCycleRepository();
