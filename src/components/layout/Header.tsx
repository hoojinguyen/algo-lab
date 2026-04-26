'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useSearchContext } from '@/contexts/SearchContext';
import { Search } from 'lucide-react';

export function Header() {
  const { openSearch } = useSearchContext();

  return (
    <header className="h-14 border-b border-border bg-bg-primary flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <button
          onClick={openSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted bg-bg-tertiary hover:bg-bg-secondary border border-border rounded-md transition-colors"
        >
          <Search size={16} />
          <span>Search algorithms...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] text-text-muted bg-bg-primary border border-border rounded opacity-70">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
