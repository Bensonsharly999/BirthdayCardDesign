import { ImagePlus, X } from 'lucide-react';
import { useRef } from 'react';
import { isSupportedPhoto } from '../services/cards';

export function PhotoUpload({ file, previewUrl, onSelect, error }) {
  const inputRef = useRef(null);

  const onChange = (event) => {
    const next = event.target.files?.[0];
    if (!next) return;
    if (!isSupportedPhoto(next)) {
      return onSelect(null, 'Please upload a JPG, JPEG, or PNG photo.');
    }
    onSelect(next, '');
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/pjpeg,image/png,.jpg,.jpeg,.jpe,.png"
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex min-h-[220px] w-full overflow-hidden rounded-3xl border border-dashed border-white/20 bg-white/5 p-4 text-left transition hover:border-fuchsia-400/60 hover:bg-white/10"
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Upload preview" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="relative mt-auto flex items-center justify-between text-white">
              <span className="text-sm font-semibold">Tap to replace photo</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-wider">JPG / JPEG / PNG</span>
            </div>
          </>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-cyan-400/30">
              <ImagePlus className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">Upload a photo</p>
              <p className="mt-1 text-sm text-white/60">JPG, JPEG or PNG — we keep you and clear the background</p>
            </div>
          </div>
        )}
      </button>
      {file && (
        <button
          type="button"
          onClick={() => onSelect(null, '')}
          className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
        >
          <X className="h-3.5 w-3.5" /> Remove photo
        </button>
      )}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}
