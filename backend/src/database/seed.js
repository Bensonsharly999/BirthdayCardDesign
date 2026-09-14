import { templates } from '../../../shared/templates.js';
import { getDb } from './db.js';

export function seedTemplates() {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO templates (id, slug, category, category_label, name, config_json)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      category = excluded.category,
      category_label = excluded.category_label,
      name = excluded.name,
      config_json = excluded.config_json
  `);

  const tx = db.transaction((rows) => {
    for (const row of rows) {
      upsert.run(row.id, row.slug, row.category, row.categoryLabel, row.name, row.configJson);
    }
  });

  tx(
    templates.map((t) => ({
      id: t.id,
      slug: t.slug,
      category: t.category,
      categoryLabel: t.categoryLabel,
      name: t.name,
      configJson: JSON.stringify(t),
    })),
  );

  return templates.length;
}
