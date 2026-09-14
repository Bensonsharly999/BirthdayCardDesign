import { ACCENT_QUOTES } from './quotes.js';
import { photoBox } from './geometry.js';

const GAP = 16;
const BOTTOM_PAD = 28;
const MIN_QUOTE_H = 148;
const MIN_WISH_H = 168;

function parseRgb(color) {
  if (!color || typeof color !== 'string') return null;
  if (color.startsWith('rgb')) {
    const nums = color.match(/[\d.]+/g) || [];
    if (nums.length < 3) return null;
    return nums.slice(0, 3).map(Number);
  }
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length < 6 || /[^0-9a-f]/i.test(hex.slice(0, 6))) return null;
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

export function luminance(color) {
  const rgb = parseRgb(color);
  if (!rgb) return 0.5;
  const [r, g, b] = rgb.map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function charWidthFactor(family = '') {
  const f = String(family).toLowerCase();
  if (f.includes('vibes') || f.includes('allura') || f.includes('pacifico')) return 0.62;
  if (f.includes('playfair') || f.includes('cinzel') || f.includes('cormorant')) return 0.56;
  return 0.52;
}

export function estimateTextBox(style, text) {
  const fontSize = style.fontSize || 28;
  const width = style.width || 800;
  const lineHeight = style.lineHeight || 1.4;
  const extra = (style.letterSpacing || 0) * Math.max(0, String(text || '').length - 1);
  const usable = Math.max(48, width - extra);
  const charsPerLine = Math.max(8, Math.floor(usable / (fontSize * charWidthFactor(style.fontFamily))));
  const lines = Math.max(1, Math.ceil(String(text || '').length / charsPerLine));
  return {
    width,
    height: Math.round(lines * fontSize * lineHeight + 10),
    lines,
  };
}

function readable(style = {}, role, personName = '') {
  const fill = style.fill || '#FFFFFF';
  const light = luminance(fill) > 0.62;
  let width = style.width || 1000;
  const align = style.align || 'center';
  if ((role === 'quote2' || role === 'wish') && width >= 700) width = Math.max(width, 1000);
  if (role === 'name' && width >= 800 && !style.plate) width = Math.max(width, 1000);
  if (role === 'headline' && width >= 880 && align === 'center') width = Math.max(width, 1020);
  let fontSize = style.fontSize || 28;
  if (role === 'name') {
    const len = String(personName || '').length;
    if (len > 24) fontSize = Math.max(64, fontSize * 0.82);
    else if (len > 18) fontSize = Math.max(74, fontSize * 0.9);
  }
  return {
    ...style,
    fill,
    width,
    fontSize,
    align,
    lineHeight: style.lineHeight || (role === 'name' ? 1.08 : role === 'headline' ? 1.12 : 1.38),
    shadowColor: light ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.45)',
    shadowBlur: role === 'quote2' || role === 'wish' ? 4 : 8,
    stroke: undefined,
    strokeWidth: 0,
    plate: Boolean(style.plate),
    plateFill: style.plateFill,
    underline: Boolean(style.underline),
  };
}

function textRect(style, height) {
  const w = style.width || 1000;
  const x = style.align === 'center' ? style.x - w / 2 : style.x;
  return { x, y: style.y, w, h: height };
}

function overlapsX(a, b, pad = 8) {
  return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x;
}

function overlapsY(a, b, pad = 0) {
  return a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
}

function rectsOverlap(a, b, pad = 8) {
  return overlapsX(a, b, pad) && overlapsY(a, b, pad);
}

function neededHeight(style, text, minH) {
  const estimated = estimateTextBox(style, text).height + 18;
  return Math.max(minH, estimated);
}

function avoidPhoto(item, photo, canvasH) {
  if (!photo) return;
  const box = textRect(item.style, item.h);
  if (!rectsOverlap(box, photo, 4)) return;
  const below = photo.y + photo.h + GAP;
  const above = photo.y - item.h - GAP;
  const prefersBelow = item.style.y + item.h / 2 >= photo.y + photo.h * 0.45;
  if (prefersBelow && below + item.h < canvasH - BOTTOM_PAD) {
    item.style.y = below;
    return;
  }
  if (above >= 18) {
    item.style.y = above;
    return;
  }
  if (below + item.h < canvasH - 8) item.style.y = below;
}

function stackItems(items) {
  const ordered = [...items].sort((a, b) => a.style.y - b.style.y || a.order - b.order);
  for (let i = 1; i < ordered.length; i += 1) {
    const prev = ordered[i - 1];
    const cur = ordered[i];
    if (!overlapsX(textRect(prev.style, prev.h), textRect(cur.style, cur.h), 12)) continue;
    const minY = prev.style.y + prev.h + GAP;
    if (cur.style.y < minY) cur.style.y = minY;
  }
}

function packBottom(items, canvasH) {
  const limit = canvasH - BOTTOM_PAD;
  const quote = items.find((item) => item.key === 'quote');
  const wish = items.find((item) => item.key === 'wish');
  const name = items.find((item) => item.key === 'name');
  if (!quote || !wish) return;

  const quoteBox = textRect(quote.style, quote.h);
  const wishBox = textRect(wish.style, wish.h);
  if (!overlapsX(quoteBox, wishBox, 12)) {
    if (wish.style.y + wish.h > limit) wish.style.y = Math.max(18, limit - wish.h);
    return;
  }

  const nameBox = name ? textRect(name.style, name.h) : null;
  let bandTop = quote.style.y;
  if (name && overlapsX(nameBox, quoteBox, 12)) {
    bandTop = Math.max(bandTop, name.style.y + name.h + GAP);
  }

  const available = Math.max(200, limit - bandTop);
  const gap = GAP;
  let quoteH = quote.h;
  let wishH = wish.h;
  if (quoteH + gap + wishH > available) {
    const extra = quoteH + gap + wishH - available;
    const qCut = Math.min(extra, Math.max(0, quoteH - 88));
    quoteH -= qCut;
    const wCut = Math.min(extra - qCut, Math.max(0, wishH - 128));
    wishH -= wCut;
  }

  quote.h = quoteH;
  wish.h = wishH;
  quote.style.y = bandTop;
  wish.style.y = Math.min(quote.style.y + quote.h + gap, limit - wish.h);
  quote.h = Math.max(64, wish.style.y - quote.style.y - gap);
}

function clampCard(items, photo, canvasH) {
  const limit = canvasH - 24;
  const headline = items.find((item) => item.key === 'headline');
  const name = items.find((item) => item.key === 'name');
  const quote = items.find((item) => item.key === 'quote');
  const wish = items.find((item) => item.key === 'wish');

  if (photo && name) {
    const box = textRect(name.style, name.h);
    if (rectsOverlap(box, photo, 4)) {
      if (name.style.y + name.h / 2 < photo.y + photo.h / 2) {
        const maxH = photo.y - name.style.y - GAP;
        if (maxH >= (name.style.fontSize || 70)) name.h = maxH;
        else name.style.y = photo.y + photo.h + GAP;
      } else {
        name.style.y = photo.y + photo.h + GAP;
      }
    }
  }

  if (headline && name && overlapsX(textRect(headline.style, headline.h), textRect(name.style, name.h), 8)) {
    const minName = headline.style.y + headline.h + 10;
    if (name.style.y < minName) name.style.y = minName;
  }

  if (wish.style.y + wish.h > limit) {
    wish.style.y = limit - wish.h;
  }
  if (quote && overlapsX(textRect(quote.style, quote.h), textRect(wish.style, wish.h), 8)) {
    if (quote.style.y + quote.h + 12 > wish.style.y) {
      quote.h = Math.max(64, wish.style.y - quote.style.y - 16);
    }
  }
  if (name && quote && overlapsX(textRect(name.style, name.h), textRect(quote.style, quote.h), 8)) {
    if (name.style.y + name.h + 8 > quote.style.y) {
      name.h = Math.max(name.style.fontSize || 70, quote.style.y - name.style.y - 12);
    }
  }
}

export function enhanceTemplate(template, personName = '') {
  if (!template) return template;
  const canvasH = template.canvas?.height || 1350;
  const headline = readable(template.headline, 'headline', personName);
  const nameStyle = readable(template.nameStyle, 'name', personName);
  const quote2Style = readable(template.quote2Style, 'quote2', personName);
  const wishStyle = readable(template.wishStyle, 'wish', personName);
  const quote2 = template.quote2 || ACCENT_QUOTES[(template.id - 1) % ACCENT_QUOTES.length];
  const wish = template.wish || '';

  const items = [
    { key: 'headline', style: headline, text: headline.text, h: neededHeight(headline, headline.text, (headline.fontSize || 108) * 1.05), order: 0 },
    { key: 'name', style: nameStyle, text: personName, h: neededHeight(nameStyle, personName, (nameStyle.fontSize || 88) * 1.08) + (nameStyle.plate ? 18 : 0), order: 1 },
    { key: 'quote', style: quote2Style, text: quote2, h: neededHeight(quote2Style, quote2, MIN_QUOTE_H), order: 2 },
    { key: 'wish', style: wishStyle, text: wish, h: neededHeight(wishStyle, wish, MIN_WISH_H), order: 3 },
  ];

  const photo = template.photo ? photoBox(template.photo) : null;
  items.forEach((item) => avoidPhoto(item, photo, canvasH));
  stackItems(items);
  items.forEach((item) => avoidPhoto(item, photo, canvasH));
  stackItems(items);
  packBottom(items, canvasH);
  clampCard(items, photo, canvasH);
  packBottom(items, canvasH);
  clampCard(items, photo, canvasH);

  items.forEach((item) => {
    item.style.height = Math.ceil(item.h);
  });

  let quotePanel = template.quotePanel;
  if (quotePanel) {
    const nameBox = textRect(nameStyle, nameStyle.height);
    const quoteBox = textRect(quote2Style, quote2Style.height);
    const wishBox = textRect(wishStyle, wishStyle.height);
    const top = Math.min(nameBox.y, quoteBox.y) - 22;
    const bottom = Math.max(wishBox.y + wishBox.h, quoteBox.y + quoteBox.h) + 22;
    quotePanel = {
      ...quotePanel,
      y: Math.max(quotePanel.y, top),
      h: Math.max(220, bottom - Math.max(quotePanel.y, top)),
    };
  }

  return {
    ...template,
    headline,
    nameStyle,
    quote2,
    quote2Style,
    wishStyle,
    quotePanel,
    partyExtras: [],
  };
}
