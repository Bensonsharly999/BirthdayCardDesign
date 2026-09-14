import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Circle, Ellipse, Group, Image as KonvaImage, Layer, Line, Rect, RegularPolygon, Stage, Star, Text } from 'react-konva';
import { Decorations } from './Decorations';
import { clipShape, colorStops, coverFit, fitPhoto, gradientPoints, parseFontStyle, photoBox } from '../lib/geometry';
import { enhanceTemplate, estimateTextBox } from '../lib/readability';

function useHtmlImage(src) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) {
      setImage(null);
      return undefined;
    }
    let cancelled = false;
    const img = new window.Image();
    const isLocal = String(src).startsWith('blob:') || String(src).startsWith('data:');
    if (!isLocal) img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.onerror = () => {
      if (!cancelled) setImage(null);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return image;
}

function Background({ canvas, background, overlays = [] }) {
  const w = canvas.width;
  const h = canvas.height;
  const bg = background || { type: 'solid', colors: ['#111'] };
  const fills = [];

  if (bg.type === 'linear') {
    const pts = gradientPoints(bg.angle || 180, w, h);
    fills.push(
      <Rect
        key="bg"
        width={w}
        height={h}
        fillLinearGradientStartPoint={pts.start}
        fillLinearGradientEndPoint={pts.end}
        fillLinearGradientColorStops={colorStops(bg.colors)}
      />,
    );
  } else if (bg.type === 'radial') {
    fills.push(
      <Rect
        key="bg"
        width={w}
        height={h}
        fillRadialGradientStartPoint={{ x: w * (bg.x ?? 0.5), y: h * (bg.y ?? 0.5) }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: w * (bg.x ?? 0.5), y: h * (bg.y ?? 0.5) }}
        fillRadialGradientEndRadius={Math.max(w, h) * (bg.radius ?? 0.8)}
        fillRadialGradientColorStops={colorStops(bg.colors)}
      />,
    );
  } else {
    fills.push(<Rect key="bg" width={w} height={h} fill={bg.colors?.[0] || '#111'} />);
  }

  overlays.forEach((ov, i) => {
    const ow = (ov.w ?? 1) * w;
    const oh = (ov.h ?? 1) * h;
    const ox = (ov.x ?? 0) * w;
    const oy = (ov.y ?? 0) * h;
    if (ov.type === 'radial') {
      fills.push(
        <Rect
          key={`ov-${i}`}
          x={0}
          y={0}
          width={w}
          height={h}
          fillRadialGradientStartPoint={{ x: w * (ov.x ?? 0.5), y: h * (ov.y ?? 0.5) }}
          fillRadialGradientStartRadius={0}
          fillRadialGradientEndPoint={{ x: w * (ov.x ?? 0.5), y: h * (ov.y ?? 0.5) }}
          fillRadialGradientEndRadius={Math.max(w, h) * (ov.radius ?? 0.5)}
          fillRadialGradientColorStops={colorStops(ov.colors)}
        />,
      );
    } else {
      const pts = gradientPoints(ov.angle || 180, ow, oh);
      fills.push(
        <Rect
          key={`ov-${i}`}
          x={ox}
          y={oy}
          width={ow}
          height={oh}
          opacity={ov.opacity ?? 1}
          fillLinearGradientStartPoint={pts.start}
          fillLinearGradientEndPoint={pts.end}
          fillLinearGradientColorStops={colorStops(ov.colors)}
        />,
      );
    }
  });

  return <Group>{fills}</Group>;
}

function PhotoLayer({ photo, image, cutout = false }) {
  if (!photo) return null;
  const box = photoBox(photo);
  const framed = ['circle', 'oval', 'square', 'rounded', 'polaroid', 'line-frame', 'gold-rect', 'white-mat'].includes(
    photo.frame,
  );
  const fit = image ? (framed ? coverFit(image, box.w, box.h, photo.frame) : fitPhoto(image, box.w, box.h, cutout)) : null;
  const shadow = photo.shadow || {};
  const card = photo.card;
  const personShadow = cutout && !framed
    ? { shadowBlur: 32, shadowColor: 'rgba(0,0,0,0.38)', shadowOffsetY: 16 }
    : {};

  const overlay =
    photo.overlay === 'linear' ? (
      <Rect
        width={box.w}
        height={box.h}
        fillLinearGradientStartPoint={gradientPoints(photo.overlayAngle || 180, box.w, box.h).start}
        fillLinearGradientEndPoint={gradientPoints(photo.overlayAngle || 180, box.w, box.h).end}
        fillLinearGradientColorStops={colorStops(photo.overlayColors || ['transparent', 'rgba(0,0,0,0.6)'])}
      />
    ) : null;

  if (photo.frame === 'line-frame') {
    const innerFit = image ? coverFit(image, box.w, box.h, photo.frame) : null;
    const pad = photo.inset || 16;
    return (
      <Group x={box.x} y={box.y}>
        <Group clipFunc={(ctx) => ctx.rect(0, 0, box.w, box.h)}>
          <Rect width={box.w} height={box.h} fill={photo.fill || '#FFFFFF'} />
          {image && innerFit && (
            <KonvaImage
              image={image}
              x={innerFit.x}
              y={innerFit.y}
              width={innerFit.width}
              height={innerFit.height}
            />
          )}
        </Group>
        <Rect width={box.w} height={box.h} stroke={photo.borderColor || '#FFFFFF'} strokeWidth={photo.borderWidth || 3} listening={false} />
        <Rect
          x={pad}
          y={pad}
          width={box.w - pad * 2}
          height={box.h - pad * 2}
          stroke={photo.borderColor || '#FFFFFF'}
          strokeWidth={Math.max(1, (photo.borderWidth || 3) - 1)}
          opacity={0.85}
          listening={false}
        />
      </Group>
    );
  }

  if (photo.frame === 'blend') {
    const innerFit = fitPhoto(image, box.w, box.h, cutout, photo.pad ?? 0.02);
    const imageNode = image && innerFit && (
      <KonvaImage
        image={image}
        x={innerFit.x}
        y={innerFit.y}
        width={innerFit.width}
        height={innerFit.height}
        {...personShadow}
      />
    );
    if (cutout) {
      return (
        <Group x={box.x} y={box.y} listening={false}>
          {imageNode}
        </Group>
      );
    }
    return (
      <Group
        x={box.x}
        y={box.y}
        listening={false}
        clipFunc={(ctx) => {
          const r = 36;
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.arcTo(box.w, 0, box.w, box.h, r);
          ctx.arcTo(box.w, box.h, 0, box.h, r);
          ctx.arcTo(0, box.h, 0, 0, r);
          ctx.arcTo(0, 0, box.w, 0, r);
          ctx.closePath();
        }}
      >
        {imageNode}
      </Group>
    );
  }

  if (photo.frame === 'line-frame') {
    const innerFit = image ? coverFit(image, box.w, box.h, photo.frame) : null;
    const gap = photo.frameGap || 14;
    return (
      <Group x={box.x} y={box.y}>
        <Group clipFunc={(ctx) => ctx.rect(0, 0, box.w, box.h)}>
          <Rect width={box.w} height={box.h} fill={photo.fill || '#EAF4FB'} />
          {image && innerFit && (
            <KonvaImage
              image={image}
              x={innerFit.x}
              y={innerFit.y}
              width={innerFit.width}
              height={innerFit.height}
            />
          )}
        </Group>
        <Rect width={box.w} height={box.h} stroke={photo.borderColor || '#FFFFFF'} strokeWidth={photo.borderWidth || 3} listening={false} />
        <Rect
          x={gap}
          y={gap}
          width={box.w - gap * 2}
          height={box.h - gap * 2}
          stroke={photo.borderColor || '#FFFFFF'}
          strokeWidth={1.5}
          opacity={0.85}
          listening={false}
        />
      </Group>
    );
  }

  if (photo.frame === 'gold-rect' || photo.frame === 'white-mat') {
    const mat = photo.mat || '#FFFFFF';
    const pad = photo.matPad || 22;
    const inner = { w: box.w - pad * 2, h: box.h - pad * 2 };
    const innerFit = fitPhoto(image, inner.w, inner.h, cutout);
    return (
      <Group x={box.x} y={box.y}>
        <Rect
          width={box.w}
          height={box.h}
          fill={photo.borderColor || '#D4AF37'}
          cornerRadius={photo.radius || 6}
          shadowBlur={shadow.blur || 28}
          shadowColor={shadow.color || 'rgba(0,0,0,0.28)'}
          shadowOffsetY={shadow.offsetY || 12}
        />
        <Rect
          x={5}
          y={5}
          width={box.w - 10}
          height={box.h - 10}
          fill={mat}
          cornerRadius={Math.max((photo.radius || 6) - 2, 0)}
        />
        <Group x={pad} y={pad} clipFunc={(ctx) => ctx.rect(0, 0, inner.w, inner.h)}>
          <Rect width={inner.w} height={inner.h} fill={photo.fill || mat} />
          {image && innerFit && (
            <KonvaImage
              image={image}
              x={innerFit.x}
              y={innerFit.y}
              width={innerFit.width}
              height={innerFit.height}
              {...personShadow}
            />
          )}
        </Group>
      </Group>
    );
  }

  if (photo.frame === 'polaroid') {
    const tab = photo.tab || 78;
    const m = photo.matPad || 16;
    const inner = { x: m, y: m, w: box.w - m * 2, h: box.h - tab };
    const innerFit = image ? coverFit(image, inner.w, inner.h, photo.frame) : null;
    return (
      <Group x={photo.x} y={photo.y} rotation={photo.rotation || 0} offsetX={box.w / 2} offsetY={box.h / 2}>
        <Rect
          width={box.w}
          height={box.h}
          fill={photo.borderColor || '#111'}
          cornerRadius={4}
          shadowBlur={shadow.blur || 24}
          shadowColor={shadow.color || 'rgba(0,0,0,0.28)'}
          shadowOffsetY={shadow.offsetY || 10}
        />
        <Group x={inner.x} y={inner.y} clipFunc={(ctx) => ctx.rect(0, 0, inner.w, inner.h)}>
          <Rect width={inner.w} height={inner.h} fill={photo.fill || '#E8DCC8'} />
          {image && innerFit && (
            <KonvaImage image={image} x={innerFit.x} y={innerFit.y} width={innerFit.width} height={innerFit.height} />
          )}
        </Group>
      </Group>
    );
  }

  if (photo.frame === 'giftbox') {
    const ribbon = photo.ribbonColor || '#FEE440';
    const boxColor = photo.boxColor || '#FF6B9D';
    return (
      <Group>
        {card && (
          <Rect
            x={card.x}
            y={card.y}
            width={card.w}
            height={card.h}
            fill={card.fill}
            cornerRadius={card.radius || 0}
            stroke={card.stroke}
            strokeWidth={2}
          />
        )}
        <Group x={box.x} y={box.y}>
          <Rect
            width={box.w}
            height={box.h}
            fill={boxColor}
            cornerRadius={18}
            shadowBlur={shadow.blur}
            shadowColor={shadow.color}
            shadowOffsetY={shadow.offsetY}
          />
          <Group x={18} y={18} clipFunc={(ctx) => ctx.rect(0, 0, box.w - 36, box.h - 36)}>
            {image && (
              <KonvaImage
                image={image}
                {...fitPhoto(image, box.w - 36, box.h - 36, cutout)}
                {...personShadow}
              />
            )}
          </Group>
          <Rect x={box.w / 2 - 22} y={0} width={44} height={box.h} fill={ribbon} opacity={0.92} />
          <Rect x={0} y={box.h / 2 - 22} width={box.w} height={44} fill={ribbon} opacity={0.92} />
          <RegularPolygon x={box.w / 2} y={box.h / 2} sides={4} radius={28} fill={ribbon} />
        </Group>
      </Group>
    );
  }

  if (photo.frame === 'ribbon') {
    const ribbon = photo.ribbonColor || '#FEE440';
    const wrap = photo.borderColor || '#FF6B9D';
    return (
      <Group x={box.x} y={box.y}>
        <Rect
          width={box.w}
          height={box.h}
          fill={wrap}
          cornerRadius={28}
          shadowBlur={shadow.blur}
          shadowColor={shadow.color}
          shadowOffsetY={shadow.offsetY}
        />
        <Group x={14} y={14} clipFunc={(ctx) => ctx.rect(0, 0, box.w - 28, box.h - 28)}>
          {image && (
            <KonvaImage image={image} {...fitPhoto(image, box.w - 28, box.h - 28, cutout)} {...personShadow} />
          )}
        </Group>
        <Rect x={box.w / 2 - 18} y={0} width={36} height={box.h} fill={ribbon} />
        <Ellipse x={box.w / 2 - 28} y={36} radiusX={32} radiusY={20} fill={ribbon} />
        <Ellipse x={box.w / 2 + 28} y={36} radiusX={32} radiusY={20} fill={ribbon} />
        <Circle x={box.w / 2} y={36} radius={12} fill="#fff" />
      </Group>
    );
  }

  if (photo.frame === 'balloon') {
    const color = photo.balloonColor || photo.borderColor || '#EF476F';
    return (
      <Group x={photo.x} y={photo.y}>
        <Line points={[0, box.h / 2, 8, box.h / 2 + 160]} stroke="rgba(40,40,40,0.4)" strokeWidth={2} />
        <Ellipse
          radiusX={box.w / 2 + 18}
          radiusY={box.h / 2 + 28}
          fill={color}
          shadowBlur={shadow.blur}
          shadowColor={shadow.color}
          shadowOffsetY={shadow.offsetY}
        />
        <Group
          x={-box.w / 2}
          y={-box.h / 2}
          clipFunc={(ctx) => clipShape(ctx, 'circle', box.w, box.h)}
        >
          {image && fit && (
            <KonvaImage
              image={image}
              x={fit.x}
              y={fit.y}
              width={fit.width}
              height={fit.height}
              {...personShadow}
            />
          )}
        </Group>
        <Circle x={-box.w / 2 + 70} y={-40} radius={28} fill="rgba(255,255,255,0.28)" />
        <RegularPolygon x={0} y={box.h / 2 + 18} sides={3} radius={16} fill={color} rotation={180} />
      </Group>
    );
  }

  const radius =
    photo.frame === 'circle' || photo.frame === 'oval'
      ? Math.min(box.w, box.h)
      : photo.frame === 'rounded'
        ? photo.radius || 28
        : 0;

  return (
    <Group>
      {card && (
        <Rect
          x={card.x}
          y={card.y}
          width={card.w}
          height={card.h}
          fill={card.fill}
          cornerRadius={card.radius || 0}
          stroke={card.stroke}
          strokeWidth={2}
          shadowBlur={30}
          shadowColor="rgba(0,0,0,0.25)"
        />
      )}
      <Group
        x={box.x}
        y={box.y}
        clipFunc={(ctx) => {
          if (photo.frame === 'rounded') {
            const r = photo.radius || 28;
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.arcTo(box.w, 0, box.w, box.h, r);
            ctx.arcTo(box.w, box.h, 0, box.h, r);
            ctx.arcTo(0, box.h, 0, 0, r);
            ctx.arcTo(0, 0, box.w, 0, r);
            ctx.closePath();
            return;
          }
          clipShape(ctx, photo.frame, box.w, box.h);
        }}
      >
        <Rect width={box.w} height={box.h} fill={photo.fill || 'transparent'} />
        {image && fit && (
          <KonvaImage
            image={image}
            x={fit.x}
            y={fit.y}
            width={fit.width}
            height={fit.height}
            {...personShadow}
          />
        )}
        {overlay}
      </Group>
      {photo.borderWidth > 0 && photo.frame === 'circle' && (
        <Circle
          x={photo.x}
          y={photo.y}
          radius={Math.min(box.w, box.h) / 2}
          stroke={photo.borderColor}
          strokeWidth={photo.borderWidth}
        />
      )}
      {photo.borderWidth > 0 && photo.frame === 'oval' && (
        <Ellipse
          x={photo.x}
          y={photo.y}
          radiusX={box.w / 2}
          radiusY={box.h / 2}
          stroke={photo.borderColor}
          strokeWidth={photo.borderWidth}
        />
      )}
      {photo.borderWidth > 0 && photo.frame === 'heart' && (
        <Group x={box.x} y={box.y} listening={false}>
          <Rect width={box.w} height={box.h} strokeEnabled={false} />
        </Group>
      )}
      {photo.borderWidth > 0 && photo.frame === 'star' && (
        <Star
          x={photo.x}
          y={photo.y}
          numPoints={5}
          innerRadius={Math.min(box.w, box.h) / 4.4}
          outerRadius={Math.min(box.w, box.h) / 2}
          stroke={photo.borderColor}
          strokeWidth={photo.borderWidth}
        />
      )}
      {photo.borderWidth > 0 && photo.frame === 'diamond' && (
        <Line
          closed
          points={[photo.x, box.y, box.x + box.w, photo.y, photo.x, box.y + box.h, box.x, photo.y]}
          stroke={photo.borderColor}
          strokeWidth={photo.borderWidth}
        />
      )}
      {photo.borderWidth > 0 && (photo.frame === 'rounded' || photo.frame === 'square' || photo.frame === 'full') && (
        <Rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          stroke={photo.borderColor}
          strokeWidth={photo.borderWidth}
          cornerRadius={photo.frame === 'rounded' ? radius : 0}
        />
      )}
    </Group>
  );
}

function StyledText({ style, text, fallbackSize }) {
  if (!style || !text) return null;
  const fontStyle = parseFontStyle(style.fontStyle);
  const width = style.width || (style.align === 'center' ? 1000 : undefined);
  const fontSize = style.fontSize || fallbackSize || 32;
  const height = style.height;
  const draw = {
    x: style.align === 'center' ? style.x - (width || 0) / 2 : style.x,
    y: style.y,
    width,
    height,
    text,
    fontFamily: style.fontFamily || 'Outfit',
    fontSize,
    fontStyle,
    fill: style.fill || '#fff',
    align: style.align || 'left',
    verticalAlign: 'top',
    letterSpacing: style.letterSpacing || 0,
    lineHeight: style.lineHeight || 1.25,
    wrap: 'word',
    ellipsis: Boolean(height),
    shadowColor: style.shadowColor,
    shadowBlur: style.shadowBlur || 0,
    shadowOffsetY: style.shadowOffsetY || 0,
    shadowOpacity: style.shadowColor ? 1 : 0,
    stroke: style.strokeWidth ? style.stroke : undefined,
    strokeWidth: style.strokeWidth || 0,
    fillAfterStrokeEnabled: true,
  };
  const box = estimateTextBox({ ...style, fontSize, width }, text);
  const plateX = (draw.x || 0) - 22;
  const plateW = (width || 800) + 44;

  return (
    <Group>
      {style.plate && (
        <Rect
          x={plateX}
          y={style.y - 18}
          width={plateW}
          height={box.height + 8}
          fill={style.plateFill || 'rgba(8,8,16,0.58)'}
          cornerRadius={22}
          shadowBlur={18}
          shadowColor="rgba(0,0,0,0.28)"
        />
      )}
      {style.glow && (
        <Text {...draw} fill={style.glow} shadowColor={style.glow} shadowBlur={26} opacity={0.55} />
      )}
      <Text {...draw} />
      {style.underline && (
        <Rect
          x={style.x - 70}
          y={style.y + fontSize + 6}
          width={140}
          height={4}
          cornerRadius={2}
          fill={style.fill}
          opacity={0.9}
        />
      )}
    </Group>
  );
}

export const CardStage = forwardRef(function CardStage(
  { template, personName, photoSrc, cutout = false, fitWidth, fitHeight, className },
  ref,
) {
  const stageRef = useRef(null);
  const image = useHtmlImage(photoSrc);
  const card = useMemo(() => enhanceTemplate(template, personName), [template, personName]);
  const canvas = card?.canvas || { width: 1080, height: 1350 };

  const scale = useMemo(() => {
    if (!fitWidth && !fitHeight) return 1;
    const sx = fitWidth ? fitWidth / canvas.width : 1;
    const sy = fitHeight ? fitHeight / canvas.height : 1;
    if (fitWidth && fitHeight) return Math.min(sx, sy);
    return fitWidth ? sx : sy;
  }, [fitWidth, fitHeight, canvas.width, canvas.height]);

  useImperativeHandle(ref, () => {
    const exportImage = (format = 'png', pixelRatio = 2) => {
      const stage = stageRef.current;
      if (!stage) return '';
      const jpeg = format === 'jpeg' || format === 'jpg';
      return stage.toDataURL({
        mimeType: jpeg ? 'image/jpeg' : 'image/png',
        quality: jpeg ? 0.92 : undefined,
        pixelRatio: pixelRatio / scale,
      });
    };
    return {
      exportImage,
      exportPng: (pixelRatio = 2) => exportImage('png', pixelRatio),
    };
  });

  if (!card) return null;

  return (
    <div className={className}>
      <Stage
        ref={stageRef}
        width={canvas.width * scale}
        height={canvas.height * scale}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          <Background canvas={canvas} background={card.background} overlays={card.overlays} />
          <Decorations items={card.decorations} canvas={canvas} />
          <PhotoLayer photo={card.photo} image={image} cutout={cutout} />
          {card.quotePanel && (
            <Rect
              x={card.quotePanel.x}
              y={card.quotePanel.y}
              width={card.quotePanel.w}
              height={card.quotePanel.h}
              fill={card.quotePanel.fill || '#FFFFFF'}
              cornerRadius={card.quotePanel.radius || 28}
              shadowBlur={18}
              shadowColor="rgba(0,0,0,0.16)"
            />
          )}
          <StyledText style={card.headline} text={card.headline?.text} />
          <StyledText style={card.nameStyle} text={personName} />
          <StyledText style={card.quote2Style} text={card.quote2} />
          <StyledText style={card.wishStyle} text={card.wish} />
        </Layer>
      </Stage>
    </div>
  );
});
