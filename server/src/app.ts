import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { serverConfig } from './config.js';
import bundleData from './data/bundle.json' with { type: 'json' };
import { bundleSchema } from './schemas/bundle.schema.js';

let validatedBundle: unknown;
try {
  validatedBundle = bundleSchema.parse(bundleData);
} catch (e) {
  console.error('Bundle data Zod parsing failed, using raw data fallback:', e);
  validatedBundle = bundleData;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

// In-memory fallback store for read-only filesystems (like Vercel serverless)
let ordersInMemory: unknown[] = [];

try {
  if (fs.existsSync(ordersFilePath)) {
    const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
    ordersInMemory = JSON.parse(ordersData) as unknown[];
  } else {
    fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
  }
} catch (e) {
  console.warn('Orders database fallback to in-memory store:', e);
}

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

  app.get('/api/bundle', (_request, response) => {
    response.status(200).json(validatedBundle);
  });

  app.post('/api/orders', (request, response) => {
    try {
      const newOrder = request.body as Record<string, unknown>;
      if (!newOrder || typeof newOrder !== 'object') {
        response.status(400).json({ error: 'Invalid order data' });
        return;
      }
      
      const orderWithId = {
        id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        ...newOrder
      };
      
      ordersInMemory.push(orderWithId);
      
      try {
        fs.writeFileSync(ordersFilePath, JSON.stringify(ordersInMemory, null, 2));
      } catch (writeError) {
        console.warn('Could not write order to disk, kept in memory:', writeError);
      }
      
      response.status(201).json(orderWithId);
    } catch (error) {
      console.error('Failed to save order:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/orders', (_request, response) => {
    try {
      try {
        if (fs.existsSync(ordersFilePath)) {
          const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
          ordersInMemory = JSON.parse(ordersData) as unknown[];
        }
      } catch (readError) {
        console.warn('Could not read orders from disk, using in-memory store:', readError);
      }
      response.status(200).json(ordersInMemory);
    } catch (error) {
      console.error('Failed to read orders:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}
