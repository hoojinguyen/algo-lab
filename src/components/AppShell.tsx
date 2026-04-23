'use client';

import {
  Search,
  Settings,
  ArrowDownUp,
  Activity,
  Brain,
  Network,
  Route,
  GitFork,
  TreeDeciduous,
  Link as LinkIcon,
  Grid3x3,
  Zap,
  Undo2,
  Type,
  Split,
  Merge,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/algorithms/categories';
import { getAlgorithmsByCategory } from '@/lib/algorithms/registry';
import { useSearchContext } from '@/contexts/SearchContext';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { CheckCircle } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';

const ICON_MAP: Record<string, React.ElementType> = {
  ArrowDownUp,
  Search,
  Network,
  Route,
  GitFork,
  TreeDeciduous,
  Link: LinkIcon,
  Grid3x3,
  Zap,
  Undo2,
  Type,
  Split,
  Merge,
  Brain,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { openSearch } = useSearchContext();
  const { progress, isMounted } = useUserProgress();

  const activeAlgorithms = activeCategory ? getAlgorithmsByCategory(activeCategory) : [];
  const completedInCategory = activeAlgorithms.filter((algo) =>
    progress.completedAlgorithms.includes(algo.id)
  ).length;
  const categoryProgressPercentage =
    activeAlgorithms.length > 0
      ? Math.round((completedInCategory / activeAlgorithms.length) * 100)
      : 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      {/* Icon Rail (48px) */}
      <nav className="w-12 border-r border-border flex flex-col items-center py-4 bg-bg-secondary z-20">
        <Link
          href="/"
          className="w-8 h-8 bg-text-primary rounded-md flex items-center justify-center mb-8"
        >
          <Activity size={18} className="text-bg-primary" />
        </Link>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar items-center">
          <button
            className="p-2 rounded-md transition-colors text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
            onClick={openSearch}
            title="Search Algorithms (⌘K)"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>

          <div className="w-6 h-px bg-border my-2 rounded-full flex-shrink-0" />
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Activity;
            return (
              <button
                key={cat.id}
                className={`p-2 rounded-md transition-colors ${activeCategory === cat.id ? 'text-accent bg-bg-tertiary' : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'}`}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                title={cat.name}
              >
                <Icon size={20} strokeWidth={1.75} />
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 mt-auto pt-4">
          <button className="p-2 text-text-muted hover:text-text-primary">
            <Settings size={20} strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      {/* Slide Panel (200px) */}
      {activeCategory && (
        <aside className="w-[200px] border-r border-border bg-bg-secondary flex flex-col z-10 transition-all duration-200">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold capitalize">{activeCategory.replace('-', ' ')}</h2>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
            {activeAlgorithms.map((algo) => {
              const isCompleted = isMounted && progress.completedAlgorithms.includes(algo.id);
              return (
                <Link
                  key={algo.id}
                  href={`/${activeCategory}/${algo.id}`}
                  className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{algo.name}</span>
                  {isCompleted && <CheckCircle size={14} className="text-success flex-shrink-0" />}
                </Link>
              );
            })}
            {activeAlgorithms.length === 0 && (
              <div className="px-3 py-2 text-xs text-text-muted italic">Coming soon...</div>
            )}
          </div>

          {/* Category Progress Bar */}
          {activeAlgorithms.length > 0 && isMounted && (
            <div className="p-4 border-t border-border bg-bg-tertiary/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-text-secondary">Category Progress</span>
                <span className="text-xs font-mono text-text-muted">
                  {categoryProgressPercentage}%
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-accent h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${categoryProgressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
        <CommandPalette />
      </main>
    </div>
  );
}
