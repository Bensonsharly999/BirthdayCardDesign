import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { config } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: config.nodeEnv === 'production' ? true : config.corsOrigin,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));

  fs.mkdirSync(config.uploadDir, { recursive: true });
  app.use('/uploads', express.static(config.uploadDir));
  app.use('/api', apiRouter);

  if (config.nodeEnv === 'production' && fs.existsSync(config.frontendDist)) {
    app.use(express.static(config.frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
      res.sendFile(path.join(config.frontendDist, 'index.html'));
    });
  }

  app.use('/api', notFound);
  app.use(errorHandler);
  return app;
}
