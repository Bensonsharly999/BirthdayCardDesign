import { getDb } from '../database/db.js';

export const templateRepository = {
  findAll() {
    return getDb()
      .prepare(
        `SELECT id, slug, category, category_label as categoryLabel, name, config_json as configJson
         FROM templates ORDER BY id ASC`,
      )
      .all();
  },

  findById(id) {
    return getDb()
      .prepare(
        `SELECT id, slug, category, category_label as categoryLabel, name, config_json as configJson
         FROM templates WHERE id = ?`,
      )
      .get(id);
  },

  count() {
    return getDb().prepare('SELECT COUNT(*) as count FROM templates').get().count;
  },
};
