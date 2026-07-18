import 'dotenv/config';

import { z } from 'zod';

const serverConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65_535).default(3001),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
});

let parsedConfig;
try {
  parsedConfig = serverConfigSchema.parse({
    PORT: process.env['PORT'],
    CLIENT_ORIGIN: process.env['CLIENT_ORIGIN'],
  });
} catch (e) {
  console.warn('Failed to parse server config, using defaults:', e);
  parsedConfig = {
    PORT: 3001,
    CLIENT_ORIGIN: 'http://localhost:5173',
  };
}

export const serverConfig = parsedConfig;
