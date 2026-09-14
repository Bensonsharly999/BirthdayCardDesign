import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

export function CardControls({ onPrev, onNext, onDownload, downloading, disablePrev, disableNext }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={disablePrev}
          className="inline-flex items-center justify-center gap-1 rounded-2xl glass px-4 py-3 font-semibold disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" /> Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className="inline-flex items-center justify-center gap-1 rounded-2xl glass px-4 py-3 font-semibold disabled:opacity-30"
        >
          Next <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onDownload}
        disabled={Boolean(downloading)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400 px-4 py-3.5 font-display text-base font-extrabold text-ink-950 shadow-glow disabled:opacity-60"
      >
        <Download className="h-5 w-5" />
        {downloading ? 'Saving…' : 'Download'}
      </button>
    </div>
  );
}
