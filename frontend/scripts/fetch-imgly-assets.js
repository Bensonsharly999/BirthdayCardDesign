import { createWriteStream, existsSync, mkdirSync, readdirSync, rmSync, statSync, cpSync } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { execFileSync, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const VERSION = '1.7.0';
const URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/package.tgz`;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = path.join(root, 'public', 'imgly');
const tmp = path.join(root, '.imgly-tmp');

function hasModels() {
  if (!existsSync(dest)) return false;
  const names = readdirSync(dest);
  return names.some((name) => name === 'resources.json' || /isnet/i.test(name));
}

function findDist(dir, depth = 0) {
  if (depth > 4 || !existsSync(dir)) return null;
  const entries = readdirSync(dir);
  if (entries.includes('resources.json') || entries.some((name) => /isnet/i.test(name))) return dir;
  for (const name of entries) {
    const next = path.join(dir, name);
    if (statSync(next).isDirectory()) {
      const found = findDist(next, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

async function downloadWithFetch(file) {
  const res = await fetch(URL);
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
}

function downloadWithCurl(file) {
  const result = spawnSync('curl', ['-L', '--fail', '--retry', '3', '-o', file, URL], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('curl download failed');
}

try {
  if (hasModels()) {
    console.log('IMG.LY background-removal assets already in public/imgly');
    process.exit(0);
  }

  mkdirSync(tmp, { recursive: true });
  mkdirSync(dest, { recursive: true });
  const tgz = path.join(tmp, 'package.tgz');
  console.log(`Downloading background-removal models (${VERSION})…`);
  try {
    await downloadWithFetch(tgz);
  } catch (err) {
    console.warn('fetch() failed, trying curl…', err.message);
    downloadWithCurl(tgz);
  }
  execFileSync('tar', ['-xzf', tgz, '-C', tmp], { stdio: 'inherit' });
  const dist = findDist(tmp);
  if (!dist) throw new Error('Downloaded package did not contain model files');
  cpSync(dist, dest, { recursive: true });
  rmSync(tmp, { recursive: true, force: true });
  console.log('IMG.LY assets saved to frontend/public/imgly');
} catch (err) {
  rmSync(tmp, { recursive: true, force: true });
  console.warn('Could not vendor IMG.LY assets. Generate will still work with the original photo.');
  console.warn(String(err?.message || err));
  process.exit(0);
}
