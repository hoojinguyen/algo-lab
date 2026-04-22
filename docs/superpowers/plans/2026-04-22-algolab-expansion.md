# AlgoLab Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current 3-algorithm sorting visualizer into a comprehensive algorithm learning platform with a professional UI.

**Architecture:** Next.js App Router with a file-based registry pattern. Split into a Dashboard server component and dynamic client components for Lesson pages. Uses a system-aware light/dark theme.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS v4, Lucide React

---

### Task 1: Project Setup & Core Types

**Files:**
- Modify: `package.json`
- Create: `src/lib/types.ts`
- Create: `src/lib/algorithms/categories.ts`

- [ ] **Step 1: Install dependencies**

```bash
npm install lucide-react next-themes
```

- [ ] **Step 2: Update types.ts**

Modify `src/lib/types.ts` to replace the existing content with the new architecture types:

```typescript
export interface Category {
  id: string;
  name: string;
  section: SectionLabel;
  icon: string;
  description: string;
}

export interface AlgorithmConfig {
  id: string;
  name: string;
  category: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  stable: boolean;
  visualizerType: VisualizerType;
  tags: string[];
}

export interface LeetCodeProblem {
  title: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AlgorithmEntry extends AlgorithmConfig {
  theory: string;
  code: string;
  generator: (input: any) => Generator<AlgorithmState>;
  leetcode: LeetCodeProblem[];
}

export interface AlgorithmState {
  step: number;
  description: string;
  activeIndices: number[];
  swapped: boolean;
  data: number[];
  codeLine?: number;
}

export type VisualizerType = 'array' | 'graph' | 'tree' | 'matrix' | 'scatter' | 'linked-list';
export type SectionLabel = 'fundamentals' | 'advanced' | 'data-structures' | 'intelligence';
```

- [ ] **Step 3: Create categories.ts**

Create `src/lib/algorithms/categories.ts`:

```typescript
import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'sorting',
    name: 'Sorting',
    section: 'fundamentals',
    icon: 'ArrowDownUp',
    description: 'Algorithms that put elements of a list into an order.'
  },
  {
    id: 'searching',
    name: 'Searching',
    section: 'fundamentals',
    icon: 'Search',
    description: 'Algorithms that find an item with specified properties among a collection of items.'
  }
];
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/types.ts src/lib/algorithms/categories.ts
git commit -m "chore: setup dependencies and core types for AlgoLab expansion"
```

### Task 2: Theme System Setup

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/ThemeProvider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ThemeProvider**

Create `src/components/ThemeProvider.tsx`:

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Update globals.css**

Replace the entire contents of `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-border: var(--border);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-accent: var(--accent);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f4f4f5;
  --border: rgba(0, 0, 0, 0.08);
  --text-primary: #09090b;
  --text-secondary: #52525b;
  --text-muted: #a1a1aa;
  --accent: #2563eb;
  --success: #16a34a;
  --warning: #ca8a04;
  --error: #dc2626;
  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
}

[data-theme='dark'] {
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-tertiary: #27272a;
  --border: rgba(255, 255, 255, 0.06);
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #52525b;
  --accent: #3b82f6;
  --success: #22c55e;
  --warning: #eab308;
  --error: #ef4444;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  margin: 0;
  font-family: var(--font-sans);
}

/* Hide scrollbar for sidebars */
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 3: Update layout.tsx**

Modify `src/app/layout.tsx` to wrap children with `ThemeProvider`:

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/ThemeProvider.tsx src/app/layout.tsx
git commit -m "feat: implement zinc-based light/dark theme system"
```

### Task 3: Fix CodeBlock Parsing Error

**Files:**
- Modify: `src/components/ui/CodeBlock.tsx`

- [ ] **Step 1: Fix the querySelector backtick issue and update classes**

Modify `src/components/ui/CodeBlock.tsx`:

```tsx
"use client";

import { useEffect, useRef } from 'react';

interface CodeBlockProps {
  code: string;
  activeLine?: number;
}

function tokenise(line: string): React.ReactNode {
  const tokens: { text: string; type: string }[] = [];
  const re = /(".*?"|'.*?'|`.*?`|\/\/.*$|\b(function|return|let|const|var|if|else|for|while|of|new|this)\b|\b\d+\b)/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push({ text: line.slice(cursor, match.index), type: 'plain' });
    }
    const val = match[0];
    if (/^["'`]/.test(val)) {
      tokens.push({ text: val, type: 'string' });
    } else if (/^\/\//.test(val)) {
      tokens.push({ text: val, type: 'comment' });
    } else if (/^\d+$/.test(val)) {
      tokens.push({ text: val, type: 'number' });
    } else {
      tokens.push({ text: val, type: 'keyword' });
    }
    cursor = match.index + val.length;
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), type: 'plain' });
  }

  return tokens.map((t, i) => {
    let className = 'text-text-primary';
    if (t.type === 'keyword') className = 'text-accent font-semibold';
    else if (t.type === 'string') className = 'text-warning';
    else if (t.type === 'number') className = 'text-success';
    else if (t.type === 'comment') className = 'text-text-muted italic';
    return <span key={i} className={className}>{t.text}</span>;
  });
}

export function CodeBlock({ code, activeLine }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const lines = code.split('\n');

  useEffect(() => {
    if (activeLine !== undefined && codeRef.current) {
      // Fix: Used string concatenation instead of template literal to avoid parsing errors
      const el = codeRef.current.querySelector("[data-line='" + activeLine + "']");
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine]);

  return (
    <div className="bg-bg-secondary border border-border rounded-md overflow-hidden">
      <div className="flex items-center gap-2 bg-bg-tertiary border-b border-border px-4 py-2">
        <span className="w-3 h-3 rounded-full bg-border" />
        <span className="w-3 h-3 rounded-full bg-border" />
        <span className="w-3 h-3 rounded-full bg-border" />
        <span className="ml-4 text-xs font-bold text-text-muted uppercase tracking-widest">Implementation</span>
      </div>

      <pre
        ref={codeRef}
        className="overflow-auto max-h-72 p-4 text-sm font-mono leading-relaxed no-scrollbar"
      >
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;
          return (
            <div
              key={idx}
              data-line={lineNumber}
              className={`flex gap-4 rounded-sm transition-all duration-200 ${
                isActive
                  ? 'bg-accent/10 border-l-2 border-accent -mx-4 px-3'
                  : '-mx-0'
              }`}
            >
              <span
                className={`select-none shrink-0 w-6 text-right text-xs leading-relaxed ${
                  isActive ? 'text-accent font-bold' : 'text-text-muted'
                }`}
              >
                {lineNumber}
              </span>
              <span className="flex-1">
                {line ? tokenise(line) : <span>&nbsp;</span>}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/CodeBlock.tsx
git commit -m "fix: CodeBlock querySelector parsing error and update to zinc theme colors"
```

### Task 4: UI Components Update (Playback & Visualizer)

**Files:**
- Modify: `src/components/ui/PlaybackControls.tsx`
- Modify: `src/components/visualizers/ArrayVisualizer.tsx`

- [ ] **Step 1: Update PlaybackControls.tsx**

Replace `src/components/ui/PlaybackControls.tsx`:

```tsx
"use client";

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  isFinished: boolean;
  isStart: boolean;
}

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  isFinished,
  isStart
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button 
        onClick={onReset}
        className="p-3 rounded-full text-text-secondary hover:bg-bg-tertiary transition-colors"
        title="Reset"
      >
        <RotateCcw size={20} />
      </button>
      
      <button 
        onClick={onPrev}
        disabled={isStart}
        className={`p-3 rounded-full transition-colors ${
          isStart ? 'text-text-muted opacity-50' : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Step Backward"
      >
        <SkipBack size={24} />
      </button>

      <button 
        onClick={onPlayPause}
        className="p-5 rounded-full bg-accent hover:bg-accent/80 text-white transition-all transform hover:scale-105 shadow-lg"
      >
        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
      </button>

      <button 
        onClick={onNext}
        disabled={isFinished}
        className={`p-3 rounded-full transition-colors ${
          isFinished ? 'text-text-muted opacity-50' : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Step Forward"
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Update ArrayVisualizer.tsx**

Replace `src/components/visualizers/ArrayVisualizer.tsx`:

```tsx
"use client";

import { AlgorithmState } from '@/lib/types';
import { useMemo } from 'react';

export function ArrayVisualizer({ state }: { state: AlgorithmState }) {
  const maxValue = useMemo(() => Math.max(...state.data), [state.data]);

  return (
    <div className="flex items-end justify-center h-64 gap-2 px-8 w-full max-w-3xl">
      {state.data.map((value, idx) => {
        const isActive = state.activeIndices.includes(idx);
        const height = `${(value / maxValue) * 100}%`;
        
        let bgColor = 'bg-bg-tertiary border border-border';
        if (isActive) {
          bgColor = state.swapped ? 'bg-success' : 'bg-accent';
        }

        return (
          <div 
            key={idx} 
            className="flex flex-col items-center justify-end h-full flex-1 group"
          >
            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted text-xs font-mono">
              {value}
            </div>
            <div 
              className={`w-full rounded-t-sm transition-all duration-300 ease-out ${bgColor}`}
              style={{ height }}
            />
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/PlaybackControls.tsx src/components/visualizers/ArrayVisualizer.tsx
git commit -m "style: update UI components to use new theme tokens"
```

### Task 5: Migrate Bubble Sort

**Files:**
- Create: `src/lib/algorithms/sorting/bubble-sort/index.ts`
- Remove: `src/lib/algorithms/bubbleSort.ts`

- [ ] **Step 1: Create Bubble Sort files**

Create `src/lib/algorithms/sorting/bubble-sort/index.ts`:

```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const bubbleSortGenerator = function* (arr: number[]): Generator<AlgorithmState> {
  const data = [...arr];
  let n = data.length;
  let codeLine = 1;
  
  yield { step: 0, description: "Initial array state", activeIndices: [], swapped: false, data: [...data], codeLine: 1 };
  
  for (let i = 0; i < n; i++) {
    codeLine = 2;
    yield { step: 0, description: `Starting pass ${i + 1}`, activeIndices: [], swapped: false, data: [...data], codeLine };
    
    for (let j = 0; j < n - i - 1; j++) {
      codeLine = 3;
      yield { step: 0, description: `Comparing elements at index ${j} and ${j + 1}`, activeIndices: [j, j + 1], swapped: false, data: [...data], codeLine };
      
      codeLine = 4;
      if (data[j] > data[j + 1]) {
        yield { step: 0, description: `${data[j]} > ${data[j + 1]}, need to swap`, activeIndices: [j, j + 1], swapped: false, data: [...data], codeLine };
        
        let temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
        
        codeLine = 5;
        yield { step: 0, description: `Swapped elements`, activeIndices: [j, j + 1], swapped: true, data: [...data], codeLine };
      } else {
        yield { step: 0, description: `${data[j]} <= ${data[j + 1]}, no swap needed`, activeIndices: [j, j + 1], swapped: false, data: [...data], codeLine };
      }
    }
  }
  
  codeLine = 11;
  yield { step: 0, description: "Array is completely sorted", activeIndices: [], swapped: false, data: [...data], codeLine };
};

export const bubbleSortEntry: AlgorithmEntry = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  complexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)'
  },
  stable: true,
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  theory: `Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.`,
  code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
  generator: bubbleSortGenerator,
  leetcode: []
};
```

- [ ] **Step 2: Clean up old file**

```bash
rm src/lib/algorithms/bubbleSort.ts
```

- [ ] **Step 3: Commit**

```bash
mkdir -p src/lib/algorithms/sorting/bubble-sort
git add src/lib/algorithms/sorting/bubble-sort/index.ts src/lib/algorithms/bubbleSort.ts
git commit -m "refactor: migrate bubble sort to new architecture"
```

### Task 6: App Shell Navigation Components

**Files:**
- Create: `src/components/AppShell.tsx`

- [ ] **Step 1: Create AppShell**

Create `src/components/AppShell.tsx`:

```tsx
"use client";

import { Search, Settings, ArrowDownUp, Activity } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      {/* Icon Rail (48px) */}
      <nav className="w-12 border-r border-border flex flex-col items-center py-4 bg-bg-secondary z-20">
        <Link href="/" className="w-8 h-8 bg-text-primary rounded-md flex items-center justify-center mb-8">
          <Activity size={18} className="text-bg-primary" />
        </Link>
        
        <div className="flex flex-col gap-4 flex-1">
          <button 
            className={`p-2 rounded-md transition-colors ${activeCategory === 'sorting' ? 'text-accent bg-bg-tertiary' : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'}`}
            onClick={() => setActiveCategory(activeCategory === 'sorting' ? null : 'sorting')}
            title="Sorting"
          >
            <ArrowDownUp size={20} strokeWidth={1.75} />
          </button>
          <button 
            className={`p-2 rounded-md transition-colors ${activeCategory === 'searching' ? 'text-accent bg-bg-tertiary' : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'}`}
            onClick={() => setActiveCategory(activeCategory === 'searching' ? null : 'searching')}
            title="Searching"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <button className="p-2 text-text-muted hover:text-text-primary">
            <Search size={20} strokeWidth={1.75} />
          </button>
          <button className="p-2 text-text-muted hover:text-text-primary">
            <Settings size={20} strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      {/* Slide Panel (200px) */}
      {activeCategory && (
        <aside className="w-[200px] border-r border-border bg-bg-secondary flex flex-col z-10 transition-all duration-200">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold capitalize">{activeCategory}</h2>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
            <Link 
              href={`/${activeCategory}/bubble-sort`}
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md block"
            >
              Bubble Sort
            </Link>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Update App Layout**

Modify `src/app/layout.tsx` to include `AppShell`:

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";

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
          <AppShell>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AppShell.tsx src/app/layout.tsx
git commit -m "feat: implement main AppShell with IconRail and SlidePanel"
```

### Task 7: Replace Main Page with Dashboard

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

Replace `src/app/page.tsx` with the new Dashboard Home:

```tsx
"use client";

import { Activity } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/algorithms/categories';

export default function Home() {
  return (
    <div className="h-full w-full overflow-y-auto p-12 bg-bg-primary">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-medium mb-2">Welcome to AlgoLab</h1>
          <p className="text-text-muted">Master algorithms with interactive visualizations.</p>
        </header>

        <section className="mb-12">
          <div className="bg-bg-secondary border border-border rounded-xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold mb-1">Your Progress</h2>
              <p className="text-text-muted text-sm">0 of 55 completed</p>
            </div>
            <div className="w-64 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div className="h-full bg-accent w-0"></div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.id}
                href={`/${cat.id}/bubble-sort`}
                className="bg-bg-secondary border border-border p-6 rounded-xl hover:border-text-muted transition-colors flex items-start gap-4 group"
              >
                <div className="p-3 bg-bg-tertiary rounded-lg group-hover:bg-accent/10 transition-colors">
                  <Activity className="text-text-muted group-hover:text-accent transition-colors" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{cat.name}</h3>
                  <p className="text-text-muted text-sm line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: replace main visualizer with Dashboard Home"
```

### Task 8: Create Dynamic Lesson Page

**Files:**
- Create: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Create Lesson Page**

Create `src/app/[category]/[algorithm]/page.tsx`:

```tsx
"use client";

import { use, useMemo, useState } from 'react';
import { bubbleSortEntry } from '@/lib/algorithms/sorting/bubble-sort';
import { usePlayback } from '@/hooks/usePlayback';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { CodeBlock } from '@/components/ui/CodeBlock';

// Temporary map until registry is built with all algorithms
const registry: Record<string, any> = {
  'bubble-sort': bubbleSortEntry
};

export default function LessonPage({ params }: { params: Promise<{ category: string, algorithm: string }> }) {
  const resolvedParams = use(params);
  const entry = registry[resolvedParams.algorithm];

  const initialArray = useMemo(() => [9, 14, 5, 11, 3, 22, 1, 8], []);
  
  const states = useMemo(() => {
    if (!entry) return [];
    const generator = entry.generator(initialArray);
    const result = [];
    for (let state of generator) {
      result.push(state);
    }
    return result;
  }, [entry, initialArray]);

  const {
    currentState,
    currentIndex,
    totalSteps,
    isPlaying,
    setIsPlaying,
    next,
    prev,
    reset
  } = usePlayback(states, 500);

  if (!entry || !currentState) {
    return <div className="p-12 text-text-muted">Algorithm not found</div>;
  }

  return (
    <div className="flex h-full w-full">
      {/* Left Column: Theory & Code */}
      <section className="w-[55%] h-full border-r border-border overflow-y-auto no-scrollbar p-12 bg-bg-primary">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 mb-6">
            <span className="px-2 py-1 text-xs font-mono bg-success/10 text-success border border-success/20 rounded">
              Best: {entry.complexity.best}
            </span>
            <span className="px-2 py-1 text-xs font-mono bg-warning/10 text-warning border border-warning/20 rounded">
              Avg: {entry.complexity.average}
            </span>
            <span className="px-2 py-1 text-xs font-mono bg-error/10 text-error border border-error/20 rounded">
              Worst: {entry.complexity.worst}
            </span>
          </div>

          <h1 className="text-4xl font-medium mb-6">{entry.name}</h1>
          
          <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-12">
            <p>{entry.theory}</p>
          </div>

          <div className="mb-12">
            <CodeBlock
              code={entry.code}
              activeLine={currentState.codeLine}
            />
          </div>
        </div>
      </section>

      {/* Right Column: Visualizer */}
      <section className="flex-1 h-full flex flex-col relative bg-bg-secondary">
        <div className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold tracking-widest text-text-muted uppercase border border-border rounded-full bg-bg-primary">
          Lab
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="mb-8 p-4 bg-bg-tertiary border border-border rounded-lg text-text-primary text-center min-h-[60px] min-w-[300px] flex items-center justify-center font-medium shadow-sm">
            {currentState.description}
          </div>
          <ArrayVisualizer state={currentState} />
        </div>

        <div className="h-28 border-t border-border flex flex-col justify-center bg-bg-primary z-10">
          <PlaybackControls 
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={next}
            onPrev={prev}
            onReset={reset}
            isFinished={currentIndex === totalSteps - 1}
            isStart={currentIndex === 0}
          />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p src/app/\[category\]/\[algorithm\]
git add src/app/\[category\]/\[algorithm\]/page.tsx
git commit -m "feat: create dynamic lesson page split layout"
```
