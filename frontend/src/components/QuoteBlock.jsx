import { Group, Line, Rect, Text } from 'react-konva';
import { estimateTextBox } from '../lib/readability';

const TONES = {
  dark: {
    bg: 'rgba(12, 10, 22, 0.9)',
    fill: '#FFFFFF',
    border: '#F5E6C8',
    mark: '#FFD166',
  },
  gold: {
    bg: 'rgba(12, 10, 8, 0.92)',
    fill: '#F5E6C8',
    border: '#D4AF37',
    mark: '#D4AF37',
  },
  cream: {
    bg: 'rgba(255, 248, 241, 0.94)',
    fill: '#3D2A32',
    border: '#C9A227',
    mark: '#9B2335',
  },
  kids: {
    bg: 'rgba(255, 255, 255, 0.95)',
    fill: '#1B2559',
    border: '#FF6B9D',
    mark: '#EF476F',
  },
};

export function QuoteBlock({ placement, text, tone = 'dark', accent = false }) {
  if (!placement || !text) return null;
  const palette = TONES[tone] || TONES.dark;
  const width = placement.width || 820;
  const fontSize = accent ? (width < 420 ? 26 : 30) : width < 420 ? 22 : 26;
  const fontFamily = accent ? 'Playfair Display' : 'Poppins';
  const fontStyle = accent ? 'italic 700' : '600';
  const padX = 36;
  const padY = 28;
  const innerW = width - padX * 2;
  const box = estimateTextBox(
    { fontSize, width: innerW, lineHeight: 1.38 },
    text,
  );
  const height = Math.max(accent ? 118 : 132, box.height + padY * 2);
  const y = placement.y;
  const variant = placement.variant || 'card';

  return (
    <Group x={placement.x} y={y + height / 2} rotation={placement.rotation || 0} offsetX={0} offsetY={0}>
      <Group x={-width / 2} y={-height / 2}>
        {variant === 'ribbon' && (
          <>
            <Line closed points={[-22, 18, 0, 0, 0, height, -22, height - 18]} fill={palette.border} />
            <Line
              closed
              points={[width + 22, 18, width, 0, width, height, width + 22, height - 18]}
              fill={palette.border}
            />
          </>
        )}
        <Rect
          width={width}
          height={height}
          fill={palette.bg}
          cornerRadius={variant === 'banner' ? 18 : 26}
          stroke={palette.border}
          strokeWidth={variant === 'overlay' ? 2 : 3}
          shadowBlur={28}
          shadowColor="rgba(0,0,0,0.38)"
          shadowOffsetY={10}
        />
        {variant !== 'banner' && (
          <Text
            text={'\u201C'}
            x={14}
            y={-8}
            fontFamily="Playfair Display"
            fontStyle="italic 700"
            fontSize={accent ? 72 : 64}
            fill={palette.mark}
            opacity={0.9}
          />
        )}
        {variant === 'banner' && (
          <Rect x={0} y={0} width={10} height={height} fill={palette.mark} cornerRadius={18} />
        )}
        <Text
          x={padX}
          y={padY + (variant === 'banner' ? 0 : 8)}
          width={innerW}
          text={text}
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          fontSize={fontSize}
          lineHeight={1.38}
          wrap="word"
          fill={palette.fill}
          align="center"
          shadowColor={palette.fill === '#FFFFFF' || palette.fill === '#F5E6C8' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.35)'}
          shadowBlur={6}
        />
      </Group>
    </Group>
  );
}
