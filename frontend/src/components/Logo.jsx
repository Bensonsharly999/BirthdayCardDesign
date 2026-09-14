import { Sparkles } from 'lucide-react';

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-amber-400 to-cyan-400 shadow-glow">
        <Sparkles className="h-5 w-5 text-ink-950" />
      </div>
      {!compact && (
        <p className="font-display text-lg font-extrabold tracking-tight">Birthday card</p>
      )}
    </div>
  );
}
