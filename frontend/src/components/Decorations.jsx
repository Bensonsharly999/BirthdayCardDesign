import { Arc, Circle, Ellipse, Group, Line, Rect, RegularPolygon, Star, Text, Wedge } from 'react-konva';
import { mulberry32, pick } from '../lib/random';

const CONFETTI_COLORS = ['#FF4D6D', '#FFD93D', '#6BCB77', '#4D96FF', '#C44DFF', '#FFFFFF', '#FF9F1C'];

export function Decorations({ items = [], canvas }) {
  return (
    <Group listening={false}>
      {items.map((item, index) => (
        <Decoration key={`${item.type}-${index}`} item={item} canvas={canvas} />
      ))}
    </Group>
  );
}

function Decoration({ item, canvas }) {
  switch (item.type) {
    case 'confetti':
      return <Confetti {...item} canvas={canvas} />;
    case 'balloons':
      return <Balloons items={item.items || []} />;
    case 'balloon-cluster':
      return <BalloonCluster {...item} />;
    case 'balloon-row':
      return <BalloonRow {...item} canvas={canvas} />;
    case 'balloon-bouquet':
      return <BalloonBouquet {...item} />;
    case 'gifts':
      return <Gifts items={item.items || []} />;
    case 'bows':
      return <Bows items={item.items || []} />;
    case 'cakes':
      return <Cakes items={item.items || []} />;
    case 'bokeh':
      return <Bokeh {...item} canvas={canvas} />;
    case 'sprinkles':
      return <Sprinkles {...item} canvas={canvas} />;
    case 'notes':
      return <MusicNotes items={item.items || []} />;
    case 'white-stage':
      return <WhiteStage {...item} />;
    case 'subject-glow':
      return (
        <Ellipse
          x={item.x}
          y={item.y}
          radiusX={item.rx || 220}
          radiusY={item.ry || 280}
          fill={item.color || 'rgba(255,255,255,0.4)'}
          opacity={item.opacity ?? 1}
        />
      );
    case 'party-kid':
      return <PartyKid {...item} />;
    case 'sparkles':
      return <Sparkles {...item} canvas={canvas} />;
    case 'stars':
      return <StarsBurst {...item} canvas={canvas} />;
    case 'hearts':
      return <Hearts {...item} canvas={canvas} />;
    case 'dots':
      return <Dots {...item} canvas={canvas} />;
    case 'fireworks':
      return <Fireworks items={item.items || []} />;
    case 'rays':
      return <Sunburst {...item} />;
    case 'rings':
      return <Rings {...item} />;
    case 'corner-ornament':
      return <CornerOrnaments color={item.color} canvas={canvas} />;
    case 'frame-double':
      return <DoubleFrame inset={item.inset || 36} color={item.color} canvas={canvas} />;
    case 'block':
      return (
        <Rect
          x={item.x}
          y={item.y}
          width={item.w}
          height={item.h}
          fill={item.color === 'transparent' ? undefined : item.color}
          stroke={item.stroke}
          strokeWidth={item.strokeWidth || 0}
        />
      );
    case 'diagonal-stripe':
      return <DiagonalStripe color={item.color} thickness={item.thickness || 24} canvas={canvas} />;
    case 'diagonal-split':
      return <DiagonalSplit {...item} canvas={canvas} />;
    case 'vertical-rule':
      return <Line points={[item.x, 80, item.x, canvas.height - 80]} stroke={item.color} strokeWidth={2} />;
    case 'clouds':
      return <Clouds canvas={canvas} seed={item.seed || 1} />;
    case 'wreath':
      return <Wreath {...item} />;
    case 'petals':
      return <Petals {...item} canvas={canvas} />;
    case 'flowers':
      return <Flowers items={item.items || []} />;
    case 'leaves':
      return <Leaves canvas={canvas} seed={item.seed || 1} color={item.color} />;
    case 'corner-flowers':
      return <CornerFlowers colors={item.colors} canvas={canvas} />;
    case 'watercolor-blobs':
      return <WatercolorBlobs {...item} canvas={canvas} />;
    case 'marble-veins':
      return <MarbleVeins canvas={canvas} seed={item.seed || 1} color={item.color} />;
    case 'polka':
      return <Polka canvas={canvas} seed={item.seed || 1} colors={item.colors} />;
    case 'faces':
      return <CuteFaces items={item.items || []} />;
    case 'bunting':
      return <Bunting y={item.y || 40} colors={item.colors} canvas={canvas} />;
    case 'stickers':
      return <Stickers canvas={canvas} seed={item.seed || 1} />;
    case 'halftone':
      return <Halftone canvas={canvas} color={item.color} />;
    case 'burst-badge':
      return <BurstBadge {...item} />;
    case 'grid-lines':
      return <GridLines canvas={canvas} color={item.color} />;
    case 'film-grain':
      return <FilmGrain canvas={canvas} opacity={item.opacity || 0.1} />;
    case 'blobs':
      return item.items?.map((b, i) => <Circle key={i} x={b.x} y={b.y} radius={b.r} fill={b.color} />);
    case 'accent-bar':
      return <Rect x={item.x} y={item.y} width={item.w} height={item.h} fill={item.color} />;
    case 'progress-bar':
      return (
        <Group>
          {Array.from({ length: 8 }).map((_, i) => (
            <Rect
              key={i}
              x={48 + i * 124}
              y={item.y || 36}
              width={112}
              height={6}
              cornerRadius={4}
              fill={i === 0 ? item.color : 'rgba(255,255,255,0.28)'}
            />
          ))}
        </Group>
      );
    case 'offset-frames':
      return <OffsetFrames colors={item.colors} canvas={canvas} />;
    case 'script-flourish':
      return (
        <Line
          x={item.x - 80}
          y={item.y}
          points={[0, 20, 40, 0, 80, 24, 140, 8, 180, 20]}
          stroke={item.color}
          strokeWidth={2}
          tension={0.5}
        />
      );
    case 'chrome-garland':
      return <ChromeGarland {...item} />;
    case 'balloon-wreath':
      return <BalloonWreath {...item} />;
    case 'balloon-arch':
      return <BalloonArch {...item} />;
    case 'party-hats':
      return <PartyHats items={item.items || []} />;
    case 'sparkle-orbs':
      return <SparkleOrbs {...item} />;
    case 'botanical-corners':
      return <BotanicalCorners {...item} canvas={canvas} />;
    case 'gold-dots':
      return <GoldDots {...item} canvas={canvas} />;
    case 'envelope-scene':
      return <EnvelopeScene {...item} canvas={canvas} />;
    case 'balloon-column':
      return <BalloonColumn {...item} />;
    case 'party-cake':
      return <PartyCake {...item} />;
    case 'drip-cake':
      return <DripCake {...item} />;
    case 'layer-cake':
      return <LayerCake {...item} />;
    case 'table-band':
      return (
        <Rect
          x={0}
          y={item.y}
          width={canvas.width}
          height={canvas.height - item.y}
          fill={item.color || '#F4A5C0'}
        />
      );
    default:
      return null;
  }
}

function Confetti({ count = 60, seed = 1, colors = CONFETTI_COLORS, canvas }) {
  const rng = mulberry32(seed);
  const bits = Array.from({ length: count }, (_, i) => ({
    x: rng() * canvas.width,
    y: rng() * canvas.height * 0.66,
    w: 8 + rng() * 14,
    h: 4 + rng() * 8,
    rot: rng() * 360,
    color: pick(rng, colors),
    r: rng() > 0.55,
  }));
  return (
    <Group>
      {bits.map((b, i) =>
        b.r ? (
          <Circle key={i} x={b.x} y={b.y} radius={b.w / 3} fill={b.color} opacity={0.9} />
        ) : (
          <Rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} rotation={b.rot} cornerRadius={2} opacity={0.92} />
        ),
      )}
    </Group>
  );
}

function BalloonShape({ x, y, color, scale = 1, string = true }) {
  const s = 58 * scale;
  return (
    <Group x={x} y={y}>
      {string && <Line points={[0, s * 0.92, 6, s * 2.6]} stroke="rgba(80,80,80,0.35)" strokeWidth={1.6} />}
      <Ellipse x={0} y={0} radiusX={s * 0.78} radiusY={s * 1.05} fill={color} shadowBlur={16} shadowColor="rgba(0,0,0,0.22)" />
      <Ellipse x={-s * 0.28} y={-s * 0.32} radiusX={s * 0.18} radiusY={s * 0.32} fill="rgba(255,255,255,0.42)" />
      <Ellipse x={s * 0.22} y={s * 0.12} radiusX={s * 0.1} radiusY={s * 0.16} fill="rgba(255,255,255,0.18)" />
      <RegularPolygon x={0} y={s * 0.98} sides={3} radius={9 * scale} fill={color} rotation={180} />
    </Group>
  );
}

function BalloonCluster({ x, y, colors = ['#FFB6C1', '#FFF'], count = 5, scale = 1 }) {
  const spots = [
    { dx: 0, dy: 0, s: 1 },
    { dx: -58, dy: 18, s: 0.82 },
    { dx: 62, dy: 10, s: 0.88 },
    { dx: -28, dy: -54, s: 0.7 },
    { dx: 36, dy: -48, s: 0.74 },
    { dx: -80, dy: -20, s: 0.62 },
    { dx: 88, dy: -8, s: 0.66 },
  ].slice(0, count);
  return (
    <Group>
      {spots.map((p, i) => (
        <BalloonShape
          key={i}
          x={x + p.dx * scale}
          y={y + p.dy * scale}
          color={colors[i % colors.length]}
          scale={p.s * scale}
        />
      ))}
    </Group>
  );
}

function BalloonRow({ y, colors, canvas, scale = 0.72 }) {
  const palette = colors || ['#C77DFF', '#F72585', '#FF99C8', '#7B2CBF'];
  const count = 11;
  const gap = canvas.width / count;
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => (
        <BalloonShape
          key={i}
          x={gap * i + gap / 2}
          y={y + (i % 2) * 18}
          color={palette[i % palette.length]}
          scale={scale}
          string={false}
        />
      ))}
    </Group>
  );
}

function BalloonBouquet({ x, y, colors, scale = 1 }) {
  const palette = colors || ['#E0AAFF', '#C77DFF', '#FF99C8', '#FFFFFF'];
  return (
    <Group x={x} y={y}>
      <BalloonCluster x={0} y={0} colors={palette} count={7} scale={scale} />
      <Bow x={8} y={90 * scale} scale={1.1 * scale} color="#E91E8C" />
      <Line points={[8, 100 * scale, -10, 260 * scale]} stroke="#E91E8C" strokeWidth={4} />
      <Line points={[8, 100 * scale, 24, 270 * scale]} stroke="#C77DFF" strokeWidth={4} />
      <Line points={[8, 100 * scale, 48, 250 * scale]} stroke="#FFB6C1" strokeWidth={3} />
    </Group>
  );
}

function Bow({ x, y, color = '#E8B4B8', scale = 1 }) {
  const s = 22 * scale;
  return (
    <Group x={x} y={y}>
      <Ellipse x={-s} y={0} radiusX={s * 0.95} radiusY={s * 0.62} fill={color} rotation={-18} />
      <Ellipse x={s} y={0} radiusX={s * 0.95} radiusY={s * 0.62} fill={color} rotation={18} />
      <Circle radius={s * 0.38} fill={color} />
      <Line closed points={[-4, 6, -28, 34, 2, 14]} fill={color} />
      <Line closed points={[4, 6, 28, 34, -2, 14]} fill={color} />
    </Group>
  );
}

function Bows({ items }) {
  return (
    <Group>
      {items.map((b, i) => (
        <Bow key={i} {...b} />
      ))}
    </Group>
  );
}

function GiftBox({ x, y, scale = 1, boxColor = '#F4C2C2', ribbonColor = '#D4AF37' }) {
  const s = 42 * scale;
  return (
    <Group x={x} y={y}>
      <Rect x={-s} y={-s * 0.15} width={s * 2} height={s * 1.55} fill={boxColor} cornerRadius={8} shadowBlur={12} shadowColor="rgba(0,0,0,0.2)" />
      <Rect x={-s} y={-s * 0.55} width={s * 2} height={s * 0.48} fill={boxColor} cornerRadius={6} />
      <Rect x={-10 * scale} y={-s * 0.55} width={20 * scale} height={s * 1.95} fill={ribbonColor} />
      <Rect x={-s} y={s * 0.35} width={s * 2} height={16 * scale} fill={ribbonColor} />
      <Bow x={0} y={-s * 0.62} color={ribbonColor} scale={0.85 * scale} />
    </Group>
  );
}

function Gifts({ items }) {
  return (
    <Group>
      {items.map((g, i) => (
        <GiftBox key={i} {...g} />
      ))}
    </Group>
  );
}

function Bokeh({ count = 24, seed = 1, colors, canvas }) {
  const rng = mulberry32(seed);
  const palette = colors || ['rgba(255,255,255,0.18)', 'rgba(200,160,255,0.22)'];
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => (
        <Circle
          key={i}
          x={rng() * canvas.width}
          y={rng() * canvas.height}
          radius={18 + rng() * 70}
          fill={pick(rng, palette)}
        />
      ))}
    </Group>
  );
}

function Sprinkles({ count = 80, seed = 2, colors, canvas }) {
  const rng = mulberry32(seed);
  const palette = colors || ['#fff', '#FF8FAB', '#7BDFF2', '#FEE440'];
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => (
        <Rect
          key={i}
          x={rng() * canvas.width}
          y={rng() * canvas.height}
          width={10 + rng() * 10}
          height={3}
          rotation={rng() * 180}
          fill={pick(rng, palette)}
          opacity={0.55}
          cornerRadius={2}
        />
      ))}
    </Group>
  );
}

function MusicNotes({ items }) {
  return (
    <Group>
      {items.map((n, i) => (
        <Group key={i} x={n.x} y={n.y} scaleX={n.scale || 1} scaleY={n.scale || 1}>
          <Circle x={0} y={18} radius={10} fill="#222" />
          <Rect x={8} y={-22} width={4} height={40} fill="#222" />
          <Ellipse x={18} y={-20} radiusX={10} radiusY={6} fill="#222" />
        </Group>
      ))}
    </Group>
  );
}

function WhiteStage({ x, y, radiusX, radiusY, fill = '#FFFFFF' }) {
  return <Ellipse x={x} y={y} radiusX={radiusX} radiusY={radiusY} fill={fill} shadowBlur={20} shadowColor="rgba(0,0,0,0.12)" />;
}

function PartyKid({ x, y, scale = 1 }) {
  const s = scale;
  return (
    <Group x={x} y={y} scaleX={s} scaleY={s}>
      <Line points={[-18, 90, -8, 40]} stroke="#222" strokeWidth={6} />
      <Line points={[18, 90, 8, 40]} stroke="#222" strokeWidth={6} />
      <Circle x={-18} y={96} radius={10} fill="#2DC653" />
      <Circle x={18} y={96} radius={10} fill="#2DC653" />
      <Rect x={-28} y={-8} width={56} height={52} fill="#E63946" cornerRadius={8} />
      <Rect x={-28} y={28} width={56} height={18} fill="#1D3557" />
      <Line points={[28, 8, 58, -28]} stroke="#E63946" strokeWidth={10} />
      <Circle x={58} y={-32} radius={10} fill="#F4A261" />
      <Circle y={-48} radius={28} fill="#F4A261" />
      <RegularPolygon x={0} y={-78} sides={3} radius={22} fill="#2A9D8F" />
      <Circle x={0} y={-86} radius={6} fill="#E9C46A" />
      <Circle x={-10} y={-50} radius={4} fill="#222" />
      <Circle x={10} y={-50} radius={4} fill="#222" />
      <Line points={[-8, -36, 8, -36]} stroke="#222" strokeWidth={2} />
    </Group>
  );
}

function Balloons({ items }) {
  return (
    <Group>
      {items.map((b, i) => (
        <BalloonShape key={i} {...b} />
      ))}
    </Group>
  );
}

function CakeShape({ x, y, scale = 1, frosting = '#FF6B9D', sponge = '#F6C945' }) {
  const s = 38 * scale;
  return (
    <Group x={x} y={y}>
      <Ellipse x={0} y={s * 1.15} radiusX={s * 1.35} radiusY={s * 0.28} fill="rgba(0,0,0,0.18)" />
      <Ellipse x={0} y={s * 1.05} radiusX={s * 1.25} radiusY={s * 0.22} fill="#F8F1E7" />
      <Rect x={-s} y={-s * 0.05} width={s * 2} height={s * 0.95} fill={sponge} cornerRadius={10} />
      <Rect x={-s} y={-s * 0.22} width={s * 2} height={s * 0.32} fill={frosting} cornerRadius={12} />
      <Rect x={-s * 0.72} y={-s * 0.85} width={s * 1.44} height={s * 0.7} fill={sponge} cornerRadius={10} />
      <Rect x={-s * 0.72} y={-s} width={s * 1.44} height={s * 0.28} fill={frosting} cornerRadius={12} />
      {[-0.42, 0, 0.42].map((slot, i) => (
        <Group key={i} x={s * slot} y={-s * 1.05}>
          <Rect x={-3} y={-s * 0.55} width={6} height={s * 0.55} fill="#FFF8E7" cornerRadius={2} />
          <Ellipse x={0} y={-s * 0.68} radiusX={7} radiusY={10} fill={i === 1 ? '#FFD166' : '#FF9F1C'} />
        </Group>
      ))}
      {[-0.55, -0.2, 0.15, 0.5].map((slot, i) => (
        <Circle key={`spr-${i}`} x={s * slot} y={-s * 0.55} radius={3.5} fill={['#4CC9F0', '#FEE440', '#FF6B9D', '#06D6A0'][i]} />
      ))}
    </Group>
  );
}

function Cakes({ items }) {
  return (
    <Group>
      {items.map((c, i) => (
        <CakeShape key={i} {...c} />
      ))}
    </Group>
  );
}

function Sparkles({ count = 20, seed = 1, color = '#fff', canvas }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => {
        const x = rng() * canvas.width;
        const y = rng() * canvas.height * 0.62;
        const s = 4 + rng() * 10;
        return (
          <Group key={i} x={x} y={y} opacity={0.55 + rng() * 0.4}>
            <Line points={[-s, 0, s, 0]} stroke={color} strokeWidth={1.6} />
            <Line points={[0, -s, 0, s]} stroke={color} strokeWidth={1.6} />
          </Group>
        );
      })}
    </Group>
  );
}

function StarsBurst({ count = 16, seed = 1, colors, canvas }) {
  const rng = mulberry32(seed);
  const palette = colors || CONFETTI_COLORS;
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          x={rng() * canvas.width}
          y={rng() * canvas.height * 0.58}
          numPoints={5}
          innerRadius={6 + rng() * 8}
          outerRadius={14 + rng() * 16}
          fill={pick(rng, palette)}
          rotation={rng() * 360}
          opacity={0.85}
        />
      ))}
    </Group>
  );
}

function Hearts({ count = 20, seed = 1, colors, canvas }) {
  const rng = mulberry32(seed);
  const palette = colors || ['#FF4D6D', '#fff'];
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => {
        const s = 8 + rng() * 16;
        const x = rng() * canvas.width;
        const y = rng() * canvas.height * 0.6;
        const color = pick(rng, palette);
        return (
          <Group key={i} x={x} y={y} opacity={0.7} scaleX={s / 20} scaleY={s / 20}>
            <Circle x={-7} y={-4} radius={10} fill={color} />
            <Circle x={7} y={-4} radius={10} fill={color} />
            <RegularPolygon x={0} y={8} sides={3} radius={13} fill={color} rotation={180} />
          </Group>
        );
      })}
    </Group>
  );
}

function Dots({ count = 20, seed = 1, colors, canvas }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => (
        <Circle
          key={i}
          x={rng() * canvas.width}
          y={rng() * canvas.height * 0.55}
          radius={4 + rng() * 10}
          fill={pick(rng, colors || ['#D4AF37'])}
          opacity={0.5}
        />
      ))}
    </Group>
  );
}

function Fireworks({ items }) {
  return (
    <Group>
      {items.map((fw, i) => {
        const rays = 14;
        return (
          <Group key={i} x={fw.x} y={fw.y}>
            {Array.from({ length: rays }).map((_, r) => {
              const a = (Math.PI * 2 * r) / rays;
              const len = 48 + (r % 3) * 16;
              return (
                <Line
                  key={r}
                  points={[0, 0, Math.cos(a) * len, Math.sin(a) * len]}
                  stroke={fw.color}
                  strokeWidth={2}
                  opacity={0.85}
                />
              );
            })}
            <Circle radius={6} fill={fw.color} />
          </Group>
        );
      })}
    </Group>
  );
}

function Sunburst({ x, y, color, rays = 16 }) {
  return (
    <Group x={x} y={y} opacity={0.9}>
      {Array.from({ length: rays }).map((_, i) => (
        <Wedge
          key={i}
          radius={720}
          angle={8}
          rotation={(360 / rays) * i}
          fill={color}
        />
      ))}
    </Group>
  );
}

function Rings({ x, y, radii = [], colors = [] }) {
  return (
    <Group>
      {radii.map((r, i) => (
        <Circle key={i} x={x} y={y} radius={r} stroke={colors[i] || colors[0]} strokeWidth={3} />
      ))}
    </Group>
  );
}

function CornerOrnaments({ color, canvas }) {
  const arms = (ox, oy, sx, sy) => (
    <Group x={ox} y={oy} scaleX={sx} scaleY={sy}>
      <Line points={[0, 70, 0, 0, 70, 0]} stroke={color} strokeWidth={3} />
      <Line points={[12, 48, 12, 12, 48, 12]} stroke={color} strokeWidth={1.5} />
    </Group>
  );
  return (
    <Group>
      {arms(48, 48, 1, 1)}
      {arms(canvas.width - 48, 48, -1, 1)}
      {arms(48, canvas.height - 48, 1, -1)}
      {arms(canvas.width - 48, canvas.height - 48, -1, -1)}
    </Group>
  );
}

function DoubleFrame({ inset, color, canvas }) {
  return (
    <Group>
      <Rect x={inset} y={inset} width={canvas.width - inset * 2} height={canvas.height - inset * 2} stroke={color} strokeWidth={2} />
      <Rect
        x={inset + 10}
        y={inset + 10}
        width={canvas.width - inset * 2 - 20}
        height={canvas.height - inset * 2 - 20}
        stroke={color}
        strokeWidth={1}
        opacity={0.7}
      />
    </Group>
  );
}

function DiagonalStripe({ color, thickness, canvas }) {
  return (
    <Line
      points={[-80, canvas.height * 0.35, canvas.width + 80, canvas.height * 0.62]}
      stroke={color}
      strokeWidth={thickness}
    />
  );
}

function DiagonalSplit({ color, gold, canvas }) {
  return (
    <Group>
      <Line
        points={[canvas.width * 0.15, 0, canvas.width * 0.85, canvas.height]}
        stroke={gold}
        strokeWidth={6}
      />
      <Line
        closed
        points={[canvas.width * 0.18, 0, canvas.width, 0, canvas.width, canvas.height, canvas.width * 0.88, canvas.height]}
        fill={color}
      />
    </Group>
  );
}

function Clouds({ canvas, seed }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 80 + rng() * (canvas.width - 160);
        const y = 80 + rng() * 220 + (i > 3 ? canvas.height - 360 : 0);
        return (
          <Group key={i} x={x} y={y} opacity={0.85}>
            <Circle x={0} y={0} radius={28} fill="#fff" />
            <Circle x={30} y={-8} radius={36} fill="#fff" />
            <Circle x={64} y={4} radius={26} fill="#fff" />
          </Group>
        );
      })}
    </Group>
  );
}

function Flower({ x, y, color, scale = 1 }) {
  const s = 22 * scale;
  return (
    <Group x={x} y={y}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Ellipse
          key={i}
          rotation={(360 / 6) * i}
          offsetY={s * 0.7}
          radiusX={s * 0.38}
          radiusY={s * 0.7}
          fill={color}
        />
      ))}
      <Circle radius={s * 0.32} fill="#FFE66D" />
    </Group>
  );
}

function Flowers({ items }) {
  return (
    <Group>
      {items.map((f, i) => (
        <Flower key={i} {...f} />
      ))}
    </Group>
  );
}

function Wreath({ x, y, radius, colors, oval }) {
  const count = 18;
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => {
        const a = (Math.PI * 2 * i) / count;
        const rx = oval ? radius * 0.82 : radius;
        const ry = oval ? radius * 1.05 : radius;
        return (
          <Flower
            key={i}
            x={x + Math.cos(a) * rx}
            y={y + Math.sin(a) * ry}
            color={colors[i % colors.length]}
            scale={0.7 + (i % 3) * 0.12}
          />
        );
      })}
    </Group>
  );
}

function Petals({ count = 16, seed = 1, colors, canvas }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => (
        <Ellipse
          key={i}
          x={rng() * canvas.width}
          y={rng() * canvas.height * 0.58}
          radiusX={8 + rng() * 10}
          radiusY={16 + rng() * 14}
          rotation={rng() * 360}
          fill={pick(rng, colors || ['#E8B4B8'])}
          opacity={0.7}
        />
      ))}
    </Group>
  );
}

function Leaves({ canvas, seed, color }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: 10 }).map((_, i) => (
        <Ellipse
          key={i}
          x={600 + rng() * 420}
          y={120 + rng() * (canvas.height - 200)}
          radiusX={12}
          radiusY={28}
          rotation={rng() * 360}
          fill={color}
          opacity={0.55}
        />
      ))}
    </Group>
  );
}

function CornerFlowers({ colors = [], canvas }) {
  const spots = [
    [90, 90],
    [canvas.width - 90, 90],
    [90, canvas.height - 90],
    [canvas.width - 90, canvas.height - 90],
  ];
  return (
    <Group>
      {spots.map(([x, y], i) => (
        <Flower key={i} x={x} y={y} color={colors[i % colors.length]} scale={1.4} />
      ))}
    </Group>
  );
}

function WatercolorBlobs({ seed, colors, canvas }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: 8 }).map((_, i) => (
        <Circle
          key={i}
          x={rng() * canvas.width}
          y={rng() * canvas.height}
          radius={80 + rng() * 140}
          fill={pick(rng, colors)}
          opacity={0.22}
        />
      ))}
    </Group>
  );
}

function MarbleVeins({ canvas, seed, color }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: 8 }).map((_, i) => {
        const y = rng() * canvas.height;
        return (
          <Line
            key={i}
            points={[0, y, canvas.width * 0.4, y + 40 - rng() * 80, canvas.width * 0.7, y + 20, canvas.width, y - 30]}
            stroke={color}
            strokeWidth={2}
            tension={0.5}
          />
        );
      })}
    </Group>
  );
}

function Polka({ canvas, seed, colors }) {
  const rng = mulberry32(seed);
  const dots = [];
  for (let x = 40; x < canvas.width; x += 70) {
    for (let y = 40; y < canvas.height; y += 70) {
      dots.push({ x: x + rng() * 8, y: y + rng() * 8, r: 8 + rng() * 6, c: pick(rng, colors || ['#fff']) });
    }
  }
  return (
    <Group>
      {dots.map((d, i) => (
        <Circle key={i} x={d.x} y={d.y} radius={d.r} fill={d.c} />
      ))}
    </Group>
  );
}

function CuteFaces({ items }) {
  return (
    <Group>
      {items.map((f, i) => (
        <Group key={i} x={f.x} y={f.y}>
          <Circle radius={42} fill={f.color} shadowBlur={10} shadowColor="rgba(0,0,0,0.2)" />
          <Circle x={-12} y={-6} radius={5} fill="#222" />
          <Circle x={12} y={-6} radius={5} fill="#222" />
          <Arc x={0} y={8} innerRadius={0} outerRadius={14} angle={180} rotation={0} fill="#222" />
          <Circle x={-16} y={6} radius={7} fill="rgba(255,255,255,0.35)" />
        </Group>
      ))}
    </Group>
  );
}

function Bunting({ y, colors, canvas }) {
  const flags = 10;
  const w = canvas.width / flags;
  return (
    <Group>
      <Line points={[0, y, canvas.width, y]} stroke="#fff" strokeWidth={4} />
      {Array.from({ length: flags }).map((_, i) => (
        <Line
          key={i}
          closed
          points={[i * w + 8, y, i * w + w - 8, y, i * w + w / 2, y + 48]}
          fill={colors[i % colors.length]}
        />
      ))}
    </Group>
  );
}

function Stickers({ canvas, seed }) {
  const rng = mulberry32(seed);
  const labels = ['YAY', 'WOW', 'XO', '★'];
  const colors = ['#FF6B9D', '#FEE440', '#7BDFF2', '#B388EB'];
  return (
    <Group>
      {labels.map((label, i) => (
        <Group key={i} x={80 + rng() * (canvas.width - 160)} y={80 + rng() * 200} rotation={-18 + rng() * 36}>
          <Star numPoints={8} innerRadius={28} outerRadius={42} fill={colors[i]} />
          <Text text={label} fontSize={16} fontFamily="Fredoka" fontStyle="bold" fill="#111" offsetX={14} offsetY={8} />
        </Group>
      ))}
    </Group>
  );
}

function Halftone({ canvas, color }) {
  const dots = [];
  for (let x = 20; x < canvas.width; x += 22) {
    for (let y = 20; y < canvas.height; y += 22) {
      dots.push([x, y]);
    }
  }
  return (
    <Group>
      {dots.map(([x, y], i) => (
        <Circle key={i} x={x} y={y} radius={3} fill={color} />
      ))}
    </Group>
  );
}

function BurstBadge({ x, y, text, color }) {
  return (
    <Group x={x} y={y} rotation={12}>
      <Star numPoints={12} innerRadius={48} outerRadius={72} fill={color} />
      <Text text={text} fontFamily="Bebas Neue" fontSize={28} fill="#fff" offsetX={26} offsetY={14} />
    </Group>
  );
}

function GridLines({ canvas, color }) {
  const lines = [];
  for (let x = 0; x <= canvas.width; x += 54) lines.push([x, 0, x, canvas.height]);
  for (let y = 0; y <= canvas.height; y += 54) lines.push([0, y, canvas.width, y]);
  return (
    <Group>
      {lines.map((p, i) => (
        <Line key={i} points={p} stroke={color} strokeWidth={1} />
      ))}
    </Group>
  );
}

function FilmGrain({ canvas, opacity }) {
  const rng = mulberry32(77);
  const dots = Array.from({ length: 280 }, () => ({
    x: rng() * canvas.width,
    y: rng() * canvas.height,
    r: rng() * 1.6,
  }));
  return (
    <Group opacity={opacity}>
      {dots.map((d, i) => (
        <Circle key={i} x={d.x} y={d.y} radius={d.r} fill="#fff" />
      ))}
    </Group>
  );
}

function OffsetFrames({ colors, canvas }) {
  const frames = [
    { x: 160, y: 210, color: colors[0] },
    { x: 250, y: 300, color: colors[1] },
    { x: 300, y: 200, color: colors[2] },
  ];
  return (
    <Group>
      {frames.map((f, i) => (
        <Rect
          key={i}
          x={f.x}
          y={f.y}
          width={640}
          height={640}
          stroke={f.color}
          strokeWidth={10}
          cornerRadius={12}
        />
      ))}
    </Group>
  );
}

function ChromeGarland({ x, y, colors, scale = 1 }) {
  const palette = colors || ['#D4AF37', '#E8C4B8', '#C0C0C0', '#F5E6C8', '#B76E79'];
  const spots = [
    { dx: 0, dy: 40, r: 42 },
    { dx: 70, dy: -10, r: 78 },
    { dx: 150, dy: 30, r: 56 },
    { dx: 40, dy: 110, r: 36 },
    { dx: 200, dy: -40, r: 88 },
    { dx: 250, dy: 50, r: 48 },
    { dx: 120, dy: 90, r: 64 },
    { dx: 210, dy: 130, r: 40 },
    { dx: 90, dy: -70, r: 50 },
    { dx: 280, dy: -10, r: 70 },
    { dx: 160, dy: 170, r: 32 },
    { dx: 20, dy: 170, r: 28 },
  ];
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      {spots.map((s, i) => (
        <Group key={i} x={s.dx} y={s.dy}>
          <Circle radius={s.r} fill={palette[i % palette.length]} shadowBlur={14} shadowColor="rgba(0,0,0,0.22)" />
          <Ellipse x={-s.r * 0.28} y={-s.r * 0.32} radiusX={s.r * 0.28} radiusY={s.r * 0.4} fill="rgba(255,255,255,0.38)" />
        </Group>
      ))}
    </Group>
  );
}

function BalloonWreath({ x, y, radius = 250, colors, count = 16, scale = 0.55 }) {
  const palette = colors || ['#4EA8DE', '#90E0EF', '#FFFFFF', '#48CAE4'];
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 - Math.PI / 2;
        return (
          <BalloonShape
            key={i}
            x={x + Math.cos(a) * radius}
            y={y + Math.sin(a) * radius}
            color={palette[i % palette.length]}
            scale={scale * (i % 3 === 0 ? 1.15 : 0.9)}
            string={false}
          />
        );
      })}
    </Group>
  );
}

function BalloonArch({ x, y, colors, scale = 1 }) {
  const palette = colors || ['#90E0EF', '#FFFFFF', '#4EA8DE', '#C0C0C0'];
  const spots = [
    { dx: -260, dy: 80, s: 1.1 },
    { dx: -200, dy: -20, s: 0.9 },
    { dx: -120, dy: -90, s: 1.2 },
    { dx: -30, dy: -130, s: 1 },
    { dx: 60, dy: -140, s: 1.15 },
    { dx: 150, dy: -100, s: 0.95 },
    { dx: 230, dy: -30, s: 1.05 },
    { dx: 280, dy: 70, s: 0.88 },
    { dx: -240, dy: 160, s: 0.7 },
    { dx: 260, dy: 150, s: 0.72 },
  ];
  return (
    <Group x={x} y={y}>
      {spots.map((p, i) => (
        <BalloonShape
          key={i}
          x={p.dx * scale}
          y={p.dy * scale}
          color={palette[i % palette.length]}
          scale={p.s * scale}
          string={false}
        />
      ))}
    </Group>
  );
}

function PartyHats({ items }) {
  return (
    <Group>
      {items.map((h, i) => (
        <Group key={i} x={h.x} y={h.y} rotation={h.rotation || 0}>
          <RegularPolygon sides={3} radius={34 * (h.scale || 1)} fill={h.color || '#F4A261'} />
          <Circle y={-34 * (h.scale || 1)} radius={6} fill="#fff" />
          <Rect x={-22} y={18} width={44} height={10} fill={h.stripe || '#E76F51'} />
        </Group>
      ))}
    </Group>
  );
}

function SparkleOrbs({ count = 6, seed = 1, canvas }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => {
        const r = 70 + rng() * 90;
        const x = 120 + rng() * (canvas.width - 240);
        const y = 160 + rng() * (canvas.height - 320);
        return (
          <Group key={i} x={x} y={y}>
            <Circle radius={r} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
            {Array.from({ length: 18 }).map((__, k) => (
              <Circle
                key={k}
                x={(rng() - 0.5) * r * 1.4}
                y={(rng() - 0.5) * r * 1.4}
                radius={1.5 + rng() * 2.5}
                fill="#fff"
                opacity={0.7 + rng() * 0.3}
              />
            ))}
          </Group>
        );
      })}
    </Group>
  );
}

function BotanicalCorners({ colors, canvas }) {
  const palette = colors || ['#6B8F71', '#A3B18A', '#606C38', '#DAD7CD'];
  const leaf = (x, y, rot, scale, color) => (
    <Ellipse x={x} y={y} radiusX={22 * scale} radiusY={54 * scale} rotation={rot} fill={color} opacity={0.92} />
  );
  return (
    <Group>
      {leaf(80, 90, -30, 1.6, palette[0])}
      {leaf(150, 70, 20, 1.3, palette[1])}
      {leaf(90, 160, 50, 1.1, palette[2])}
      {leaf(canvas.width - 80, 90, 30, 1.6, palette[1])}
      {leaf(canvas.width - 160, 60, -15, 1.2, palette[0])}
      {leaf(canvas.width - 70, 170, -50, 1.15, palette[3])}
      {leaf(70, canvas.height - 90, 150, 1.5, palette[2])}
      {leaf(160, canvas.height - 70, 200, 1.25, palette[0])}
      {leaf(canvas.width - 90, canvas.height - 80, -150, 1.55, palette[1])}
      {leaf(canvas.width - 170, canvas.height - 60, -200, 1.2, palette[3])}
    </Group>
  );
}

function GoldDots({ count = 40, seed = 2, canvas, color = '#D4AF37' }) {
  const rng = mulberry32(seed);
  return (
    <Group>
      {Array.from({ length: count }).map((_, i) => (
        <Circle
          key={i}
          x={rng() * canvas.width}
          y={rng() * canvas.height}
          radius={3 + rng() * 8}
          fill={color}
          opacity={0.35 + rng() * 0.5}
        />
      ))}
    </Group>
  );
}

function EnvelopeScene({ canvas, flap = '#F7F1EA', card = '#FFFFFF' }) {
  const w = canvas.width;
  return (
    <Group listening={false}>
      <Rect x={36} y={118} width={w - 72} height={canvas.height - 154} fill={card} cornerRadius={6} shadowBlur={18} shadowColor="rgba(80,60,40,0.16)" />
      <Line
        closed
        points={[36, 118, w / 2, 28, w - 36, 118]}
        fill={flap}
        stroke="#E8D9C8"
        strokeWidth={2}
      />
      <Line points={[36, 118, w - 36, 118]} stroke="#E4D5C4" strokeWidth={2} />
      <Circle x={w / 2} y={92} radius={7} fill="#E8B4B8" />
      <Star x={96} y={86} numPoints={8} innerRadius={4} outerRadius={10} fill="#C9184A" />
      <Star x={w - 96} y={86} numPoints={8} innerRadius={4} outerRadius={10} fill="#C9184A" />
    </Group>
  );
}

function BalloonColumn({ x = 860, y = 80, colors, count = 16, scale = 1.2, seed = 22 }) {
  const rng = mulberry32(seed);
  const palette = colors || ['#C9A227', '#163A6B', '#E8C872', '#0F2C54', '#D4AF37', '#1D4E89'];
  const spots = Array.from({ length: count }, (_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return {
      x: x + col * 92 * scale + ((row % 2) * 22 - 8) * scale,
      y: y + row * 98 * scale + (col - 1) * 12 * scale,
      s: (0.82 + rng() * 0.5) * scale,
      color: palette[i % palette.length],
      string: i % 5 === 0,
    };
  });
  return (
    <Group>
      {spots.map((b, i) => (
        <BalloonShape key={i} x={b.x} y={b.y} color={b.color} scale={b.s} string={b.string} />
      ))}
    </Group>
  );
}

function CandleStick({ x, y, color, letter, scale = 1 }) {
  return (
    <Group x={x} y={y}>
      <Rect x={-3.5 * scale} y={0} width={7 * scale} height={38 * scale} fill={color} cornerRadius={2} />
      <Ellipse x={0} y={-10 * scale} radiusX={5 * scale} radiusY={8 * scale} fill="#FFE08A" />
      <Ellipse x={0} y={-16 * scale} radiusX={2.2 * scale} radiusY={4 * scale} fill="#FFF6D6" />
      {letter ? (
        <Text
          text={letter}
          x={-10 * scale}
          y={8 * scale}
          width={20 * scale}
          align="center"
          fontFamily="Montserrat"
          fontStyle="800"
          fontSize={11 * scale}
          fill="#FFFFFF"
        />
      ) : null}
    </Group>
  );
}

function PartyCake({ x, y, scale = 1 }) {
  const s = 110 * scale;
  const letters = 'HAPPYBIRTHDAY'.split('');
  const colors = ['#F4D35E', '#FF8FAB', '#7BDFF2', '#C77DFF', '#90E0EF', '#F4A261', '#80ED99', '#FF6B6B', '#48CAE4', '#FFD166', '#B8F2E6', '#F72585', '#4CC9F0'];
  return (
    <Group x={x} y={y}>
      <Ellipse x={0} y={s * 0.92} radiusX={s * 1.15} radiusY={s * 0.18} fill="rgba(0,0,0,0.12)" />
      <Rect x={-s} y={-s * 0.15} width={s * 2} height={s * 0.95} fill="#F7F4EE" cornerRadius={18} />
      <Ellipse x={0} y={-s * 0.15} radiusX={s} radiusY={s * 0.22} fill="#FFFFFF" />
      <Ellipse x={0} y={s * 0.8} radiusX={s} radiusY={s * 0.2} fill="#F0EBE3" />
      {Array.from({ length: 42 }).map((_, i) => {
        const t = i / 42;
        return (
          <Circle
            key={i}
            x={Math.cos(t * Math.PI * 2) * s * 0.82}
            y={s * 0.28 + Math.sin(t * 18) * 10}
            radius={5 * scale}
            fill={['#FF8FAB', '#90E0EF', '#FEE440', '#C77DFF', '#80ED99', '#F4A261'][i % 6]}
          />
        );
      })}
      {letters.map((letter, i) => {
        const t = (i / (letters.length - 1) - 0.5) * 1.15;
        return (
          <CandleStick
            key={letter + i}
            x={t * s * 1.55}
            y={-s * 0.55 - Math.abs(t) * 18}
            color={colors[i % colors.length]}
            letter={letter}
            scale={scale * 0.92}
          />
        );
      })}
    </Group>
  );
}

function LayerCake({ x, y, scale = 1 }) {
  const s = 70 * scale;
  return (
    <Group x={x} y={y}>
      <Ellipse x={0} y={s * 1.7} radiusX={s * 1.6} radiusY={s * 0.18} fill="rgba(0,0,0,0.12)" />
      <Rect x={-s * 1.35} y={s * 0.55} width={s * 2.7} height={s * 0.95} fill="#E8C9A0" cornerRadius={16} />
      <Rect x={-s * 1.35} y={s * 0.42} width={s * 2.7} height={s * 0.28} fill="#6B3F2A" cornerRadius={10} />
      <Rect x={-s} y={-s * 0.15} width={s * 2} height={s * 0.78} fill="#F3C98B" cornerRadius={14} />
      <Rect x={-s} y={-s * 0.28} width={s * 2} height={s * 0.24} fill="#F4B4C8" cornerRadius={10} />
      <Rect x={-s * 0.7} y={-s * 0.95} width={s * 1.4} height={s * 0.72} fill="#F7C1D0" cornerRadius={12} />
      <Rect x={-s * 0.7} y={-s * 1.08} width={s * 1.4} height={s * 0.22} fill="#FFFFFF" cornerRadius={10} />
      {[-0.35, -0.12, 0.12, 0.35].map((slot, i) => (
        <Rect key={i} x={s * slot - 2} y={-s * 1.55} width={4} height={s * 0.42} fill="#FFF3C4" cornerRadius={1} />
      ))}
      {[-0.35, -0.12, 0.12, 0.35].map((slot, i) => (
        <Ellipse key={`f${i}`} x={s * slot} y={-s * 1.62} radiusX={4} radiusY={6} fill="#FFD166" />
      ))}
      <Text
        text="HAPPY BIRTHDAY"
        x={-s * 0.85}
        y={-s * 1.95}
        width={s * 1.7}
        align="center"
        fontFamily="Montserrat"
        fontStyle="800"
        fontSize={11 * scale}
        fill="#C9184A"
      />
    </Group>
  );
}

function DripCake({ x, y, scale = 1 }) {
  const s = 78 * scale;
  return (
    <Group x={x} y={y}>
      <Rect x={-8 * scale} y={s * 1.15} width={16 * scale} height={s * 0.7} fill="#E8DCC8" />
      <Ellipse x={0} y={s * 1.85} radiusX={s * 0.85} radiusY={s * 0.12} fill="#F3E6D8" />
      <Ellipse x={0} y={s * 1.12} radiusX={s * 1.05} radiusY={s * 0.16} fill="#F7F1E8" />
      <Rect x={-s} y={-s * 0.05} width={s * 2} height={s * 1.05} fill="#F8E6C8" cornerRadius={18} />
      <Line
        closed
        points={[-s, -s * 0.02, -s * 0.7, s * 0.55, -s * 0.42, -s * 0.02, -s * 0.1, s * 0.7, s * 0.18, -s * 0.02, s * 0.48, s * 0.5, s * 0.72, -s * 0.02, s, s * 0.35, s, -s * 0.02]}
        fill="#5C3317"
      />
      <Ellipse x={0} y={-s * 0.08} radiusX={s} radiusY={s * 0.22} fill="#F4E1B5" />
      {[-0.55, -0.22, 0.12, 0.48].map((slot, i) => (
        <Group key={i} x={s * slot} y={-s * 0.18}>
          <Ellipse x={0} y={0} radiusX={10 * scale} radiusY={8 * scale} fill="#FFF6E8" />
          <Circle x={0} y={-4 * scale} radius={4 * scale} fill="#FF8FAB" />
        </Group>
      ))}
      {[-0.38, -0.12, 0.12, 0.38].map((slot, i) => (
        <Rect key={`c${i}`} x={s * slot - 2} y={-s * 0.72} width={4} height={s * 0.48} fill="#F1E3C0" />
      ))}
      {[-0.38, -0.12, 0.12, 0.38].map((slot, i) => (
        <Ellipse key={`fl${i}`} x={s * slot} y={-s * 0.8} radiusX={4} radiusY={6} fill="#FFD166" />
      ))}
    </Group>
  );
}

export { starPoints } from '../lib/geometry';
