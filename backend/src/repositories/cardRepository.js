import { getDb } from '../database/db.js';

export const cardRepository = {
  replaceForSession(sessionId, templateIds) {
    const db = getDb();
    const del = db.prepare('DELETE FROM cards WHERE session_id = ?');
    const insert = db.prepare(
      'INSERT INTO cards (session_id, template_id, position) VALUES (?, ?, ?)',
    );
    const tx = db.transaction(() => {
      del.run(sessionId);
      templateIds.forEach((templateId, index) => {
        insert.run(sessionId, templateId, index + 1);
      });
    });
    tx();
  },

  findBySession(sessionId) {
    return getDb()
      .prepare(
        `SELECT c.id, c.session_id as sessionId, c.template_id as templateId, c.position,
                t.slug, t.category, t.category_label as categoryLabel, t.name, t.config_json as configJson
         FROM cards c
         JOIN templates t ON t.id = c.template_id
         WHERE c.session_id = ?
         ORDER BY c.position ASC`,
      )
      .all(sessionId);
  },

  findBySessionAndPosition(sessionId, position) {
    return getDb()
      .prepare(
        `SELECT c.id, c.session_id as sessionId, c.template_id as templateId, c.position,
                t.slug, t.category, t.category_label as categoryLabel, t.name, t.config_json as configJson
         FROM cards c
         JOIN templates t ON t.id = c.template_id
         WHERE c.session_id = ? AND c.position = ?`,
      )
      .get(sessionId, position);
  },
};
