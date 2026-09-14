import { Sparkles } from 'lucide-react';

export function GenerateButton({ onClick, disabled, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400 px-6 py-4 font-display text-lg font-extrabold text-ink-950 shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5" />
        {loading ? 'Crafting 20 cards…' : 'Generate Cards'}
      </span>
    </button>
  );
}
