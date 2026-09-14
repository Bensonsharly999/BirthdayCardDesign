export const ACCENT_QUOTES = [
  'Shine so bright the year has to follow you.',
  'This is your unstoppable, beautiful era.',
  'Make a wish — then become the wish.',
  'You were born to light up rooms.',
  'Love loudly. Dream wildly. Celebrate you.',
  'Another trip around the sun, still legendary.',
  'Your joy is the main event today.',
  'The world is luckier because you are in it.',
  'Glow like the fireworks were made for you.',
  'Rise. Sparkle. Repeat.',
  'You are rare gold — never ordinary.',
  'Elegance looks like you on your birthday.',
  'Fortune favors the one who shines like this.',
  'A toast to the masterpiece you are becoming.',
  'Born brilliant. Destined for more.',
  'May every locked door open for you.',
  'Collect milestones like treasures this year.',
  'Your name belongs in golden lights.',
  'Luxury is the way you live, not what you own.',
  'Walk in like the room was waiting for you.',
  'Bloom without asking permission.',
  'Soft heart. Strong spirit. Full bloom.',
  'You make ordinary days feel like spring.',
  'Petals, peace, and a year that loves you back.',
  'Grow gently. Love deeply. Shine anyway.',
  'Your most beautiful season is still unfolding.',
  'Kindness looks stunning on you.',
  'May tenderness find you and stay.',
  'A garden of wishes, all with your name.',
  'Stay in blossom. The world needs your light.',
  'Today the universe throws you a parade.',
  'Extra sprinkles. Extra magic. Extra you.',
  'Make a wish — the stars already said yes.',
  'You make festivals out of ordinary Tuesdays.',
  'Superstar energy, birthday edition.',
  'Keep the giggles coming all year long.',
  'Cake, confetti, and a heart full of wow.',
  'Blast off into your brightest adventure.',
  'The sparkle in the room is you.',
  'Dream in color. Laugh out loud.',
  'New year, same icon — even brighter.',
  'Main character energy unlocked.',
  'No filter needed. You are the moment.',
  'Stay golden. Stay curious. Stay you.',
  'Your next 365 days deserve a standing ovation.',
  'Plot twist: the best chapter starts today.',
  'You don’t need an audience to be iconic.',
  'Take up space. Take the year. Take the joy.',
  'Soft light, strong heart, unforgettable year.',
  'Go be legendary — the calendar is ready.',
];

export function quoteTone(category) {
  if (category === 'gold-black') return 'gold';
  if (category === 'floral-elegant') return 'cream';
  if (category === 'kids-fun') return 'kids';
  return 'dark';
}

function photoRect(photo, canvas) {
  if (!photo) {
    return { x: canvas.width * 0.25, y: canvas.height * 0.18, w: canvas.width * 0.5, h: canvas.height * 0.4, full: false };
  }
  if (photo.frame === 'full') {
    return { x: 0, y: 0, w: canvas.width, h: canvas.height, full: true };
  }
  const centered = ['circle', 'heart', 'star', 'balloon', 'oval', 'diamond', 'polaroid', 'giftbox'].includes(photo.frame);
  if (centered) {
    return { x: photo.x - photo.w / 2, y: photo.y - photo.h / 2, w: photo.w, h: photo.h, full: false };
  }
  return { x: photo.x, y: photo.y, w: photo.w, h: photo.h, full: false };
}

function hitsPhoto(x, y, box, pad = 70) {
  if (!box || box.full) return false;
  return x > box.x - pad && x < box.x + box.w + pad && y > box.y - pad && y < box.y + box.h + pad;
}

export function quotePlacements(canvas, _id, photo) {
  const w = canvas.width;
  const h = canvas.height;
  const box = photoRect(photo, canvas);
  const topSpace = box.full ? h * 0.1 : box.y;
  const bottomSpace = box.full ? h * 0.24 : h - (box.y + box.h);
  const leftSpace = box.full ? 0 : box.x;
  const rightSpace = box.full ? 0 : w - (box.x + box.w);

  let accent;
  if (topSpace >= 120) {
    accent = { x: w * 0.5, y: Math.max(28, topSpace * 0.08), width: w * 0.86, variant: 'banner' };
  } else if (rightSpace >= 300) {
    accent = { x: box.x + box.w + rightSpace / 2, y: Math.max(36, box.y + 8), width: Math.min(rightSpace - 48, 400), variant: 'side' };
  } else if (leftSpace >= 300) {
    accent = { x: leftSpace / 2, y: Math.max(36, box.y + 8), width: Math.min(leftSpace - 48, 400), variant: 'side' };
  } else {
    accent = { x: w * 0.5, y: 24, width: w * 0.86, variant: 'banner' };
  }

  let main;
  if (bottomSpace >= 170) {
    main = { x: w * 0.5, y: box.full ? h * 0.78 : box.y + box.h + 20, width: w * 0.86, variant: 'card' };
  } else if (leftSpace >= 300 && accent.x > w * 0.5) {
    main = { x: leftSpace / 2, y: h * 0.72, width: Math.min(leftSpace - 48, 420), variant: 'card' };
  } else if (rightSpace >= 300 && accent.x < w * 0.5) {
    main = { x: box.x + box.w + rightSpace / 2, y: h * 0.72, width: Math.min(rightSpace - 48, 420), variant: 'card' };
  } else {
    main = { x: w * 0.5, y: h * 0.8, width: w * 0.86, variant: 'banner' };
  }

  return { accent, main };
}

export function partyExtras(canvas, photo, seed = 1) {
  const box = photoRect(photo, canvas);
  const balloonColors = ['#FF4D6D', '#FFD166', '#4CC9F0', '#C77DFF', '#06D6A0', '#F72585', '#FEE440'];
  const cakeColors = [
    { frosting: '#FF6B9D', sponge: '#F6C945' },
    { frosting: '#7BDFF2', sponge: '#FFE5EC' },
    { frosting: '#C9A227', sponge: '#FFF3C4' },
    { frosting: '#9B5DE5', sponge: '#FFD6A5' },
  ];
  const candidates = [
    { x: 88, y: 150 },
    { x: canvas.width - 90, y: 170 },
    { x: 70, y: canvas.height * 0.38 },
    { x: canvas.width - 74, y: canvas.height * 0.42 },
    { x: 96, y: canvas.height - 150 },
    { x: canvas.width - 100, y: canvas.height - 170 },
  ];
  const spots = candidates.filter((p) => !hitsPhoto(p.x, p.y, box, 90));
  const balloons = spots.slice(0, 4).map((p, i) => ({
    x: p.x,
    y: p.y,
    color: balloonColors[(i + seed) % balloonColors.length],
    scale: 0.85 + (i % 3) * 0.18,
  }));
  const cakeSpots = spots.slice(-2);
  const cakes = cakeSpots.map((p, i) => ({
    x: p.x,
    y: p.y + 10,
    scale: 0.95 + (i % 2) * 0.15,
    ...cakeColors[(i + seed) % cakeColors.length],
  }));
  return [
    { type: 'balloons', items: balloons },
    { type: 'cakes', items: cakes },
  ];
}

