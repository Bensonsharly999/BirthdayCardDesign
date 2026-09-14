/** 25 distinct birthday-card templates, including 5 full-size party scenes. */

const P = { width: 1080, height: 1350 };

export const categories = [
  { id: 'balloon-frames', label: 'Balloon Frames', range: [1, 7] },
  { id: 'gold-luxury', label: 'Gold Luxury', range: [8, 14] },
  { id: 'soft-botanical', label: 'Soft Botanical', range: [15, 20] },
  { id: 'party-scenes', label: 'Party Scenes', range: [21, 25] },
];

const QUOTES = [
  'Wishing you the best year ahead.',
  'Here is to another year of amazing adventures.',
  'May this day be filled with joy and celebration.',
  'Happy birthday to you — shine all year long.',
  'New achievements, new memories, beautiful moments.',
  'God bless you with lots of happiness and success.',
  'Make a wish — then become the wish.',
  'You were born to light up every room.',
  'Love loudly. Dream wildly. Celebrate you.',
  'The world is luckier because you are in it.',
  'Stay golden, stay curious, stay you.',
  'May every dream you hold become reality.',
  'A toast to the masterpiece you are becoming.',
  'Grow gently, love deeply, and shine anyway.',
  'Today the universe throws you a parade.',
  'Keep dreaming in color and laughing out loud.',
  'This chapter is yours. Make it unforgettable.',
  'May tenderness find you and stay.',
  'Plot twist: the best chapter starts today.',
  'Go be legendary — the calendar is ready.',
  'A sweet note for a sweeter year ahead.',
  'May gold days and bright nights treat you kindly.',
  'Light the candles. Make the wish. The year is yours.',
  'Cake, balloons, and a whole lot of you.',
  'Another trip around the sun — save me a slice.',
];

const WISHES = [
  'May every dream you hold become a beautiful reality this year.',
  'Here is to another year of amazing adventures, new achievements, and all the moments that make life beautiful.',
  'Wishing you a fantastic day filled with joy and celebration.',
  'May your days stay bright, your joy last long, and your smile stay easy.',
  'You deserve a year as vibrant as your spirit. Happy Birthday.',
  'God bless you on your special day with lots of happiness and success.',
  'Here is to possibility, courage, and quiet magic.',
  'May this day wrap you in warmth and lift you with hope.',
  'We celebrate every kind word, brave choice, and beautiful thing you are.',
  'Let this year be yours. Rise, shine, and let happiness find you.',
  'May this birthday bring elegance, abundance, and quiet confidence.',
  'Fortune favors the bold. May this year be golden for you.',
  'A toast to your brilliance — and to the year you are about to write.',
  'May love settle around you like morning light on flowers.',
  'Bloom where you are, then bloom further. Your season is unfolding.',
  'Make a wish — the world is already cheering for you.',
  'May this birthday be louder, brighter, and sweeter than before.',
  'If happiness had a face, it would look a lot like yours today.',
  'Keep dreaming in color and believing in the magic you already are.',
  'Take up space. Take your time. Take the year. Go be iconic.',
  'May this year arrive like a gift — wrapped in joy, tied with love.',
  'Here is to laughter that lingers and wishes that come true.',
  'Blow out the candles. Keep the spark. Happy Birthday.',
  'May your days be layered with sweetness and surprise.',
  'Celebrate loudly, love deeply, and enjoy every slice of the year.',
];

function copy(id) {
  return { quote2: QUOTES[id - 1], wish: WISHES[id - 1] };
}

function categoryFor(id) {
  if (id <= 7) return { category: 'balloon-frames', categoryLabel: 'Balloon Frames' };
  if (id <= 14) return { category: 'gold-luxury', categoryLabel: 'Gold Luxury' };
  if (id <= 20) return { category: 'soft-botanical', categoryLabel: 'Soft Botanical' };
  return { category: 'party-scenes', categoryLabel: 'Party Scenes' };
}

function card(id, name, layout, fields) {
  const { quote2, wish } = copy(id);
  const photo = fields.photo ? { opacity: 1, ...fields.photo } : fields.photo;
  return {
    id,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    ...categoryFor(id),
    name,
    canvas: P,
    layout,
    quote2,
    wish,
    ...fields,
    photo,
  };
}

const H = (text, x, y, extra = {}) => ({
  text,
  x,
  y,
  width: extra.width ?? 1000,
  fontFamily: extra.fontFamily || 'Great Vibes',
  fontSize: extra.fontSize || 108,
  fill: extra.fill || '#16324F',
  align: extra.align || 'center',
  shadowColor: extra.shadowColor,
  shadowBlur: extra.shadowBlur || 0,
  letterSpacing: extra.letterSpacing,
  fontStyle: extra.fontStyle,
});

const N = (x, y, extra = {}) => ({
  x,
  y,
  width: extra.width ?? 1000,
  fontFamily: extra.fontFamily || 'Allura',
  fontSize: extra.fontSize || 88,
  fill: extra.fill || '#16324F',
  align: extra.align || 'center',
  fontStyle: extra.fontStyle,
  plate: extra.plate,
  plateFill: extra.plateFill,
  letterSpacing: extra.letterSpacing,
});

const Q = (x, y, extra = {}) => ({
  x,
  y,
  width: extra.width ?? 1000,
  fontFamily: extra.fontFamily || 'Poppins',
  fontSize: extra.fontSize || 52,
  fill: extra.fill || '#3A3A3A',
  align: extra.align || 'center',
  fontStyle: extra.fontStyle || '600',
  lineHeight: 1.38,
  height: extra.height ?? 160,
  letterSpacing: extra.letterSpacing,
});

const W = (x, y, extra = {}) => ({
  x,
  y,
  width: extra.width ?? 1000,
  fontFamily: extra.fontFamily || 'Cormorant Garamond',
  fontSize: extra.fontSize || 40,
  fill: extra.fill || '#4A4A4A',
  align: extra.align || 'center',
  fontStyle: extra.fontStyle || 'italic',
  lineHeight: 1.42,
  height: extra.height ?? 190,
});

export const templates = [
  card(1, 'Icy Blue Line Frame', 'icy-line-frame', {
    background: { type: 'linear', colors: ['#7EB8D4', '#A9D4EA'], angle: 180 },
    decorations: [
      { type: 'gold-dots', count: 48, seed: 1, color: '#E8C872', canvas: P },
      { type: 'balloon-cluster', x: 140, y: 130, colors: ['#FFFFFF', '#48CAE4', '#D4AF37'], count: 5, scale: 1.15 },
      { type: 'balloon-cluster', x: 940, y: 160, colors: ['#4EA8DE', '#90E0EF', '#FFFFFF'], count: 6, scale: 1.1 },
      { type: 'balloon-cluster', x: 160, y: 1120, colors: ['#48CAE4', '#FFFFFF', '#4EA8DE'], count: 5, scale: 1 },
      { type: 'balloon-cluster', x: 930, y: 1160, colors: ['#1D6A9A', '#48CAE4', '#FFFFFF'], count: 4, scale: 1.05 },
      { type: 'frame-double', inset: 70, color: 'rgba(255,255,255,0.9)' },
    ],
    photo: { frame: 'line-frame', x: 210, y: 250, w: 660, h: 620, borderColor: '#FFFFFF', borderWidth: 3, inset: 14, fill: '#D7ECF6' },
    headline: H('Happy Birthday', 540, 72, { fontSize: 108, fill: '#1B4F72', fontFamily: 'Pacifico' }),
    nameStyle: N(540, 890, { fontSize: 88, fill: '#1B4F72' }),
    quote2Style: Q(540, 990, { fontSize: 52, fill: '#1B4F72', height: 160 }),
    wishStyle: W(540, 1150, { fontSize: 40, fill: '#245571', height: 168 }),
  }),

  card(2, 'Chrome Balloon Portrait', 'chrome-garland-circle', {
    background: { type: 'radial', colors: ['#F4E4B4', '#C9A227'], x: 0.5, y: 0.45, radius: 0.9 },
    decorations: [
      { type: 'bokeh', count: 18, seed: 2, colors: ['rgba(255,255,255,0.28)'], canvas: P },
      { type: 'chrome-garland', x: 620, y: 280, colors: ['#C9A227', '#E8C4B8', '#D8D8D8', '#F5E6C8', '#B76E79'], scale: 1.15 },
    ],
    photo: { frame: 'circle', x: 340, y: 560, w: 520, h: 520, borderWidth: 10, borderColor: '#FFFFFF', fill: '#F8E7C1' },
    headline: H('Happy Birthday', 540, 56, { fontFamily: 'Montserrat', fontSize: 100, fontStyle: '800', fill: '#6B4226', letterSpacing: 2 }),
    nameStyle: N(540, 850, { fontSize: 88, fill: '#6B4226', fontFamily: 'Allura', plate: true, plateFill: '#E8B4B8', width: 720 }),
    quote2Style: Q(540, 980, { fontSize: 52, fill: '#6B4226', fontStyle: 'italic 600', height: 160 }),
    wishStyle: W(540, 1140, { fontSize: 40, fill: '#6B4226', height: 170 }),
  }),

  card(3, 'Noir Gold Square', 'noir-gold-square', {
    background: { type: 'solid', colors: ['#050505'] },
    decorations: [
      { type: 'gold-dots', count: 70, seed: 3, color: '#D4AF37', canvas: P },
      { type: 'balloon-cluster', x: 130, y: 980, colors: ['#111', '#D4AF37', '#1A1A1A'], count: 4, scale: 1.05 },
      { type: 'balloon-cluster', x: 950, y: 980, colors: ['#D4AF37', '#111', '#C9A227'], count: 4, scale: 1.05 },
      { type: 'gifts', items: [{ x: 130, y: 1200, scale: 1.05, boxColor: '#111', ribbonColor: '#D4AF37' }, { x: 950, y: 1200, scale: 1.05, boxColor: '#1A1A1A', ribbonColor: '#C9184A' }] },
    ],
    photo: { frame: 'square', x: 210, y: 260, w: 660, h: 580, borderWidth: 8, borderColor: '#E8C872', fill: '#111' },
    headline: H('Happy Birthday', 540, 58, { fontSize: 110, fill: '#E8C872', shadowColor: '#D4AF37', shadowBlur: 18 }),
    nameStyle: N(540, 870, { fontSize: 88, fill: '#F5E6C8' }),
    quote2Style: Q(540, 980, { fontSize: 52, fill: '#E8D5A3', fontFamily: 'Cinzel', fontStyle: '700', height: 160 }),
    wishStyle: W(540, 1145, { fontSize: 40, fill: '#D9C48A', height: 170 }),
  }),

  card(4, 'Gold Balloons To You', 'gold-right-type', {
    background: { type: 'linear', colors: ['#E8D5A3', '#C9A227'], angle: 120 },
    decorations: [
      { type: 'sparkles', count: 20, seed: 4, color: '#fff', canvas: P },
      { type: 'balloon-cluster', x: 820, y: 280, colors: ['#F5E6C8', '#E8C872', '#D4AF37'], count: 5, scale: 1.35 },
      { type: 'balloon-cluster', x: 900, y: 520, colors: ['#FFF8E7', '#C9A227'], count: 3, scale: 1.1 },
    ],
    photo: { frame: 'rounded', x: 70, y: 420, w: 460, h: 560, radius: 28, borderWidth: 0, fill: '#F3E6C4' },
    headline: H('Happy Birthday', 70, 56, { align: 'left', width: 980, fontSize: 108, fill: '#FFFFFF', fontFamily: 'Great Vibes' }),
    nameStyle: N(70, 175, { align: 'left', width: 900, fontSize: 88, fill: '#FFFFFF', fontFamily: 'Playfair Display', fontStyle: '700' }),
    quote2Style: Q(70, 1005, { align: 'left', width: 960, fontSize: 52, fill: '#5C4318', height: 160 }),
    wishStyle: W(70, 1165, { align: 'left', width: 980, fontSize: 40, fill: '#5C4318', height: 155 }),
  }),

  card(5, 'Sky Quote Card', 'sky-quote-card', {
    background: { type: 'linear', colors: ['#F4F7FB', '#E7EEF6'], angle: 180 },
    decorations: [
      { type: 'balloon-cluster', x: 120, y: 160, colors: ['#4EA8DE', '#90E0EF', '#1D6A9A'], count: 4, scale: 1.35 },
      { type: 'balloon-cluster', x: 980, y: 140, colors: ['#48CAE4', '#023E8A'], count: 3, scale: 1.2 },
      { type: 'balloon-cluster', x: 80, y: 1180, colors: ['#023E8A', '#4EA8DE'], count: 2, scale: 1.1 },
      { type: 'balloon-cluster', x: 980, y: 1220, colors: ['#48CAE4', '#90E0EF'], count: 3, scale: 1.15 },
    ],
    photo: { frame: 'circle', x: 540, y: 430, w: 430, h: 430, borderWidth: 8, borderColor: '#FFFFFF', fill: '#D6EAF8' },
    quotePanel: { x: 50, y: 800, w: 980, h: 510, fill: '#FFFFFF', radius: 36 },
    headline: H('HAPPY Birthday', 540, 48, { fontSize: 104, fill: '#1B4F72', fontFamily: 'Playfair Display', fontStyle: 'italic 700' }),
    nameStyle: N(540, 830, { fontSize: 88, fill: '#1B4F72', fontFamily: 'Montserrat', fontStyle: '800', letterSpacing: 3 }),
    quote2Style: Q(540, 930, { fontSize: 52, fill: '#2C3E50', height: 150 }),
    wishStyle: W(540, 1100, { fontSize: 40, fill: '#34495E', width: 920, height: 200 }),
  }),

  card(6, 'Botanical Leaves', 'botanical-leaves', {
    background: { type: 'solid', colors: ['#F7F1E8'] },
    decorations: [
      { type: 'botanical-corners', colors: ['#6B8F71', '#A3B18A', '#7D8F69', '#C5C7A5'] },
    ],
    photo: { frame: 'rounded', x: 230, y: 260, w: 620, h: 580, radius: 18, borderWidth: 0, fill: '#EFE6D6' },
    headline: H('HAPPY BIRTHDAY', 540, 70, { fontFamily: 'Montserrat', fontSize: 90, fontStyle: '500', fill: '#8A8178', letterSpacing: 4 }),
    nameStyle: N(540, 870, { fontSize: 88, fill: '#6B5F54', fontFamily: 'Playfair Display', fontStyle: 'italic 700' }),
    quote2Style: Q(540, 980, { fontSize: 52, fill: '#6B5F54', height: 160 }),
    wishStyle: W(540, 1145, { fontSize: 40, fill: '#7A7168', height: 170 }),
  }),

  card(7, 'Peach Polaroid', 'peach-polaroid', {
    background: { type: 'linear', colors: ['#F8D5C4', '#F6E2C8'], angle: 160 },
    decorations: [
      { type: 'gifts', items: [{ x: 200, y: 180, scale: 1.4, boxColor: '#F1D4B6', ribbonColor: '#E8C4B8' }] },
      { type: 'hearts', count: 14, seed: 7, colors: ['#111'], canvas: P },
      { type: 'gifts', items: [{ x: 160, y: 1180, scale: 0.9, boxColor: '#111', ribbonColor: '#fff' }, { x: 280, y: 1220, scale: 0.7, boxColor: '#111', ribbonColor: '#fff' }] },
    ],
    photo: { frame: 'polaroid', x: 540, y: 560, w: 520, h: 620, borderColor: '#111', fill: '#E9D5C0', tab: 70, matPad: 18 },
    headline: H('Happy Birthday', 540, 48, { fontSize: 108, fill: '#111', fontFamily: 'Great Vibes', align: 'center' }),
    nameStyle: N(540, 900, { fontSize: 88, fill: '#111', fontFamily: 'Great Vibes' }),
    quote2Style: Q(540, 1000, { fontSize: 52, fill: '#111', height: 160 }),
    wishStyle: W(540, 1160, { fontSize: 40, fill: '#333', height: 160 }),
  }),

  card(8, 'Balloon Arch Studio', 'balloon-arch-disc', {
    background: { type: 'linear', colors: ['#F4F7FA', '#E8EEF4'], angle: 180 },
    decorations: [
      { type: 'balloon-arch', x: 540, y: 430, colors: ['#90E0EF', '#FFFFFF', '#4EA8DE', '#A9D6E5', '#C0C0C0'], scale: 1.15 },
    ],
    photo: { frame: 'circle', x: 540, y: 560, w: 520, h: 520, borderWidth: 0, fill: '#FFFFFF' },
    headline: H('Happy Birthday To you', 540, 48, { fontSize: 100, fill: '#1D3557', fontFamily: 'Pacifico' }),
    nameStyle: N(540, 860, { fontSize: 88, fill: '#1D3557', fontFamily: 'Playfair Display', fontStyle: '700' }),
    quote2Style: Q(540, 970, { fontSize: 52, fill: '#1D3557', height: 160 }),
    wishStyle: W(540, 1135, { fontSize: 40, fill: '#2C3E50', height: 180 }),
  }),

  card(9, 'Gold Confetti Split', 'gold-split-type', {
    background: { type: 'linear', colors: ['#EDE0C4', '#D4B978'], angle: 90 },
    decorations: [
      { type: 'confetti', count: 40, seed: 9, colors: ['#C9A227', '#fff', '#E8C872'], canvas: P },
      { type: 'balloon-cluster', x: 240, y: 280, colors: ['#D4AF37', '#FFFFFF', '#E8C872', '#F5E6C8'], count: 7, scale: 1.25 },
    ],
    photo: { frame: 'circle', x: 260, y: 900, w: 300, h: 300, borderWidth: 8, borderColor: '#FFFFFF', fill: '#F3E6C4' },
    headline: H('HAPPY Birthday', 700, 340, { width: 500, fontSize: 90, fill: '#3B2A12', fontFamily: 'Playfair Display', fontStyle: 'italic 700' }),
    nameStyle: N(700, 540, { width: 500, fontSize: 82, fill: '#3B2A12' }),
    quote2Style: Q(700, 660, { width: 500, fontSize: 48, fill: '#3B2A12', height: 160 }),
    wishStyle: W(700, 850, { width: 500, fontSize: 40, fill: '#4A3720', height: 220 }),
  }),

  card(10, 'Sparkle Orb Night', 'sparkle-orbs', {
    background: { type: 'linear', colors: ['#1A1423', '#3D2C4A'], angle: 180 },
    decorations: [
      { type: 'sparkle-orbs', count: 7, seed: 10, canvas: P },
      { type: 'sparkles', count: 24, seed: 11, color: '#fff', canvas: P },
    ],
    photo: { frame: 'circle', x: 540, y: 620, w: 420, h: 420, borderWidth: 4, borderColor: 'rgba(255,255,255,0.7)', fill: '#2A2035' },
    headline: H('Happy Birthday', 540, 56, { fontSize: 108, fill: '#FFFFFF', shadowColor: 'rgba(255,255,255,0.4)', shadowBlur: 12 }),
    nameStyle: N(540, 175, { fontSize: 88, fill: '#F8E9FF' }),
    quote2Style: Q(540, 1000, { fontSize: 52, fill: '#FFFFFF', height: 160 }),
    wishStyle: W(540, 1160, { fontSize: 40, fill: '#E8D5F5', height: 160 }),
  }),

  card(11, 'Bunting Party Hats', 'bunting-hats', {
    background: { type: 'linear', colors: ['#FFF6E8', '#F8E1B8'], angle: 180 },
    decorations: [
      { type: 'bunting', y: 36, colors: ['#E9C46A', '#2A9D8F', '#E76F51', '#FFFFFF', '#264653'] },
      { type: 'balloon-cluster', x: 140, y: 220, colors: ['#E9C46A', '#FFFFFF', '#111', '#F4A261'], count: 5, scale: 1.1 },
      { type: 'balloon-cluster', x: 940, y: 220, colors: ['#E9C46A', '#FFFFFF', '#111', '#2A9D8F'], count: 5, scale: 1.1 },
      { type: 'party-hats', items: [{ x: 360, y: 1180, color: '#F4A261', stripe: '#E76F51', rotation: -18 }, { x: 720, y: 1180, color: '#E9C46A', stripe: '#fff', rotation: 16 }] },
    ],
    photo: { frame: 'rounded', x: 240, y: 400, w: 600, h: 460, radius: 24, borderWidth: 0, fill: '#F3E6C4' },
    headline: H('Happy Birthday To You', 540, 128, { fontSize: 96, fill: '#5C3A1E', fontFamily: 'Great Vibes' }),
    nameStyle: N(540, 900, { fontSize: 88, fill: '#5C3A1E' }),
    quote2Style: Q(540, 1000, { fontSize: 52, fill: '#5C3A1E', height: 160 }),
    wishStyle: W(540, 1160, { fontSize: 40, fill: '#6B4A28', height: 160 }),
  }),

  card(12, 'Blue Wreath Gifts', 'blue-wreath-gifts', {
    background: { type: 'linear', colors: ['#EEF4FF', '#D6E6FF'], angle: 180 },
    decorations: [
      { type: 'balloon-cluster', x: 120, y: 160, colors: ['#3A86FF', '#90E0EF', '#FFFFFF'], count: 5, scale: 1.2 },
      { type: 'balloon-cluster', x: 960, y: 150, colors: ['#FFFFFF', '#4EA8DE'], count: 4, scale: 1.15 },
      { type: 'balloon-wreath', x: 540, y: 560, radius: 250, colors: ['#3A86FF', '#90E0EF', '#FFFFFF', '#48CAE4', '#5B8DEF'], count: 16, scale: 0.52 },
      { type: 'gifts', items: [{ x: 170, y: 1180, scale: 1.15, boxColor: '#E63946', ribbonColor: '#E9C46A' }, { x: 900, y: 1180, scale: 1.2, boxColor: '#3A86FF', ribbonColor: '#FFFFFF' }] },
    ],
    photo: { frame: 'circle', x: 540, y: 560, w: 360, h: 360, borderWidth: 10, borderColor: '#3A86FF', fill: '#EAF4FF' },
    headline: H('Happy Birthday', 540, 48, { fontSize: 108, fill: '#1D4ED8', fontFamily: 'Great Vibes' }),
    nameStyle: N(540, 890, { fontSize: 88, fill: '#1E3A8A', fontFamily: 'Montserrat', fontStyle: '700' }),
    quote2Style: Q(540, 990, { fontSize: 52, fill: '#1E3A8A', height: 160 }),
    wishStyle: W(540, 1150, { fontSize: 40, fill: '#1E40AF', height: 168 }),
  }),

  card(13, 'Cream Gold Ring', 'cream-gold-ring', {
    background: { type: 'solid', colors: ['#F4EBD8'] },
    decorations: [
      { type: 'gold-dots', count: 36, seed: 13, color: '#C9A227', canvas: P },
      { type: 'balloon-cluster', x: 150, y: 620, colors: ['#D4AF37', '#FFFFFF', '#E8C872', '#F5E6C8'], count: 7, scale: 1.05 },
      { type: 'balloon-cluster', x: 930, y: 620, colors: ['#D4AF37', '#FFFFFF', '#E8C872', '#F5E6C8'], count: 7, scale: 1.05 },
    ],
    photo: { frame: 'circle', x: 540, y: 520, w: 400, h: 400, borderWidth: 18, borderColor: '#C9A227', fill: '#EFE0C0' },
    headline: H('Happy Birthday', 540, 56, { fontSize: 108, fill: '#C9A227', fontFamily: 'Great Vibes' }),
    nameStyle: N(540, 760, { fontSize: 88, fill: '#6B4F2A', fontFamily: 'Playfair Display', fontStyle: '700' }),
    quote2Style: Q(540, 870, { fontSize: 52, fill: '#6B4F2A', height: 160 }),
    wishStyle: W(540, 1040, { fontSize: 40, fill: '#7A5C34', height: 180 }),
  }),

  card(14, 'Kraft Photo Box', 'kraft-rect', {
    background: { type: 'solid', colors: ['#E7D5B8'] },
    decorations: [
      { type: 'botanical-corners', colors: ['#6B5F4A', '#A89880', '#8A7A62', '#C4B49A'] },
      { type: 'script-flourish', x: 540, y: 200, color: '#3B2A12' },
    ],
    photo: { frame: 'rounded', x: 250, y: 260, w: 580, h: 580, radius: 8, borderWidth: 0, fill: '#C4B49A' },
    headline: H('Happy Birthday', 540, 58, { fontSize: 108, fill: '#2C2416', fontFamily: 'Great Vibes' }),
    nameStyle: N(540, 870, { fontSize: 88, fill: '#2C2416' }),
    quote2Style: Q(540, 980, { fontSize: 52, fill: '#2C2416', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', height: 160 }),
    wishStyle: W(540, 1145, { fontSize: 40, fill: '#3B2A12', height: 170 }),
  }),

  card(15, 'Blush Circle Studio', 'blush-circle', {
    background: { type: 'linear', colors: ['#FDE2E4', '#FFF0F3'], angle: 160 },
    decorations: [
      { type: 'balloon-bouquet', x: 160, y: 240, colors: ['#FF8FAB', '#FFFFFF', '#FFB6C1'], scale: 1.1 },
      { type: 'hearts', count: 12, seed: 15, colors: ['#C9184A'], canvas: P },
    ],
    photo: { frame: 'circle', x: 640, y: 520, w: 460, h: 460, borderWidth: 12, borderColor: '#FFFFFF', fill: '#FADDE1' },
    headline: H('Happy Birthday', 540, 48, { fontSize: 108, fill: '#9B2335' }),
    nameStyle: N(540, 790, { fontSize: 88, fill: '#9B2335', plate: true, plateFill: '#F4ACB7', width: 760 }),
    quote2Style: Q(540, 900, { fontSize: 52, fill: '#9B2335', height: 160 }),
    wishStyle: W(540, 1060, { fontSize: 40, fill: '#7A1F2E', height: 180 }),
  }),

  card(16, 'Mint Oval Garden', 'mint-oval', {
    background: { type: 'linear', colors: ['#E9F5DB', '#D8F3DC'], angle: 180 },
    decorations: [
      { type: 'botanical-corners', colors: ['#40916C', '#74C69D', '#1B4332', '#95D5B2'] },
      { type: 'petals', count: 10, seed: 16, colors: ['#95D5B2', '#D8F3DC'], canvas: P },
    ],
    photo: { frame: 'oval', x: 540, y: 520, w: 420, h: 520, borderWidth: 8, borderColor: '#40916C', fill: '#E9F5DB' },
    headline: H('Happy Birthday', 540, 48, { fontSize: 104, fill: '#1B4332' }),
    nameStyle: N(540, 810, { fontSize: 88, fill: '#1B4332', fontFamily: 'Playfair Display', fontStyle: 'italic 700' }),
    quote2Style: Q(540, 920, { fontSize: 52, fill: '#1B4332', height: 160 }),
    wishStyle: W(540, 1080, { fontSize: 40, fill: '#2D6A4F', height: 180 }),
  }),

  card(17, 'Split Magazine', 'split-magazine', {
    background: { type: 'solid', colors: ['#FAF7F2'] },
    decorations: [
      { type: 'block', x: 0, y: 0, w: 520, h: 1350, color: '#1A1A1A' },
      { type: 'gold-dots', count: 20, seed: 17, color: '#D4AF37', canvas: P },
    ],
    photo: { frame: 'rounded', x: 30, y: 180, w: 460, h: 980, radius: 0, borderWidth: 0, fill: '#222' },
    headline: H('Happy Birthday', 560, 70, { align: 'left', width: 480, fontSize: 84, fill: '#1A1A1A' }),
    nameStyle: N(560, 250, { align: 'left', width: 480, fontSize: 80, fill: '#C9A227', fontFamily: 'Playfair Display', fontStyle: '700' }),
    quote2Style: Q(560, 820, { align: 'left', width: 490, fontSize: 48, fill: '#1A1A1A', height: 180 }),
    wishStyle: W(560, 1020, { align: 'left', width: 490, fontSize: 40, fill: '#333', height: 260 }),
  }),

  card(18, 'Navy Gold Oval', 'navy-gold-oval', {
    background: { type: 'solid', colors: ['#0B1D36'] },
    decorations: [
      { type: 'gold-dots', count: 55, seed: 18, color: '#E8C872', canvas: P },
      { type: 'balloon-cluster', x: 140, y: 200, colors: ['#0B1D36', '#D4AF37', '#12264A'], count: 4, scale: 1.1 },
      { type: 'balloon-cluster', x: 940, y: 1100, colors: ['#D4AF37', '#0B1D36'], count: 4, scale: 1 },
    ],
    photo: { frame: 'oval', x: 540, y: 500, w: 430, h: 500, borderWidth: 10, borderColor: '#E8C872', fill: '#12264A' },
    headline: H('Happy Birthday', 540, 52, { fontSize: 108, fill: '#E8C872' }),
    nameStyle: N(540, 790, { fontSize: 88, fill: '#F5E6C8' }),
    quote2Style: Q(540, 900, { fontSize: 52, fill: '#F5E6C8', fontFamily: 'Cinzel', fontStyle: '700', height: 160 }),
    wishStyle: W(540, 1060, { fontSize: 40, fill: '#E8D5A3', height: 180 }),
  }),

  card(19, 'White Minimal Corner', 'white-minimal', {
    background: { type: 'solid', colors: ['#FFFEFB'] },
    decorations: [
      { type: 'balloon-cluster', x: 900, y: 180, colors: ['#F4B6C9', '#FFFFFF', '#E8C872'], count: 5, scale: 1.2 },
      { type: 'balloon-cluster', x: 160, y: 1180, colors: ['#90E0EF', '#FFFFFF'], count: 3, scale: 0.95 },
    ],
    photo: { frame: 'rounded', x: 240, y: 300, w: 600, h: 560, radius: 40, borderWidth: 0, fill: '#F4F1EA' },
    headline: H('Happy Birthday', 540, 56, { fontSize: 108, fill: '#222' }),
    nameStyle: N(540, 890, { fontSize: 88, fill: '#222', fontFamily: 'Playfair Display', fontStyle: 'italic 700' }),
    quote2Style: Q(540, 990, { fontSize: 52, fill: '#333', height: 160 }),
    wishStyle: W(540, 1150, { fontSize: 40, fill: '#444', height: 168 }),
  }),

  card(20, 'Rose Gold Diamond Frame', 'rose-diamond-frame', {
    background: { type: 'linear', colors: ['#F6D1C1', '#E8B4B8'], angle: 150 },
    decorations: [
      { type: 'confetti', count: 28, seed: 20, colors: ['#fff', '#C9A227', '#C9184A'], canvas: P },
      { type: 'balloon-cluster', x: 150, y: 200, colors: ['#FFFFFF', '#E8B4B8', '#C9A227'], count: 5, scale: 1.1 },
      { type: 'balloon-cluster', x: 930, y: 1120, colors: ['#FFFFFF', '#C9A227'], count: 4, scale: 1 },
      { type: 'frame-double', inset: 56, color: 'rgba(255,255,255,0.8)' },
    ],
    photo: { frame: 'line-frame', x: 220, y: 260, w: 640, h: 600, borderColor: '#FFFFFF', borderWidth: 3, inset: 18, fill: '#F8E1DC' },
    headline: H('Happy Birthday', 540, 58, { fontSize: 108, fill: '#7A2E4A' }),
    nameStyle: N(540, 890, { fontSize: 88, fill: '#7A2E4A' }),
    quote2Style: Q(540, 990, { fontSize: 52, fill: '#7A2E4A', height: 160 }),
    wishStyle: W(540, 1150, { fontSize: 40, fill: '#8B3A56', height: 168 }),
  }),

  card(21, 'Envelope Gift Note', 'envelope-gift-note', {
    background: { type: 'solid', colors: ['#F3E6D8'] },
    decorations: [
      { type: 'envelope-scene', canvas: P },
      { type: 'gifts', foreground: true, items: [{ x: 900, y: 860, scale: 1.15, boxColor: '#2F9E44', ribbonColor: '#FFFFFF' }, { x: 820, y: 900, scale: 0.82, boxColor: '#E76F51', ribbonColor: '#F4D35E' }] },
    ],
    photo: { frame: 'rounded', fit: 'cover', x: 92, y: 200, w: 896, h: 700, radius: 8, borderWidth: 0, fill: '#F7F1EA' },
    headline: H('Happy Birthday', 540, 48, { fontSize: 92, fill: '#7A2E4A', fontFamily: 'Great Vibes' }),
    nameStyle: N(540, 920, { fontSize: 80, fill: '#5C3317' }),
    quote2Style: Q(540, 1020, { fontSize: 48, fill: '#6B4A28', height: 140 }),
    wishStyle: W(540, 1170, { fontSize: 38, fill: '#7A5C34', height: 150 }),
  }),

  card(22, 'Gold Navy Balloon Column', 'gold-navy-balloons', {
    background: { type: 'linear', colors: ['#F3E6D0', '#E8D5B5'], angle: 180 },
    decorations: [
      { type: 'balloon-column', x: 850, y: 40, count: 16, scale: 1.18, seed: 22, colors: ['#C9A227', '#163A6B', '#E8C872', '#0F2C54', '#D4AF37', '#1D4E89'] },
    ],
    photo: { frame: 'rounded', fit: 'cover', x: 48, y: 200, w: 700, h: 660, radius: 28, borderWidth: 0, fill: '#EDE0C8' },
    headline: H('Happy Birthday', 70, 42, { align: 'left', width: 720, fontSize: 80, fill: '#6B4226', fontFamily: 'Great Vibes' }),
    nameStyle: N(70, 890, { align: 'left', width: 680, fontSize: 72, fill: '#6B4226' }),
    quote2Style: Q(70, 990, { align: 'left', width: 680, fontSize: 42, fill: '#6B4226', height: 140 }),
    wishStyle: W(70, 1160, { align: 'left', width: 680, fontSize: 34, fill: '#7A5C34', height: 160 }),
  }),

  card(23, 'Candle Cake Studio', 'candle-cake-studio', {
    background: { type: 'linear', colors: ['#8EC8E3', '#B9DFF0'], angle: 180 },
    decorations: [
      { type: 'sprinkles', count: 28, seed: 23, colors: ['#FF8FAB', '#FEE440', '#90E0EF', '#C77DFF'], canvas: P },
      { type: 'party-cake', x: 800, y: 1080, scale: 0.92, foreground: true },
    ],
    photo: { frame: 'rounded', fit: 'cover', x: 48, y: 188, w: 984, h: 700, radius: 28, borderWidth: 0, fill: '#D6EAF8' },
    headline: H('Happy Birthday', 540, 42, { fontSize: 96, fill: '#1B4F72', fontFamily: 'Pacifico' }),
    nameStyle: N(48, 910, { align: 'left', width: 620, fontSize: 76, fill: '#1B4F72' }),
    quote2Style: Q(48, 1010, { align: 'left', width: 620, fontSize: 44, fill: '#245571', height: 130 }),
    wishStyle: W(48, 1160, { align: 'left', width: 620, fontSize: 36, fill: '#2C5F78', height: 150 }),
  }),

  card(24, 'Mint Party Table', 'mint-party-table', {
    background: { type: 'linear', colors: ['#BFE8E2', '#9FDDD4'], angle: 180 },
    decorations: [
      { type: 'table-band', y: 1120, color: '#F4A7C1' },
      { type: 'balloon-bouquet', x: 170, y: 250, colors: ['#FF8FAB', '#F4D35E', '#FF9F1C', '#90E0EF', '#C77DFF'], scale: 1.05 },
      { type: 'gifts', items: [{ x: 130, y: 1040, scale: 0.95, boxColor: '#F4A261', ribbonColor: '#FFFFFF' }, { x: 230, y: 1070, scale: 0.7, boxColor: '#3A86FF', ribbonColor: '#FEE440' }] },
      { type: 'layer-cake', x: 300, y: 980, scale: 1.05 },
    ],
    photo: { frame: 'rounded', fit: 'cover', x: 500, y: 188, w: 540, h: 900, radius: 32, borderWidth: 0, fill: '#D8F3DC' },
    headline: H('Happy Birthday', 540, 40, { fontSize: 84, fill: '#1B4332', fontFamily: 'Pacifico' }),
    nameStyle: N(40, 820, { align: 'left', width: 430, fontSize: 64, fill: '#1B4332' }),
    quote2Style: Q(40, 930, { align: 'left', width: 430, fontSize: 40, fill: '#1B4332', height: 150 }),
    wishStyle: W(40, 1100, { align: 'left', width: 430, fontSize: 34, fill: '#245C46', height: 200 }),
  }),

  card(25, 'Cream Drip Celebration', 'cream-drip-celebration', {
    background: { type: 'linear', colors: ['#F7EFE4', '#F3E6D4'], angle: 210 },
    decorations: [
      { type: 'balloon-bouquet', x: 170, y: 210, colors: ['#90E0EF', '#FF8FAB', '#80ED99', '#F4A261', '#C77DFF'], scale: 1.12 },
      { type: 'hearts', count: 16, seed: 25, colors: ['#F4A261', '#FF8FAB', '#90E0EF'], canvas: P },
      { type: 'drip-cake', x: 220, y: 980, scale: 1.2 },
    ],
    photo: { frame: 'rounded', fit: 'cover', x: 520, y: 210, w: 520, h: 880, radius: 28, borderWidth: 0, fill: '#F3E6D4' },
    headline: H('Happy Birthday', 540, 40, { fontSize: 88, fill: '#6B4226', fontFamily: 'Great Vibes' }),
    nameStyle: N(40, 820, { align: 'left', width: 450, fontSize: 64, fill: '#6B4226' }),
    quote2Style: Q(40, 930, { align: 'left', width: 450, fontSize: 40, fill: '#6B4226', height: 150 }),
    wishStyle: W(40, 1100, { align: 'left', width: 450, fontSize: 34, fill: '#7A5C34', height: 200 }),
  }),
];

export function getTemplateById(id) {
  return templates.find((t) => t.id === Number(id)) ?? null;
}

export function getTemplatesByCategory(category) {
  return templates.filter((t) => t.category === category);
}
