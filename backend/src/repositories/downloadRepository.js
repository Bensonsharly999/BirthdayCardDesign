import { getDb } from '../database/db.js';

export const downloadRepository = {
  create({ sessionId, templateId }) {
    const result = getDb()
      .prepare('INSERT INTO downloads (session_id, template_id) VALUES (?, ?)')
      .run(sessionId, templateId);
    return result.lastInsertRowid;
  },
};
