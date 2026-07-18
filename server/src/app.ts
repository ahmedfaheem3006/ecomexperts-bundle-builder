import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { serverConfig } from './config.js';
import bundleData from './data/bundle.json' with { type: 'json' };
import { bundleSchema } from './schemas/bundle.schema.js';

const validatedBundle = bundleSchema.parse(bundleData);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

if (!fs.existsSync(ordersFilePath)) {
  fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
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
      
      const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
      const orders = JSON.parse(ordersData) as unknown[];
      
      const orderWithId = {
        id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        ...newOrder
      };
      
      orders.push(orderWithId);
      fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
      
      response.status(201).json(orderWithId);
    } catch (error) {
      console.error('Failed to save order:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/orders', (_request, response) => {
    try {
      const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
      const orders = JSON.parse(ordersData) as unknown[];
      response.status(200).json(orders);
    } catch (error) {
      console.error('Failed to read orders:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}
