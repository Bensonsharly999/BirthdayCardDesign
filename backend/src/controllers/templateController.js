import { templateService } from '../services/templateService.js';

export const templateController = {
  list(_req, res) {
    res.json({ data: templateService.list(), total: templateService.count() });
  },

  listFull(_req, res) {
    res.json({ data: templateService.listFull(), total: templateService.count() });
  },

  get(req, res) {
    const template = templateService.getById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found.' });
    }
    return res.json({ data: template });
  },
};
