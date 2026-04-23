'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[88px] h-8 bg-bg-tertiary rounded-lg animate-pulse" />;
  }

  return (
    <div className="flex items-center bg-bg-tertiary p-1 rounded-lg border border-border">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-bg-primary shadow-sm text-text-primary'
            : 'text-text-muted hover:text-text-primary'
        }`}
        title="Light Mode"
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'system'
            ? 'bg-bg-primary shadow-sm text-text-primary'
            : 'text-text-muted hover:text-text-primary'
        }`}
        title="System Theme"
      >
        <Monitor size={14} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-bg-primary shadow-sm text-text-primary'
            : 'text-text-muted hover:text-text-primary'
        }`}
        title="Dark Mode"
      >
        <Moon size={14} />
      </button>
    </div>
  );
}
