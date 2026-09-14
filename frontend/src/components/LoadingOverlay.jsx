import { motion } from 'framer-motion';

export function LoadingOverlay({ progress, name, status }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/80 px-6 backdrop-blur-md">
      <div className="w-full max-w-md text-center">
        <motion.div
          className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-amber-400 to-cyan-400"
          animate={{ rotate: 360, scale: [1, 1.08, 1] }}
          transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.6, repeat: Infinity } }}
        />
        <p className="font-display text-2xl font-extrabold">Designing cards for {name}</p>
        <p className="mt-2 text-sm text-white/60">
          {status || 'Keeping only you in the photo, then placing you into 25 templates. The first time may take a minute.'}
        </p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400"
            initial={{ width: '6%' }}
            animate={{ width: `${Math.max(progress, 6)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/40">{progress}% complete</p>
      </div>
    </div>
  );
}
