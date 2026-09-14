import { removeBackground } from '@imgly/background-removal';

const CUTOUT_TIMEOUT_MS = 45000;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const isLocal = String(src).startsWith('blob:') || String(src).startsWith('data:');
    if (!isLocal) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read photo'));
    img.src = src;
  });
}

function canvasToBlob(canvas, type = 'image/png', quality = 0.95) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not export photo'));
    }, type, quality);
  });
}

function withTimeout(promise, ms, label = 'Background removal timed out') {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      },
    );
  });
}

function modelPublicPath() {
  const base = `${window.location.origin}${import.meta.env.BASE_URL || '/'}`;
  return new URL('imgly/', base.endsWith('/') ? base : `${base}/`).href;
}

async function prepareImage(file) {
  let source = null;
  try {
    source = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    source = null;
  }
  if (!source) {
    const url = URL.createObjectURL(file);
    try {
      source = await loadImage(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  try {
    const max = 1280;
    const scale = Math.min(1, max / Math.max(source.width, source.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(source.width * scale));
    canvas.height = Math.max(1, Math.round(source.height * scale));
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvasToBlob(canvas, 'image/png');
  } finally {
    source.close?.();
  }
}

function hardenAlpha(data) {
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    if (a < 48) {
      data[i] = 0;
    } else if (a > 188) {
      data[i] = 255;
    } else {
      const t = (a - 48) / (188 - 48);
      const s = t * t * (3 - 2 * t);
      data[i] = Math.round(s * 255);
    }
  }
}

function keepMainSubject(data, width, height) {
  const total = width * height;
  const fg = new Uint8Array(total);
  for (let i = 0; i < total; i += 1) {
    fg[i] = data[i * 4 + 3] > 70 ? 1 : 0;
  }

  const labels = new Int32Array(total);
  const sizes = [0];
  const cxSums = [0];
  const cySums = [0];
  const minYs = [0];
  const maxYs = [0];
  let label = 0;
  const stack = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const start = y * width + x;
      if (!fg[start] || labels[start]) continue;
      label += 1;
      sizes[label] = 0;
      cxSums[label] = 0;
      cySums[label] = 0;
      minYs[label] = height;
      maxYs[label] = 0;
      stack.push(start);
      labels[start] = label;
      while (stack.length) {
        const p = stack.pop();
        const px = p % width;
        const py = (p / width) | 0;
        sizes[label] += 1;
        cxSums[label] += px;
        cySums[label] += py;
        if (py < minYs[label]) minYs[label] = py;
        if (py > maxYs[label]) maxYs[label] = py;
        const neighbors = [p - 1, p + 1, p - width, p + width];
        for (let n = 0; n < 4; n += 1) {
          const q = neighbors[n];
          if (q < 0 || q >= total) continue;
          const qx = q % width;
          if (Math.abs(qx - px) + Math.abs(((q / width) | 0) - py) !== 1) continue;
          if (!fg[q] || labels[q]) continue;
          labels[q] = label;
          stack.push(q);
        }
      }
    }
  }

  if (label === 0) return;

  const imgCx = width / 2;
  const imgCy = height / 2;
  const diag = Math.hypot(width, height) || 1;
  let best = 1;
  let bestScore = -1;
  for (let l = 1; l <= label; l += 1) {
    const cx = cxSums[l] / sizes[l];
    const cy = cySums[l] / sizes[l];
    const dist = Math.hypot(cx - imgCx, cy - imgCy) / diag;
    const score = sizes[l] * (1.35 - dist);
    if (score > bestScore) {
      bestScore = score;
      best = l;
    }
  }

  const minKeep = total * 0.008;
  if (sizes[best] < minKeep) return;

  const keep = new Set([best]);
  const bodyCx = cxSums[best] / sizes[best];
  const bodyTop = minYs[best];
  for (let l = 1; l <= label; l += 1) {
    if (l === best) continue;
    const cx = cxSums[l] / sizes[l];
    const nearX = Math.abs(cx - bodyCx) < width * 0.28;
    const touchesHead = maxYs[l] >= bodyTop - height * 0.06 && minYs[l] <= bodyTop + height * 0.22;
    if (nearX && touchesHead && sizes[l] > sizes[best] * 0.015) keep.add(l);
  }

  for (let i = 0; i < total; i += 1) {
    if (labels[i] && !keep.has(labels[i])) {
      data[i * 4 + 3] = 0;
    }
  }
}

function cropToSubject(canvas, ctx, padRatio = 0.03) {
  const { width, height } = canvas;
  const { data } = ctx.getImageData(0, 0, width, height);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) {
    throw new Error('Could not find a person in the photo');
  }

  const subjectW = maxX - minX + 1;
  const subjectH = maxY - minY + 1;
  if (subjectW * subjectH < width * height * 0.012) {
    throw new Error('Could not find a person in the photo');
  }

  const padX = Math.round(Math.max(subjectW * 0.08, width * padRatio));
  const padTop = Math.round(Math.max(subjectH * 0.16, height * 0.04));
  const padBottom = Math.round(Math.max(subjectH * 0.06, height * padRatio));
  const sx = Math.max(0, minX - padX);
  const sy = Math.max(0, minY - padTop);
  const sw = Math.min(width - sx, subjectW + padX * 2);
  const sh = Math.min(height - sy, subjectH + padTop + padBottom);
  const out = document.createElement('canvas');
  out.width = sw;
  out.height = sh;
  out.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
  return out;
}

async function refineCutout(blob) {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    hardenAlpha(imageData.data);
    keepMainSubject(imageData.data, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    const cropped = cropToSubject(canvas, ctx);
    return canvasToBlob(cropped, 'image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function probePublicPath() {
  const candidates = [
    modelPublicPath(),
    'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
  ];
  for (const base of candidates) {
    try {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(new URL('resources.json', base).href, { signal: ctrl.signal });
      window.clearTimeout(timer);
      if (res.ok) return base;
    } catch {
      // try next host
    }
  }
  return null;
}

async function runRemoval(source, onProgress) {
  const publicPath = await probePublicPath();
  if (!publicPath) throw new Error('Background model is not available');
  try {
    return await withTimeout(
      removeBackground(source, {
        debug: false,
        rescale: true,
        proxyToWorker: false,
        publicPath,
        model: 'isnet_quint8',
        device: 'cpu',
        output: { format: 'image/png', quality: 0.95 },
        progress: (key, current, total) => {
          if (!onProgress || !total) return;
          const ratio = Math.max(0, Math.min(1, current / total));
          const downloading = /fetch|download|wasm|model/i.test(String(key || ''));
          onProgress(
            Math.round(14 + ratio * 70),
            downloading ? 'Downloading the photo model… first time can take a minute.' : 'Clearing the photo background…',
          );
        },
      }),
      CUTOUT_TIMEOUT_MS,
    );
  } catch (err) {
    throw err || new Error('Background removal failed');
  }
}

async function originalPreview(file) {
  return {
    url: URL.createObjectURL(file),
    cutout: false,
  };
}

export async function isolateSubject(file, onProgress) {
  onProgress?.(10, 'Preparing your photo…');
  try {
    const prepared = await prepareImage(file);
    const raw = await runRemoval(prepared, onProgress);
    onProgress?.(86, 'Cleaning the cutout…');
    const trimmed = await refineCutout(raw);
    return {
      url: URL.createObjectURL(trimmed),
      cutout: true,
    };
  } catch (err) {
    console.warn('Background removal failed, using original photo', err);
    return originalPreview(file);
  }
}
