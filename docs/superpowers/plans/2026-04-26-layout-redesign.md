# Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Modern Dashboard layout by creating a global Header and a persistent Left Sidebar, and refactoring the AppShell layout.

**Architecture:** We will decompose the monolithic `AppShell.tsx` into a `Sidebar` and `Header` component inside `src/components/layout/`. `AppShell` will act as the orchestrator using a modern Flexbox layout. The `ThemeToggle` will be moved globally to the Header.

**Tech Stack:** Next.js (React), Tailwind CSS, Lucide Icons

*(Note: Per user's previous instructions for this specific UI task, formal unit testing steps are bypassed in favor of direct implementation and visual verification).*

---

### Task 1: Create the Header Component

**Files:**
- Create: `src/components/layout/Header.tsx`

- [ ] **Step 1: Write the Header implementation**

```tsx
'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useSearchContext } from '@/contexts/SearchContext';
import { Search } from 'lucide-react';

export function Header() {
  const { openSearch } = useSearchContext();

  return (
    <header className="h-14 border-b border-border bg-bg-primary flex items-center justify-between px-6 z-10">
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: create global Header component with search and theme toggle"
```

### Task 2: Extract the Sidebar Component

**Files:**
- Create: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Write the Sidebar implementation (extracted from AppShell)**

```tsx
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
    <aside className="w-64 border-r border-border bg-bg-secondary flex flex-col h-full z-20">
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
                  isActive ? 'text-text-primary bg-bg-tertiary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                <Icon size={16} />
                <span className="capitalize">{cat.name}</span>
              </Link>
              
              {isActive && (
                <div className="pl-6 flex flex-col gap-0.5 mt-1">
                  {algorithms.length === 0 ? (
                    <div className="px-2 py-1 text-xs text-text-muted italic">Coming soon...</div>
                  ) : (
                    algorithms.map((algo) => {
                      const isAlgoActive = pathParts[1] === algo.id;
                      const isCompleted = isMounted && progress.completedAlgorithms.includes(algo.id);
                      
                      return (
                        <Link
                          key={algo.id}
                          href={`/${cat.id}/${algo.id}`}
                          className={`px-2 py-1.5 text-xs rounded-md flex items-center justify-between transition-colors ${
                            isAlgoActive ? 'text-accent font-medium bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                          }`}
                        >
                          <span className="truncate pr-2">{algo.name}</span>
                          {isCompleted && <CheckCircle size={12} className="text-success shrink-0" />}
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
      <div className="p-3 border-t border-border mt-auto">
        <button className="flex items-center gap-2 w-full px-2 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat: create global Sidebar component"
```

### Task 3: Refactor AppShell Layout

**Files:**
- Modify: `src/components/AppShell.tsx`

- [ ] **Step 1: Replace existing AppShell layout with the new structure**

```tsx
'use client';

import { CommandPalette } from '@/components/ui/CommandPalette';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {children}
          <CommandPalette />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check for Next.js routing requirements**
Make sure to create `src/components/layout` if it doesn't exist, and ensure all imports resolve cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppShell.tsx
git commit -m "refactor: update AppShell to use Modern Dashboard layout"
```

### Task 4: Remove redundant local ThemeToggle

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Remove ThemeToggle import and usage**

In `src/app/[category]/[algorithm]/page.tsx`, remove the import:
`import { ThemeToggle } from '@/components/ui/ThemeToggle';`

And remove `<ThemeToggle />` from the `<div className="flex items-center gap-4">` header area of the page (around line 125).

- [ ] **Step 2: Commit**

```bash
git add src/app/\[category\]/\[algorithm\]/page.tsx
git commit -m "refactor: remove local ThemeToggle since it is now in global Header"
```
