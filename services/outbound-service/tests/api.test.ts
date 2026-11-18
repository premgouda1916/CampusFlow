import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

// Mock MySQL pool for API routing & validation tests
vi.mock('../src/database/mysql.js', () => ({
  getDbPool: () => ({
    query: vi.fn().mockImplementation((sql: string) => {
      if (sql.includes('SELECT 1')) {
        return Promise.resolve([[{ '1': 1 }]]);
      }
      if (sql.includes('outbound_templates')) {
        return Promise.resolve([
          [
            {
              id: 1,
              name: 'Drive Invitation',
              subject: 'Campus Drive',
              bodyTemplate: 'Hello {{studentName}}',
              channel: 'EMAIL',
              createdAt: new Date()
            }
          ]
        ]);
      }
      return Promise.resolve([[]]);
    })
  }),
  initDatabase: vi.fn().mockResolvedValue(undefined)
}));

describe('Outbound Service API Integration Tests', () => {
  const app = createApp();

  it('GET /health returns 200 OK with system status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('campusflow-outbound-engine');
    expect(res.body.database).toBe('healthy');
  });

  it('GET /api/v1/templates returns list of notification templates', async () => {
    const res = await request(app).get('/api/v1/templates');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/campaigns rejects payload missing required fields', async () => {
    const res = await request(app).post('/api/v1/campaigns').send({
      title: 'Incomplete Campaign'
      // missing channel, templateId
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.details).toBeDefined();
  });
});
