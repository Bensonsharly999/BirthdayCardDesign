import { templates } from '../../shared/templates.js';
import { enhanceTemplate } from '../src/lib/readability.js';
import { photoBox } from '../src/lib/geometry.js';

function rect(style) {
  const w = style.width || 1000;
  const x = style.align === 'center' ? style.x - w / 2 : style.x;
  return { x, y: style.y, w, h: style.height || (style.fontSize || 28) * 1.2, label: style._label };
}

function overlap(a, b, pad = 2) {
  return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
}

const names = ['Alex', 'Priya Sharma', 'Christopher Alexander'];
const issues = [];

for (const template of templates) {
  for (const personName of names) {
    const card = enhanceTemplate(template, personName);
    const canvasH = card.canvas.height;
    const boxes = [
      { ...rect(card.headline), label: 'headline' },
      { ...rect(card.nameStyle), label: 'name' },
      { ...rect(card.quote2Style), label: 'quote' },
      { ...rect(card.wishStyle), label: 'wish' },
    ];
    const photo = card.photo ? photoBox(card.photo) : null;
    if (photo) photo.label = 'photo';

    for (let i = 0; i < boxes.length; i += 1) {
      const a = boxes[i];
      if (a.y < -4) issues.push(`${card.id} ${personName}: ${a.label} y=${a.y}`);
      if (a.y + a.h > canvasH - 20) issues.push(`${card.id} ${personName}: ${a.label} overflows canvas (${Math.round(a.y + a.h)} > ${canvasH})`);
      for (let j = i + 1; j < boxes.length; j += 1) {
        const b = boxes[j];
        if (overlap(a, b)) {
          issues.push(`${card.id} ${personName}: ${a.label} overlaps ${b.label} (${Math.round(a.y)}-${Math.round(a.y + a.h)} vs ${Math.round(b.y)}-${Math.round(b.y + b.h)})`);
        }
      }
      if (photo && overlap(a, photo, 2)) {
        issues.push(`${card.id} ${personName}: ${a.label} overlaps photo`);
      }
    }
  }
}

if (issues.length) {
  console.error(`FAIL ${issues.length} issues`);
  issues.forEach((line) => console.error(' -', line));
  process.exit(1);
}

console.log(`OK ${templates.length} templates x ${names.length} names — no text overlap`);
