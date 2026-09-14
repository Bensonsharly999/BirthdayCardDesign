import { getDb } from '../database/db.js';

export const sessionRepository = {
  create({ id, personName, photoPath }) {
    getDb()
      .prepare('INSERT INTO sessions (id, person_name, photo_path) VALUES (?, ?, ?)')
      .run(id, personName, photoPath ?? null);
    return this.findById(id);
  },

  findById(id) {
    return getDb()
      .prepare(
        `SELECT id, person_name as personName, photo_path as photoPath, created_at as createdAt
         FROM sessions WHERE id = ?`,
      )
      .get(id);
  },

  updatePhoto(id, photoPath) {
    getDb().prepare('UPDATE sessions SET photo_path = ? WHERE id = ?').run(photoPath, id);
    return this.findById(id);
  },
};
