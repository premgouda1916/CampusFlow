import { getDbPool } from '../database/mysql.js';
import { Template } from '../types/campaign.types.js';

export class TemplateService {
  /**
   * Render template text with dynamic context variables (Mustache syntax)
   */
  public static render(templateStr: string, context: Record<string, any>): string {
    return templateStr.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      return context[key] !== undefined && context[key] !== null ? String(context[key]) : match;
    });
  }

  public static async getAllTemplates(): Promise<Template[]> {
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT id, name, subject, body_template as bodyTemplate, channel, created_at as createdAt FROM outbound_templates ORDER BY id ASC'
    );
    return rows;
  }

  public static async getTemplateById(id: number): Promise<Template | null> {
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT id, name, subject, body_template as bodyTemplate, channel, created_at as createdAt FROM outbound_templates WHERE id = ?',
      [id]
    );
    return rows.length ? rows[0] : null;
  }
}
