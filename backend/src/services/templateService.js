import { templateRepository } from '../repositories/templateRepository.js';

function hydrate(row) {
  if (!row) return null;
  return JSON.parse(row.configJson);
}

export const templateService = {
  list() {
    return templateRepository.findAll().map((row) => {
      const config = JSON.parse(row.configJson);
      return {
        id: row.id,
        slug: row.slug,
        category: row.category,
        categoryLabel: row.categoryLabel,
        name: row.name,
        canvas: config.canvas,
        layout: config.layout,
      };
    });
  },

  listFull() {
    return templateRepository.findAll().map(hydrate);
  },

  getById(id) {
    return hydrate(templateRepository.findById(id));
  },

  count() {
    return templateRepository.count();
  },
};
