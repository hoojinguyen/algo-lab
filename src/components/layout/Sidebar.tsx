'use client';

import {
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
  Settings,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/algorithms/categories';
import { getAlgorithmsByCategory } from '@/lib/algorithms/registry';
import { useUserProgress } from '@/hooks/useUserProgress';

const ICON_MAP: Record<string, React.ElementType> = {
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

export function Sidebar() {
  const pathname = usePathname();
  const { progress, isMounted } = useUserProgress();

  // Try to determine active category from path
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const activeCategory = pathParts.length > 0 ? pathParts[0] : null;

  return (
    <aside className="w-64 border-r border-border bg-bg-secondary flex flex-col h-full z-20 shrink-0">
      {/* Logo Area */}
      <div className="h-14 border-b border-border flex items-center px-4 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-text-primary rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
            <Activity size={18} className="text-bg-primary" />
          </div>
          <span className="font-bold text-text-primary tracking-tight">AlgoLab</span>
        </Link>
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 flex flex-col gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Activity;
          const isActive = activeCategory === cat.id;
          const algorithms = getAlgorithmsByCategory(cat.id);

          return (
            <div key={cat.id} className="flex flex-col gap-1">
              <Link
                href={`/${cat.id}/${algorithms[0]?.id || ''}`}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-text-primary bg-bg-tertiary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                <Icon size={16} />
                <span className="capitalize">{cat.name.replace('-', ' ')}</span>
              </Link>

              {isActive && (
                <div className="pl-6 flex flex-col gap-0.5 mt-1">
                  {algorithms.length === 0 ? (
                    <div className="px-2 py-1 text-xs text-text-muted italic">Coming soon...</div>
                  ) : (
                    algorithms.map((algo) => {
                      const isAlgoActive = pathParts[1] === algo.id;
                      const isCompleted =
                        isMounted && progress.completedAlgorithms.includes(algo.id);

                      return (
                        <Link
                          key={algo.id}
                          href={`/${cat.id}/${algo.id}`}
                          className={`px-2 py-1.5 text-xs rounded-md flex items-center justify-between transition-colors ${
                            isAlgoActive
                              ? 'text-accent font-medium bg-accent/10'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                          }`}
                        >
                          <span className="truncate pr-2">{algo.name}</span>
                          {isCompleted && (
                            <CheckCircle size={12} className="text-success shrink-0" />
                          )}
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border mt-auto shrink-0">
        <button className="flex items-center gap-2 w-full px-2 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
