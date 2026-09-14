import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export function Header({ theme, onToggleTheme, extra }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-4 backdrop-blur-xl">
      <Logo />
      <div className="flex items-center gap-2">
        {extra}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
