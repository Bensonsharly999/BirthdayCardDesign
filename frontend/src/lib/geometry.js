export function gradientPoints(angle = 180, w, h) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = Math.cos(rad);
  const y = Math.sin(rad);
  return {
    start: { x: w / 2 - (x * w) / 2, y: h / 2 - (y * h) / 2 },
    end: { x: w / 2 + (x * w) / 2, y: h / 2 + (y * h) / 2 },
  };
}

export function colorStops(colors = []) {
  if (!colors.length) return [0, '#000', 1, '#000'];
  if (colors.length === 1) return [0, colors[0], 1, colors[0]];
  return colors.flatMap((c, i) => [i / (colors.length - 1), c]);
}

export function coverFit(image, boxW, boxH, frame) {
  const iw = image.width || 1;
  const ih = image.height || 1;
  const round = frame === 'circle' || frame === 'oval';
  const topGuard = round ? boxH * 0.08 : 0;
  const fitH = Math.max(1, boxH - topGuard);
  const scale = Math.max(boxW / iw, fitH / ih);
  const width = iw * scale;
  const height = ih * scale;
  const x = (boxW - width) / 2;
  let y = topGuard + (fitH - height) / 2;
  if (height > fitH) y = topGuard;
  return { width, height, x, y };
}

/** Fit a cut-out person inside a frame without stretching, keeping the head in view. */
export function subjectFit(image, boxW, boxH, pad = 0.05) {
  const iw = image.width || 1;
  const ih = image.height || 1;
  const innerW = boxW * (1 - pad * 2);
  const innerH = boxH * (1 - pad * 2);
  const scale = Math.min(innerW / iw, innerH / ih);
  const width = iw * scale;
  const height = ih * scale;
  return {
    width,
    height,
    x: (boxW - width) / 2,
    y: boxH * pad,
  };
}

export function fitPhoto(image, boxW, boxH, cutout = false, pad = 0.03) {
  if (!image) return null;
  return cutout ? subjectFit(image, boxW, boxH, pad) : coverFit(image, boxW, boxH);
}

export function isCenterAnchor(frame) {
  return ['circle', 'heart', 'star', 'balloon', 'oval', 'diamond', 'polaroid', 'giftbox'].includes(
    frame,
  );
}

export function photoBox(photo) {
  if (isCenterAnchor(photo.frame)) {
    return { x: photo.x - photo.w / 2, y: photo.y - photo.h / 2, w: photo.w, h: photo.h };
  }
  return { x: photo.x, y: photo.y, w: photo.w, h: photo.h };
}

export function parseFontStyle(raw = '') {
  const value = String(raw);
  const italic = /italic/i.test(value);
  const bold = /(bold|[5-9]00)/i.test(value);
  if (italic && bold) return 'italic bold';
  if (italic) return 'italic';
  if (bold) return 'bold';
  return 'normal';
}

export function clipShape(ctx, frame, w, h) {
  ctx.beginPath();
  if (frame === 'circle') {
    ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  } else if (frame === 'oval') {
    ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  } else if (frame === 'heart') {
    clipHeart(ctx, w, h);
  } else if (frame === 'star') {
    clipStar(ctx, w / 2, h / 2, 5, Math.min(w, h) / 2, Math.min(w, h) / 4.4);
  } else if (frame === 'diamond') {
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(0, h / 2);
    ctx.closePath();
  } else if (frame === 'balloon') {
    ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  } else {
    ctx.rect(0, 0, w, h);
  }
}

function clipHeart(ctx, w, h) {
  const x = w / 2;
  ctx.moveTo(x, h * 0.32);
  ctx.bezierCurveTo(x, h * 0.08, w * 0.08, h * 0.02, w * 0.08, h * 0.36);
  ctx.bezierCurveTo(w * 0.08, h * 0.62, x, h * 0.82, x, h);
  ctx.bezierCurveTo(x, h * 0.82, w * 0.92, h * 0.62, w * 0.92, h * 0.36);
  ctx.bezierCurveTo(w * 0.92, h * 0.02, x, h * 0.08, x, h * 0.32);
  ctx.closePath();
}

function clipStar(ctx, cx, cy, spikes, outer, inner) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < spikes; i += 1) {
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.closePath();
}

export function starPoints(cx, cy, spikes, outer, inner) {
  const points = [];
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes; i += 1) {
    points.push(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
    rot += step;
    points.push(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  return points;
}
