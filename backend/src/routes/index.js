import { Router } from 'express';
import { templateRouter } from './templates.js';
import { sessionRouter } from './sessions.js';
import { templateService } from '../services/templateService.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'wishcraft-ai',
    templates: templateService.count(),
  });
});

apiRouter.use('/templates', templateRouter);
apiRouter.use('/sessions', sessionRouter);
