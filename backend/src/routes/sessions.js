import { Router } from 'express';
import { cardController } from '../controllers/cardController.js';
import { uploadPhoto } from '../middleware/upload.js';

export const sessionRouter = Router();

sessionRouter.post('/', cardController.createSession);
sessionRouter.get('/:id', cardController.getSession);
sessionRouter.post(
  '/:id/photo',
  (req, res, next) => {
    uploadPhoto(req, res, (err) => {
      if (!err) return next();
      err.status = 400;
      next(err);
    });
  },
  cardController.uploadPhoto,
);
sessionRouter.post('/:id/generate', cardController.generate);
sessionRouter.get('/:id/cards', cardController.listCards);
sessionRouter.get('/:id/cards/:position', cardController.getCard);
sessionRouter.post('/:id/download', cardController.download);
