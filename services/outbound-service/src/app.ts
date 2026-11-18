import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import campaignRoutes from './routes/campaign.routes.js';
import templateRoutes from './routes/template.routes.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = (): Express => {
  const app = express();

  // Security & parsing middleware
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/health', healthRoutes);
  app.use('/api/v1/campaigns', campaignRoutes);
  app.use('/api/v1/templates', templateRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
