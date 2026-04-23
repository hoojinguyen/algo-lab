# Command Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a fast, keyboard-accessible command palette overlay (⌘K / Ctrl+K) to search across all algorithms and categories.

**Architecture:** A React Context (`SearchContext`) will manage the global visibility state. Custom hooks (`useSearch`, `useKeyPress`) will handle filtering logic and keyboard shortcuts. The `CommandPalette` component will render the modal, and it will be triggered by both keyboard shortcuts and the `IconRail` search button.

**Tech Stack:** Next.js (Client Components), TypeScript, Tailwind CSS v4, Lucide React

---

### Task 1: Create Global Search Context

**Files:**
- Create: `src/contexts/SearchContext.tsx`
- Modify: `src/app/layout.tsx`

- [x] **Step 1: Create SearchContext**

Create `src/contexts/SearchContext.tsx` to provide the global modal state:

```tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ isOpen, openSearch: () => setIsOpen(true), closeSearch: () => setIsOpen(false), toggleSearch: () => setIsOpen(!isOpen) }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
```

- [x] **Step 2: Update App Layout**

Wrap the application in `SearchProvider` inside `src/app/layout.tsx`.

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { SearchProvider } from "@/contexts/SearchContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoLab",
  description: "Algorithm learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeProvider>
          <SearchProvider>
            <AppShell>
              {children}
            </AppShell>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/contexts/SearchContext.tsx src/app/layout.tsx
git commit -m "feat: add SearchContext and wrap application"
```

### Task 2: Create Custom Hooks

**Files:**
- Create: `src/hooks/useSearch.ts`
- Create: `src/hooks/useKeyPress.ts`

- [x] **Step 1: Create `useKeyPress` hook**

Create `src/hooks/useKeyPress.ts` for keyboard shortcuts:

```typescript
"use client";

import { useEffect } from 'react';

export function useKeyPress(
  key: string, 
  callback: (e: KeyboardEvent) => void, 
  metaKey: boolean = false
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the pressed key matches
      if (event.key.toLowerCase() === key.toLowerCase()) {
        // If metaKey is required, ensure either ctrlKey or metaKey (Cmd on Mac) is pressed
        if (metaKey && !(event.metaKey || event.ctrlKey)) {
          return;
        }
        callback(event);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, metaKey]);
}
```

- [x] **Step 2: Create `useSearch` hook**

Create `src/hooks/useSearch.ts` for fuzzy matching. It depends on `ALGORITHM_REGISTRY`, which we'll import.

```typescript
"use client";

import { useMemo } from 'react';
import { ALGORITHM_REGISTRY } from '@/lib/algorithms/registry';
import { AlgorithmEntry } from '@/lib/types';

export function useSearch(query: string) {
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const allAlgorithms = Object.values(ALGORITHM_REGISTRY);
    
    return allAlgorithms.filter(algo => 
      algo.name.toLowerCase().includes(lowerQuery) ||
      algo.category.toLowerCase().includes(lowerQuery) ||
      algo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, AlgorithmEntry[]> = {};
    results.forEach(algo => {
      if (!groups[algo.category]) {
        groups[algo.category] = [];
      }
      groups[algo.category].push(algo);
    });
    return groups;
  }, [results]);

  return { results, groupedResults };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useKeyPress.ts src/hooks/useSearch.ts
git commit -m "feat: add useKeyPress and useSearch hooks"
```

### Task 3: Build Command Palette Component

**Files:**
- Create: `src/components/ui/CommandPalette.tsx`
- Modify: `src/components/AppShell.tsx`

- [x] **Step 1: Create `CommandPalette` component**

Create `src/components/ui/CommandPalette.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useSearchContext } from '@/contexts/SearchContext';
import { useKeyPress } from '@/hooks/useKeyPress';
import { useSearch } from '@/hooks/useSearch';

export function CommandPalette() {
  const { isOpen, closeSearch, toggleSearch } = useSearchContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { results, groupedResults } = useSearch(query);

  useKeyPress('k', (e) => {
    e.preventDefault();
    toggleSearch();
  }, true);

  useKeyPress('escape', () => {
    if (isOpen) closeSearch();
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        router.push(`/${selected.category}/${selected.id}`);
        closeSearch();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeSearch}
      />
      <div className="relative w-full max-w-2xl bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 border-b border-border">
          <Search size={20} className="text-text-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent py-4 outline-none text-text-primary placeholder:text-text-muted"
            placeholder="Search algorithms, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="text-xs text-text-muted flex gap-1 font-mono bg-bg-tertiary px-2 py-1 rounded border border-border">
            <span>ESC</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
          {query.trim() !== '' && results.length === 0 && (
            <div className="p-8 text-center text-text-muted">
              No algorithms found for "{query}"
            </div>
          )}

          {Object.entries(groupedResults).map(([category, items]) => (
            <div key={category} className="mb-4 last:mb-0">
              <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {category}
              </div>
              <div className="flex flex-col gap-1">
                {items.map((algo) => {
                  const globalIndex = results.indexOf(algo);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <div
                      key={algo.id}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-bg-tertiary border-l-2 border-accent text-text-primary' 
                          : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary border-l-2 border-transparent'
                      }`}
                      onClick={() => {
                        router.push(`/${algo.category}/${algo.id}`);
                        closeSearch();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <span className="font-medium">{algo.name}</span>
                      <div className="flex gap-2">
                        {algo.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-bg-primary border border-border rounded text-text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [x] **Step 2: Update AppShell**

Modify `src/components/AppShell.tsx` to include `CommandPalette` and use `SearchContext` for the search button.

```tsx
"use client";

import { Search, Settings, ArrowDownUp, Activity, Brain, Network, Route, GitFork, TreeDeciduous, Link as LinkIcon, Grid3x3, Zap, Undo2, Type, Split, Merge } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/algorithms/categories';
import { getAlgorithmsByCategory } from '@/lib/algorithms/registry';
import { useSearchContext } from '@/contexts/SearchContext';
import { CommandPalette } from '@/components/ui/CommandPalette';

const ICON_MAP: Record<string, any> = {
  ArrowDownUp, Search, Network, Route, GitFork, TreeDeciduous, Link: LinkIcon, Grid3x3, Zap, Undo2, Type, Split, Merge, Brain
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { openSearch } = useSearchContext();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      {/* Icon Rail (48px) */}
      <nav className="w-12 border-r border-border flex flex-col items-center py-4 bg-bg-secondary z-20">
        <Link href="/" className="w-8 h-8 bg-text-primary rounded-md flex items-center justify-center mb-8">
          <Activity size={18} className="text-bg-primary" />
        </Link>
        
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar">
          <button 
            className="p-2 rounded-md transition-colors text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
            onClick={openSearch}
            title="Search Algorithms (⌘K)"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>
          
          <div className="w-6 h-px bg-border my-2 rounded-full" />
          
          {CATEGORIES.map(cat => {
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

        <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-border w-full items-center">
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
            {getAlgorithmsByCategory(activeCategory).map(algo => (
              <Link 
                key={algo.id}
                href={`/${activeCategory}/${algo.id}`}
                className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md block"
              >
                {algo.name}
              </Link>
            ))}
            {getAlgorithmsByCategory(activeCategory).length === 0 && (
              <div className="px-3 py-2 text-xs text-text-muted italic">
                Coming soon...
              </div>
            )}
          </div>
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CommandPalette.tsx src/components/AppShell.tsx
git commit -m "feat: implement Command Palette and wire up triggers"
```
