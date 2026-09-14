import { templates } from '../templates';

export function createCards() {
  return templates.map((template, index) => ({
    id: template.id,
    position: index + 1,
    templateId: template.id,
    slug: template.slug,
    category: template.category,
    categoryLabel: template.categoryLabel,
    name: template.name,
    wish: template.wish,
    canvas: template.canvas,
    layout: template.layout,
    template,
  }));
}

export function isSupportedPhoto(file) {
  if (!file) return false;
  const type = String(file.type || '').toLowerCase();
  const name = String(file.name || '').toLowerCase();
  return (
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    type === 'image/pjpeg' ||
    type === 'image/png' ||
    /\.(jpe?g|png)$/i.test(name)
  );
}
