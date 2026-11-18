import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Unhandled request error:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid request payload',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST',
    message
  });
};
