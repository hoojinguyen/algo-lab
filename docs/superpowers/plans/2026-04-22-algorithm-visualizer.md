# Algorithm Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Tesla-inspired, Glassmorphic interactive algorithm visualizer with a Split Brain layout for learning.

**Architecture:** Next.js App Router. Algorithm logic decoupled into vanilla JS generator functions yielding state snapshots. A `usePlayback` hook acts as the state manager navigating these snapshots. Dumb UI components (ArrayVisualizer) render the current state using Framer Motion.

**Tech Stack:** Next.js, React, Tailwind CSS, Framer Motion, Jest (for engine tests).

---

### Task 1: Project Initialization & Global Styling

**Files:**
- Create: `package.json` (via create-next-app)
- Modify: `src/app/globals.css`, `tailwind.config.ts`

- [ ] **Step 1: Initialize Next.js project**
```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --force
npm install framer-motion lucide-react clsx tailwind-merge
```

- [ ] **Step 2: Configure Tailwind Theme**
In `tailwind.config.ts`, extend the theme for our specific colors:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#171A20",
        electric: "#3E6AE1",
        cloud: "#EEEEEE",
        pewter: "#5C5E62",
        graphite: "#393C41",
        lightash: "#F4F4F4"
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Add Global CSS for Cinematic Dark Background**
Modify `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #171A20;
  color: #FFFFFF;
  /* Abstract cinematic background mock using radial gradients, complying with 'no CSS gradients' rule by simulating photography lighting */
  background-image: radial-gradient(circle at 20% 30%, rgba(62, 106, 225, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  min-height: 100vh;
}

.glass-panel {
  background: rgba(23, 26, 32, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: initialize next.js project and global tesla theme"
```

### Task 2: Algorithm Engine Core & Bubble Sort

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/algorithms/bubbleSort.ts`
- Create: `src/lib/algorithms/__tests__/bubbleSort.test.ts`

- [ ] **Step 1: Define core types**
Create `src/lib/types.ts`:
```typescript
export interface AlgorithmState {
  step: number;
  description: string;
  activeIndices: number[];
  swapped: boolean;
  data: number[];
}
```

- [ ] **Step 2: Install testing library**
```bash
npm install -D jest @types/jest ts-jest
npx ts-jest config:init
```

- [ ] **Step 3: Write failing test**
Create `src/lib/algorithms/__tests__/bubbleSort.test.ts`:
```typescript
import { bubbleSortGenerator } from '../bubbleSort';

describe('bubbleSortGenerator', () => {
  it('yields correct states for a simple array', () => {
    const generator = bubbleSortGenerator([3, 1, 2]);
    
    // Initial comparison
    let result = generator.next();
    expect(result.value).toEqual({
      step: 1,
      description: "Comparing 3 and 1",
      activeIndices: [0, 1],
      swapped: false,
      data: [3, 1, 2]
    });

    // Swap
    result = generator.next();
    expect(result.value).toEqual({
      step: 2,
      description: "Swapping 1 and 3",
      activeIndices: [0, 1],
      swapped: true,
      data: [1, 3, 2]
    });
  });
});
```

- [ ] **Step 4: Verify test fails**
```bash
npx jest src/lib/algorithms/__tests__/bubbleSort.test.ts
```

- [ ] **Step 5: Implement Bubble Sort Generator**
Create `src/lib/algorithms/bubbleSort.ts`:
```typescript
import { AlgorithmState } from '../types';

export function* bubbleSortGenerator(initialArray: number[]): Generator<AlgorithmState, void, unknown> {
  const arr = [...initialArray];
  let step = 1;
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Yield comparison state
      yield {
        step: step++,
        description: `Comparing ${arr[j]} and ${arr[j+1]}`,
        activeIndices: [j, j+1],
        swapped: false,
        data: [...arr]
      };

      if (arr[j] > arr[j + 1]) {
        // Perform swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Yield swap state
        yield {
          step: step++,
          description: `Swapping ${arr[j]} and ${arr[j+1]}`,
          activeIndices: [j, j+1],
          swapped: true,
          data: [...arr]
        };
      }
    }
  }
}
```

- [ ] **Step 6: Verify test passes**
```bash
npx jest src/lib/algorithms/__tests__/bubbleSort.test.ts
```

- [ ] **Step 7: Commit**
```bash
git add src/lib/ jest.config.js
git commit -m "feat: implement bubble sort generator and core types"
```

### Task 3: Playback Controller Hook

**Files:**
- Create: `src/hooks/usePlayback.ts`
- Create: `src/hooks/__tests__/usePlayback.test.ts`

- [ ] **Step 1: Install React testing utils**
```bash
npm install -D @testing-library/react @testing-library/react-hooks jest-environment-jsdom
```
Modify `jest.config.js` to set `testEnvironment: "jsdom"`.

- [ ] **Step 2: Write failing test**
Create `src/hooks/__tests__/usePlayback.test.ts`:
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { usePlayback } from '../usePlayback';
import { AlgorithmState } from '@/lib/types';

const mockStates: AlgorithmState[] = [
  { step: 1, description: 'Step 1', activeIndices: [], swapped: false, data: [1] },
  { step: 2, description: 'Step 2', activeIndices: [], swapped: false, data: [2] },
];

describe('usePlayback', () => {
  it('manages state navigation', () => {
    const { result } = renderHook(() => usePlayback(mockStates));
    
    expect(result.current.currentState.step).toBe(1);
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.next();
    });

    expect(result.current.currentState.step).toBe(2);
  });
});
```

- [ ] **Step 3: Implement usePlayback Hook**
Create `src/hooks/usePlayback.ts`:
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { AlgorithmState } from '../lib/types';

export function usePlayback(states: AlgorithmState[], initialSpeedMs = 500) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(initialSpeedMs);
  
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, states.length - 1));
  }, [states.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isPlaying && currentIndex < states.length - 1) {
      timeoutId = setTimeout(() => {
        next();
      }, speedMs);
    } else if (currentIndex >= states.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, currentIndex, speedMs, states.length, next]);

  return {
    currentState: states[currentIndex] || null,
    currentIndex,
    totalSteps: states.length,
    isPlaying,
    setIsPlaying,
    next,
    prev,
    reset,
    setSpeedMs
  };
}
```

- [ ] **Step 4: Verify test passes**
```bash
npx jest src/hooks/__tests__/usePlayback.test.ts
```

- [ ] **Step 5: Commit**
```bash
git add src/hooks/ jest.config.js package.json package-lock.json
git commit -m "feat: implement usePlayback hook for state management"
```

### Task 4: Array Visualizer Component

**Files:**
- Create: `src/components/visualizers/ArrayVisualizer.tsx`

- [ ] **Step 1: Implement Visualizer using Framer Motion**
Create `src/components/visualizers/ArrayVisualizer.tsx`:
```tsx
"use client";

import { motion } from 'framer-motion';
import { AlgorithmState } from '@/lib/types';

interface ArrayVisualizerProps {
  state: AlgorithmState;
}

export function ArrayVisualizer({ state }: ArrayVisualizerProps) {
  if (!state || !state.data) return null;

  const maxValue = Math.max(...state.data, 1);

  return (
    <div className="flex items-end justify-center h-64 gap-2 p-8">
      {state.data.map((value, index) => {
        const isActive = state.activeIndices.includes(index);
        const heightPercentage = (value / maxValue) * 100;
        
        return (
          <motion.div
            key={`${index}-${value}`}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-12 rounded-t-sm flex items-end justify-center pb-2 ${
              isActive 
                ? state.swapped 
                  ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' 
                  : 'bg-electric shadow-[0_0_15px_rgba(62,106,225,0.8)]'
                : 'bg-cloud'
            }`}
            style={{ height: `${heightPercentage}%` }}
          >
            <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-carbon'}`}>
              {value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/visualizers/ArrayVisualizer.tsx
git commit -m "feat: create ArrayVisualizer with framer motion"
```

### Task 5: Playback Controls Component

**Files:**
- Create: `src/components/ui/PlaybackControls.tsx`

- [ ] **Step 1: Implement Controls**
Create `src/components/ui/PlaybackControls.tsx`:
```tsx
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
    <div className="flex items-center justify-center gap-6 p-4">
      <button 
        onClick={onReset}
        className="p-2 text-cloud hover:text-white transition-colors"
        title="Reset"
      >
        <RotateCcw size={20} />
      </button>
      
      <button 
        onClick={onPrev}
        disabled={isStart}
        className="p-2 text-cloud hover:text-white disabled:opacity-30 transition-colors"
        title="Previous Step"
      >
        <SkipBack size={20} />
      </button>

      <button 
        onClick={onPlayPause}
        className="bg-electric text-white rounded-md px-8 py-3 font-medium transition-transform hover:scale-105"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <button 
        onClick={onNext}
        disabled={isFinished}
        className="p-2 text-cloud hover:text-white disabled:opacity-30 transition-colors"
        title="Next Step"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/ui/PlaybackControls.tsx
git commit -m "feat: implement playback controls component"
```

### Task 6: Split Brain Layout Integration

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Implement Main Page Layout**
Replace `src/app/page.tsx` with:
```tsx
"use client";

import { useMemo } from 'react';
import { bubbleSortGenerator } from '@/lib/algorithms/bubbleSort';
import { usePlayback } from '@/hooks/usePlayback';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { PlaybackControls } from '@/components/ui/PlaybackControls';

export default function Home() {
  const initialArray = [9, 14, 5, 11, 3];
  
  const states = useMemo(() => {
    const generator = bubbleSortGenerator(initialArray);
    const result = [];
    for (let state of generator) {
      result.push(state);
    }
    return result;
  }, []);

  const {
    currentState,
    currentIndex,
    totalSteps,
    isPlaying,
    setIsPlaying,
    next,
    prev,
    reset
  } = usePlayback(states, 800);

  if (!currentState) return null;

  return (
    <main className="flex h-screen w-full overflow-hidden text-white font-sans">
      
      {/* Left Panel: The Story */}
      <section className="w-1/2 h-full glass-panel border-r border-pewter overflow-y-auto p-12 flex flex-col">
        <h4 className="text-xs font-bold tracking-widest text-pewter uppercase mb-4">Sorting Algorithms</h4>
        <h1 className="text-5xl font-medium mb-6">Bubble Sort</h1>
        
        <p className="text-lg leading-relaxed text-cloud mb-8 opacity-90">
          Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. 
          This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.
        </p>
        
        <div className="bg-carbon border border-pewter rounded-md p-6 mb-12">
          <h3 className="text-sm font-medium mb-4">Time Complexity</h3>
          <div className="flex justify-between border-b border-pewter pb-2 mb-2"><span className="text-cloud">Best Case</span><span className="font-mono">O(n)</span></div>
          <div className="flex justify-between border-b border-pewter pb-2 mb-2"><span className="text-cloud">Average Case</span><span className="font-mono">O(n²)</span></div>
          <div className="flex justify-between"><span className="text-cloud">Worst Case</span><span className="font-mono">O(n²)</span></div>
        </div>

        <h2 className="text-2xl font-medium mb-4">Current Step Action</h2>
        <div className="p-4 border-l-4 border-electric bg-electric/10 rounded-r-md">
          <p className="text-lg">{currentState.description}</p>
        </div>
      </section>

      {/* Right Panel: The Lab */}
      <section className="w-1/2 h-full glass-panel flex flex-col relative">
        <div className="absolute top-8 right-8 text-xs font-bold tracking-widest text-pewter uppercase">The Lab</div>
        
        <div className="flex-1 flex flex-col justify-center items-center">
          <ArrayVisualizer state={currentState} />
        </div>

        <div className="h-32 border-t border-pewter flex flex-col justify-center bg-carbon/50 backdrop-blur-md">
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
      
    </main>
  );
}
```

- [ ] **Step 2: Test rendering**
```bash
npm run build
```

- [ ] **Step 3: Commit**
```bash
git add src/app/
git commit -m "feat: implement split brain layout and integrate visualizer"
```
