import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { templates } from './templates.js';
import { wishes } from './wishes.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(dir, 'templates.json'), JSON.stringify(templates, null, 2));
fs.writeFileSync(path.join(dir, 'wishes.json'), JSON.stringify(wishes, null, 2));
console.log(`Wrote ${templates.length} templates and ${wishes.length} wishes.`);
