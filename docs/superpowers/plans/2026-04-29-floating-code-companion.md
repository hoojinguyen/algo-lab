# Floating Code Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a draggable, minimizable, glassmorphic floating code panel that automatically shows during algorithm execution to prevent screen-jumping and improve focus.

**Architecture:** Create a new `FloatingCodePanel` component using `framer-motion` for drag/animation, update `CodeBlock` for compact rendering, and integrate into the main algorithm page layout.

**Tech Stack:** React, Next.js, Framer Motion, Lucide React, Tailwind CSS.

---

### Task 1: Enhance CodeBlock for Floating Context

**Files:**
- Modify: `src/components/ui/CodeBlock.tsx`

- [ ] **Step 1: Update CodeBlockProps and styling**
Add a `compact` prop and adjust styling to hide the header and reduce padding when in compact mode. Also, ensure `scrollIntoView` uses `block: 'nearest'` or a more stable approach to avoid container jumping.

```tsx
interface CodeBlockProps {
  code: string;
  activeLine?: number;
  compact?: boolean; // New prop
}

export function CodeBlock({ code, activeLine, compact = false }: CodeBlockProps) {
  // ... existing code ...
  
  useEffect(() => {
    if (activeLine !== undefined && codeRef.current) {
      const el = codeRef.current.querySelector("[data-line='" + activeLine + "']");
      if (el) {
        // Use block: 'nearest' to minimize jumping if already in view
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLine]);

  return (
    <div className={clsx(
      "bg-bg-secondary border border-border rounded-2xl overflow-hidden shadow-sm transition-all",
      !compact && "hover:border-accent/30 group/code"
    )}>
      {!compact && (
        <div className="flex items-center justify-between bg-bg-tertiary border-b border-border px-6 py-4">
          <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
            Implementation
          </span>
          <div className="flex gap-1.5 opacity-30 group-hover/code:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
          </div>
        </div>
      )}

      <pre
        ref={codeRef}
        className={clsx(
          "overflow-auto leading-relaxed no-scrollbar",
          compact ? "max-h-[300px] p-4 text-[12px]" : "max-h-[500px] p-6 text-[13px]"
        )}
      >
        {/* ... existing lines mapping ... */}
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/components/ui/CodeBlock.tsx
git commit -m "refactor: enhance CodeBlock for compact/floating mode"
```

### Task 2: Create FloatingCodePanel Component

**Files:**
- Create: `src/components/ui/FloatingCodePanel.tsx`

- [ ] **Step 1: Implement the component with Framer Motion**
Create a draggable, glassmorphic container that hosts the `CodeBlock` and handles minimizing.

```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Maximize2, GripHorizontal, X } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { clsx } from 'clsx';

interface FloatingCodePanelProps {
  code: string;
  activeLine?: number;
  isVisible: boolean;
  onClose?: () => void;
}

export function FloatingCodePanel({ code, activeLine, isVisible, onClose }: FloatingCodePanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          drag
          dragMomentum={false}
          className="fixed bottom-32 left-8 z-50 w-80 pointer-events-auto"
        >
          <div className="bg-bg-primary/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header / Drag Handle */}
            <div className="px-4 py-2 bg-bg-tertiary/50 border-b border-border flex items-center justify-between cursor-grab active:cursor-grabbing group">
              <div className="flex items-center gap-2">
                <GripHorizontal size={14} className="text-muted group-hover:text-text-primary transition-colors" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Code Companion</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-border rounded transition-colors text-muted hover:text-text-primary"
                >
                  {isMinimized ? <Maximize2 size={12} /> : <Minus size={12} />}
                </button>
                {onClose && (
                  <button 
                    onClick={onClose}
                    className="p-1 hover:bg-error/10 rounded transition-colors text-muted hover:text-error"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <motion.div
              animate={{ height: isMinimized ? 0 : 'auto', opacity: isMinimized ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CodeBlock code={code} activeLine={activeLine} compact={true} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/components/ui/FloatingCodePanel.tsx
git commit -m "feat: add FloatingCodePanel component with drag and minimize"
```

### Task 3: Integrate into LessonPage

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Import and render the FloatingCodePanel**
Connect the panel to the `isPlaying` state and the current algorithm's code.

```tsx
// ... imports ...
import { FloatingCodePanel } from '@/components/ui/FloatingCodePanel';

export default function LessonPage({ params }: { params: Promise<{ category: string; algorithm: string }> }) {
  // ... existing hooks ...
  const { currentState, currentIndex, totalSteps, isPlaying, setIsPlaying, next, prev, reset } =
    usePlayback(states, 500);

  return (
    <div className="flex h-full w-full">
      {/* ... Left Column ... */}
      
      {/* Right Column: Visualizer */}
      <section className="flex-1 h-full flex flex-col relative bg-bg-secondary">
        {/* ... existing Lab badge ... */}

        <div className="flex-1 flex flex-col justify-center items-center">
          {/* ... existing description and visualizer ... */}
        </div>

        {/* New: Floating Code Panel */}
        <FloatingCodePanel 
          code={currentEntry.code}
          activeLine={currentState.codeLine}
          isVisible={isPlaying}
          onClose={() => setIsPlaying(false)}
        />

        {/* ... PlaybackControls ... */}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/[category]/[algorithm]/page.tsx
git commit -m "feat: integrate FloatingCodePanel into LessonPage"
```

### Task 4: Final Polish and Verification

- [ ] **Step 1: Verify layout stability**
Run the dev server and start an algorithm. Ensure the left column (Theory/Code) does NOT scroll or jump, and only the floating panel's code highlights.
- [ ] **Step 2: Test drag and minimize**
Ensure the panel can be moved around the right section and can be minimized without issues.
- [ ] **Step 3: Verify Auto-show/hide**
Ensure the panel appears when clicking "Play" and disappears when clicking "Reset" or when the algorithm finishes.
- [ ] **Step 4: Commit and Cleanup**

```bash
git commit -m "chore: final polish and verification of Floating Code Companion"
```
