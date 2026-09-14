import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { CardStage } from '../components/CardStage';
import { CardControls } from '../components/CardControls';
import { useSwipe } from '../hooks/useSwipe';
import { downloadDataUrl, safeFileName } from '../services/download';

export function StudioPage({
  theme,
  onToggleTheme,
  cards,
  photoSrc,
  cutout,
  personName,
  onBack,
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [size, setSize] = useState({ w: 360, h: 520 });
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const card = cards[index];

  useEffect(() => {
    const measure = () => {
      const node = frameRef.current;
      if (!node) return;
      const w = node.clientWidth;
      const h = Math.min(window.innerHeight * 0.58, 720);
      setSize({ w, h });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const go = (next) => {
    setDirection(next > index ? 1 : -1);
    setIndex(Math.max(0, Math.min(cards.length - 1, next)));
  };

  useSwipe(frameRef, {
    onLeft: () => go(index + 1),
    onRight: () => go(index - 1),
  });

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, cards.length]);

  const template = card?.template;

  const download = async () => {
    if (!stageRef.current || !template) return;
    setDownloading(true);
    try {
      const dataUrl = stageRef.current.exportImage('jpeg', 2);
      downloadDataUrl(
        dataUrl,
        `Birthday-card-${safeFileName(personName)}-${String(index + 1).padStart(2, '0')}.jpg`,
      );
    } finally {
      setDownloading(false);
    }
  };

  const variants = useMemo(
    () => ({
      enter: (dir) => ({ x: dir * 48, opacity: 0, scale: 0.98 }),
      center: { x: 0, opacity: 1, scale: 1 },
      exit: (dir) => ({ x: dir * -48, opacity: 0, scale: 0.98 }),
    }),
    [],
  );

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="orb left-[-60px] top-24 h-64 w-64 bg-fuchsia-600/25" />
      <div className="orb right-[-40px] bottom-10 h-72 w-72 bg-cyan-500/20" />

      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        extra={
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-full glass px-3 py-2 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Edit
          </button>
        }
      />

      <main className="mx-auto max-w-xl px-4 pb-10">
        <div ref={frameRef} className="relative mx-auto flex min-h-[420px] items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={card?.id || index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            >
              <CardStage
                ref={stageRef}
                template={template}
                personName={personName}
                photoSrc={photoSrc}
                cutout={cutout}
                fitWidth={size.w}
                fitHeight={size.h}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5">
          <div className="mb-4 flex gap-1 overflow-hidden">
            {cards.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => go(i)}
                className={`h-1.5 flex-1 rounded-full ${i === index ? 'bg-amber-300' : 'bg-white/15'}`}
                aria-label={`Card ${i + 1}`}
              />
            ))}
          </div>
          <CardControls
            disablePrev={index === 0}
            disableNext={index >= cards.length - 1}
            onPrev={() => go(index - 1)}
            onNext={() => go(index + 1)}
            onDownload={download}
            downloading={downloading}
          />
        </div>
      </main>
    </div>
  );
}
