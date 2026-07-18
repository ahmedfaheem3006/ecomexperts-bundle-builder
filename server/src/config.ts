import 'dotenv/config';

import { z } from 'zod';

const serverConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65_535).default(3001),
  CLIENT_ORIGIN: z.url().default('http://localhost:5173'),
});

export const serverConfig = serverConfigSchema.parse({
  PORT: process.env['PORT'],
  CLIENT_ORIGIN: process.env['CLIENT_ORIGIN'],
});
