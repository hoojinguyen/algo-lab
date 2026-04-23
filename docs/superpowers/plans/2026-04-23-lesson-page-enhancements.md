# Lesson Page Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement missing features from the Lesson Page (TopBar, Theme Toggle, LeetCode Practice Section) and update the AppShell Slide Panel to dynamically reflect algorithm list and user progress.

**Architecture:** We will integrate the existing `useUserProgress` hook into `AppShell` to display completion status. We'll create a new `ThemeToggle` component interacting with `next-themes`, and update the `LessonPage` component to include the new TopBar and Practice sections.

**Tech Stack:** Next.js (Client Components), TypeScript, Tailwind CSS v4, Lucide React, next-themes

---

### Task 1: Create Theme Toggle Component

**Files:**
- Create: `src/components/ui/ThemeToggle.tsx`

- [x] **Step 1: Create `ThemeToggle`**

Create `src/components/ui/ThemeToggle.tsx` to handle light/dark mode switching using `next-themes`.

```tsx
"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[88px] h-8 bg-bg-tertiary rounded-lg animate-pulse" />;
  }

  return (
    <div className="flex items-center bg-bg-tertiary p-1 rounded-lg border border-border">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "light" ? "bg-bg-primary shadow-sm text-text-primary" : "text-text-muted hover:text-text-primary"
        }`}
        title="Light Mode"
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "system" ? "bg-bg-primary shadow-sm text-text-primary" : "text-text-muted hover:text-text-primary"
        }`}
        title="System Theme"
      >
        <Monitor size={14} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "dark" ? "bg-bg-primary shadow-sm text-text-primary" : "text-text-muted hover:text-text-primary"
        }`}
        title="Dark Mode"
      >
        <Moon size={14} />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/ThemeToggle.tsx
git commit -m "feat: add ThemeToggle component"
```

### Task 2: Dynamic Slide Panel & Progress

**Files:**
- Modify: `src/components/AppShell.tsx`

- [x] **Step 1: Update AppShell**

Integrate `useUserProgress` to show completion icons and a progress bar in the slide panel. Replace the slide panel section in `src/components/AppShell.tsx`:

```tsx
// 1. Add imports at the top
import { CheckCircle } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';

// 2. Inside AppShell, add useUserProgress hook
export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { openSearch } = useSearchContext();
  const { progress, isMounted } = useUserProgress();

  // Calculate progress for active category
  const activeAlgorithms = activeCategory ? getAlgorithmsByCategory(activeCategory) : [];
  const completedInCategory = activeAlgorithms.filter(algo => progress.completedAlgorithms.includes(algo.id)).length;
  const categoryProgressPercentage = activeAlgorithms.length > 0 
    ? Math.round((completedInCategory / activeAlgorithms.length) * 100) 
    : 0;

  // ... (keep the rest of the component the same up to the Slide Panel)

  // 3. Update the Slide Panel (aside) block
      {/* Slide Panel (200px) */}
      {activeCategory && (
        <aside className="w-[200px] border-r border-border bg-bg-secondary flex flex-col z-10 transition-all duration-200">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold capitalize">{activeCategory.replace('-', ' ')}</h2>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
            {activeAlgorithms.map(algo => {
              const isCompleted = isMounted && progress.completedAlgorithms.includes(algo.id);
              return (
                <Link 
                  key={algo.id}
                  href={`/${activeCategory}/${algo.id}`}
                  className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{algo.name}</span>
                  {isCompleted && (
                    <CheckCircle size={14} className="text-success flex-shrink-0" />
                  )}
                </Link>
              );
            })}
            {activeAlgorithms.length === 0 && (
              <div className="px-3 py-2 text-xs text-text-muted italic">
                Coming soon...
              </div>
            )}
          </div>
          
          {/* Category Progress Bar */}
          {activeAlgorithms.length > 0 && isMounted && (
            <div className="p-4 border-t border-border bg-bg-tertiary/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-text-secondary">Category Progress</span>
                <span className="text-xs font-mono text-text-muted">{categoryProgressPercentage}%</span>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppShell.tsx
git commit -m "feat: add dynamic progress to slide panel"
```

### Task 3: Lesson Page TopBar & Practice Section

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [x] **Step 1: Update LessonPage**

Update `src/app/[category]/[algorithm]/page.tsx` to include the TopBar and Practice section.

```tsx
// 1. Add imports at the top
import { CheckCircle, ExternalLink, ChevronRight } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// 2. Inside LessonPage component, add the progress hook
export default function LessonPage({ params }: { params: Promise<{ category: string, algorithm: string }> }) {
  const resolvedParams = use(params);
  // ... existing code ...
  const currentEntry = isValid ? entry : null;

  const { progress, markCompleted, addRecentlyStudied, isMounted } = useUserProgress();
  const isCompleted = isMounted && currentEntry && progress.completedAlgorithms.includes(currentEntry.id);

  // 3. Add useEffect for recently studied tracking
  useEffect(() => {
    if (currentEntry) {
      addRecentlyStudied(currentEntry.id);
    }
  }, [currentEntry?.id]);

  // ... (keep the playback logic the same)
  
  // 4. Update the return statement for the left column
  return (
    <div className="flex h-full w-full">
      {/* Left Column: Theory & Code */}
      <section className="w-[55%] h-full border-r border-border overflow-y-auto no-scrollbar bg-bg-primary flex flex-col">
        {/* TopBar */}
        <div className="px-12 py-6 border-b border-border flex items-center justify-between sticky top-0 bg-bg-primary/95 backdrop-blur z-10">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="capitalize">{currentEntry.category.replace('-', ' ')}</span>
            <ChevronRight size={14} />
            <span className="text-text-primary font-medium">{currentEntry.name}</span>
          </div>
          <div className="flex items-center gap-4">
            {isMounted && (
              <button
                onClick={() => markCompleted(currentEntry.id)}
                disabled={isCompleted}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isCompleted 
                    ? 'bg-success/10 text-success cursor-default' 
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-border'
                }`}
              >
                <CheckCircle size={16} />
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        <div className="p-12 max-w-2xl mx-auto w-full">
          {/* ... existing header and theory ... */}
          
          <div className="mb-12">
            <CodeBlock
              code={currentEntry.code}
              activeLine={currentState.codeLine}
            />
          </div>

          {/* Practice Section */}
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-xl font-medium mb-6">Practice on LeetCode</h3>
            {currentEntry.leetcode && currentEntry.leetcode.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {currentEntry.leetcode.map((problem) => (
                  <a
                    key={problem.id}
                    href={`https://leetcode.com/problems/${problem.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-bg-secondary border border-border rounded-xl hover:border-accent transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                        problem.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                        problem.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                        'bg-error/10 text-error'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span className="font-medium text-text-primary group-hover:text-accent transition-colors">
                        {problem.title}
                      </span>
                    </div>
                    <ExternalLink size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-bg-secondary rounded-xl border border-border text-center">
                <p className="text-text-muted">No specific practice problems mapped yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Right Column: Visualizer (Keep existing right column) */}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[category\]/\[algorithm\]/page.tsx
git commit -m "feat: add lesson page topbar and practice section"
```
