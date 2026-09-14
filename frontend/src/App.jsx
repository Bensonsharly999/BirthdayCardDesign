import { useMemo, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { LoadingOverlay } from './components/LoadingOverlay';
import { useTheme } from './hooks/useTheme';
import { useObjectUrl } from './hooks/useObjectUrl';
import { createCards } from './services/cards';
import { isolateSubject } from './lib/cutout';

export default function App() {
  const { theme, toggle } = useTheme();
  const [file, setFile] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(8);
  const [status, setStatus] = useState('');
  const [cards, setCards] = useState([]);
  const [view, setView] = useState('home');
  const [cutoutUrl, setCutoutUrl] = useState('');
  const [cutout, setCutout] = useState(false);
  const previewUrl = useObjectUrl(file);

  const personName = useMemo(() => name.trim(), [name]);
  const studioPhoto = cutoutUrl || previewUrl;

  const onSelectPhoto = (next, message) => {
    setFile(next);
    setPhotoError(message || '');
    setCutoutUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
    setCutout(false);
  };

  const generate = async () => {
    if (!file || !personName) return;
    setError('');
    setLoading(true);
    setProgress(12);
    setStatus('Clearing the photo background…');
    try {
      await document.fonts.ready.catch(() => {});
      const isolated = await isolateSubject(file, (value) => {
        setProgress(value);
        setStatus('Clearing the photo background…');
      });
      setCutoutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return isolated.url || '';
      });
      setCutout(isolated.cutout);
      setStatus('Designing your cards…');
      setProgress(90);
      setCards(createCards());
      setProgress(100);
      setView('studio');
    } catch (err) {
      setError(
        err.message?.includes('publicPath') || err.message?.includes('fetch')
          ? 'Could not download the background-removal model. Check your internet and try again.'
          : 'Could not clear the photo background. Please try a clearer photo of one person, then generate again.',
      );
    } finally {
      setLoading(false);
      setProgress(8);
      setStatus('');
    }
  };

  return (
    <>
      {view === 'home' && (
        <HomePage
          theme={theme}
          onToggleTheme={toggle}
          file={file}
          previewUrl={previewUrl}
          onSelectPhoto={onSelectPhoto}
          photoError={photoError}
          name={name}
          onName={setName}
          onGenerate={generate}
          loading={loading}
          error={error}
        />
      )}
      {view === 'studio' && (
        <StudioPage
          theme={theme}
          onToggleTheme={toggle}
          cards={cards}
          photoSrc={studioPhoto}
          cutout={cutout}
          personName={personName}
          onBack={() => setView('home')}
        />
      )}
      {loading && (
        <LoadingOverlay
          progress={progress}
          name={personName || 'you'}
          status={status}
        />
      )}
    </>
  );
}
