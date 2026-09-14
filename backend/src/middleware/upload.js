import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { config } from '../config/env.js';

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() === '.png' ? '.png' : '.jpg';
    cb(null, `${req.params.id}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ok = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype);
  if (!ok) {
    const error = new Error('Only JPG and PNG images are allowed.');
    error.status = 400;
    return cb(error);
  }
  cb(null, true);
}

export const uploadPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024 },
}).single('photo');
