import { createApp } from './app.js';
import { config } from './config/env.js';
import { initDb } from './database/db.js';
import { seedTemplates } from './database/seed.js';

const db = await initDb();
const seeded = seedTemplates();
const app = createApp();

app.listen(config.port, () => {
  console.log(`WishCraft AI API running on port ${config.port} (${config.nodeEnv})`);
  console.log(`Seeded ${seeded} birthday card templates.`);
});

void db;
