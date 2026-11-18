import { Request, Response } from 'express';
import { getDbPool } from '../database/mysql.js';

export class HealthController {
  public static async getHealth(_req: Request, res: Response): Promise<void> {
    const memoryUsage = process.memoryUsage();
    let dbStatus = 'healthy';

    try {
      const db = getDbPool();
      await db.query('SELECT 1');
    } catch {
      dbStatus = 'degraded';
    }

    res.status(200).json({
      status: 'UP',
      service: 'campusflow-outbound-engine',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      }
    });
  }
}
