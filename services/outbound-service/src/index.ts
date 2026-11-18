import { createApp } from './app.js';
import { env } from './config/env.js';
import { initDatabase, getDbPool } from './database/mysql.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // 1. Initialize DB schema and default templates
    await initDatabase();

    // 2. Start Express app
    const app = createApp();
    const server = app.listen(env.PORT, () => {
      logger.info(`Outbound Campaign Service running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // 3. Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        const pool = getDbPool();
        await pool.end();
        logger.info('MySQL connection pool closed.');
        process.exit(0);
      });

      // Force exit after 10s timeout
      setTimeout(() => {
        logger.error('Force shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start outbound service:', err);
    process.exit(1);
  }
};

startServer();
