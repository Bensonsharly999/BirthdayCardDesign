import { Router } from 'express';
import { templateController } from '../controllers/templateController.js';

export const templateRouter = Router();

templateRouter.get('/', templateController.list);
templateRouter.get('/full', templateController.listFull);
templateRouter.get('/:id', templateController.get);
