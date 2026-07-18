import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from './app.js';
import { bundleSchema } from './schemas/bundle.schema.js';

describe('GET /api/health', () => {
  it('returns the server health status', async () => {
    const response = await request(createApp()).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/bundle', () => {
  it('returns the validated initial Figma bundle data', async () => {
    const response = await request(createApp()).get('/api/bundle');
    const responseBody: unknown = response.body;
    const bundle = bundleSchema.parse(responseBody);

    expect(response.status).toBe(200);
    expect(bundle.source.desktopNodeId).toBe('68:9663');
    expect(bundle.cameras).toHaveLength(5);
    expect(bundle.quantities['wyze-cam-v4:white']).toBe(1);
    expect(bundle.totalsMetadata).toMatchObject({
      compareAtCents: 23881,
      totalCents: 18789,
      savingsCents: 5092,
    });
  });
});
