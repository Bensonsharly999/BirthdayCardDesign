import { removeBackground } from '@imgly/background-removal';

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

async function prepareImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    if (scale >= 0.98) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvasToBlob(canvas, 'image/png');
  } finally {
    URL.revokeObjectURL(url);
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
      stack.push(start);
      labels[start] = label;
      while (stack.length) {
        const p = stack.pop();
        const px = p % width;
        const py = (p / width) | 0;
        sizes[label] += 1;
        cxSums[label] += px;
        cySums[label] += py;
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

  for (let i = 0; i < total; i += 1) {
    if (labels[i] && labels[i] !== best) {
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

  const pad = Math.round(Math.max(subjectW, subjectH) * padRatio);
  const sx = Math.max(0, minX - pad);
  const sy = Math.max(0, minY - pad);
  const sw = Math.min(width - sx, subjectW + pad * 2);
  const sh = Math.min(height - sy, subjectH + pad * 2);
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

async function runRemoval(source, onProgress) {
  const attempts = [
    { model: 'isnet_fp16', device: 'cpu' },
    { model: 'isnet', device: 'cpu' },
  ];
  let lastError = null;
  for (const attempt of attempts) {
    try {
      return await removeBackground(source, {
        debug: false,
        rescale: true,
        proxyToWorker: false,
        model: attempt.model,
        device: attempt.device,
        output: { format: 'image/png', quality: 0.95 },
        progress: (key, current, total) => {
          if (!onProgress || !total) return;
          const ratio = Math.max(0, Math.min(1, current / total));
          onProgress(Math.round(16 + ratio * 68), key);
        },
      });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Background removal failed');
}

export async function isolateSubject(file, onProgress) {
  const prepared = await prepareImage(file);
  const raw = await runRemoval(prepared, onProgress);
  const trimmed = await refineCutout(raw);
  return {
    url: URL.createObjectURL(trimmed),
    cutout: true,
  };
}
