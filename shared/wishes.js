import { templates } from './templates.js';

export const wishes = templates.map((template) => ({
  id: template.id,
  category: template.categoryLabel,
  name: template.name,
  wish: template.wish,
}));
