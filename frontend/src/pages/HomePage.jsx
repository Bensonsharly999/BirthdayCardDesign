import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { PhotoUpload } from '../components/PhotoUpload';
import { NameInput } from '../components/NameInput';
import { GenerateButton } from '../components/GenerateButton';

export function HomePage({
  theme,
  onToggleTheme,
  file,
  previewUrl,
  onSelectPhoto,
  photoError,
  name,
  onName,
  onGenerate,
  loading,
  error,
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="orb -left-24 top-10 h-72 w-72 bg-fuchsia-600/40" />
      <div className="orb right-[-80px] top-40 h-80 w-80 bg-amber-400/25" />
      <div className="orb bottom-[-40px] left-1/4 h-72 w-72 bg-cyan-400/20" />

      <Header theme={theme} onToggleTheme={onToggleTheme} />

      <main className="relative mx-auto max-w-lg px-4 pb-16 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass rounded-[32px] p-5 shadow-2xl sm:p-7"
        >
          <PhotoUpload file={file} previewUrl={previewUrl} onSelect={onSelectPhoto} error={photoError} />
          <div className="mt-5 space-y-5">
            <NameInput value={name} onChange={onName} />
            <GenerateButton onClick={onGenerate} disabled={!file || !name.trim() || loading} loading={loading} />
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
