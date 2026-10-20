import { Comment } from '@/types';
import { getGoogleSheetsClient, SPREADSHEET_ID } from '@/services/google-sheets';

const SHEET_NAME = 'Comments';
const RANGE = `${SHEET_NAME}!A:E`;

export class GoogleSheetsCommentRepository {
  async getCommentsForTask(taskId: string): Promise<Comment[]> {
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

      const comments = rows.map((row: string[]) => ({
        id: row[0],
        taskId: row[1],
        authorId: row[2],
        content: row[3],
        createdAt: row[4],
      }));

      return comments.filter((c: Comment) => c.taskId === taskId);
    } catch (error) {
      console.error('Failed to get comments', error);
      return [];
    }
  }

  async createComment(comment: Comment): Promise<Comment> {
    const sheets = await getGoogleSheetsClient();
    
    const rowData = [
      comment.id,
      comment.taskId,
      comment.authorId,
      comment.content,
      comment.createdAt,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return comment;
  }
}

export const commentRepository = new GoogleSheetsCommentRepository();
