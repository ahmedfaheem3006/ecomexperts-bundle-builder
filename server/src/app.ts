import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { serverConfig } from './config.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: serverConfig.CLIENT_ORIGIN,
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  return app;
}
