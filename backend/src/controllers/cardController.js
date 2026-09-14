import path from 'path';
import { cardService } from '../services/cardService.js';
import { config } from '../config/env.js';

export const cardController = {
  createSession(req, res) {
    const session = cardService.createSession(req.body?.name);
    res.status(201).json({ data: session });
  },

  getSession(req, res) {
    const session = cardService.getSession(req.params.id);
    res.json({ data: session });
  },

  uploadPhoto(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a JPG or PNG photo.' });
    }
    const relative = path.relative(config.uploadDir, req.file.path).replace(/\\/g, '/');
    const session = cardService.attachPhoto(req.params.id, relative);
    const photoUrl = `/uploads/${relative}`;
    return res.json({ data: { ...session, photoUrl } });
  },

  generate(req, res) {
    const result = cardService.generate(req.params.id);
    res.json({ data: result });
  },

  listCards(req, res) {
    const cards = cardService.listCards(req.params.id);
    res.json({ data: cards, total: cards.length });
  },

  getCard(req, res) {
    const card = cardService.getCard(req.params.id, req.params.position);
    res.json({ data: card });
  },

  download(req, res) {
    const templateId = Number(req.body?.templateId);
    if (!templateId) {
      return res.status(400).json({ error: 'templateId is required.' });
    }
    cardService.recordDownload(req.params.id, templateId);
    return res.json({ data: { ok: true } });
  },
};
