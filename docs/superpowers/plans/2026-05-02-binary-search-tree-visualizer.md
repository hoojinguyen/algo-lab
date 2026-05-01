# Binary Search Tree Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dual-view (BST + Array) visualizer for Binary Search that emphasizes search space elimination.

**Architecture:** Use a state-driven approach where the generator provides the active range [low, high] and path, and a specialized `SearchVisualizer` renders the tree and array with elimination effects.

**Tech Stack:** React, Tailwind CSS, Framer Motion, Lucide React.

---

### Task 1: Update Type Definitions
**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add `SearchAlgorithmState` to `src/lib/types.ts`**
```typescript
export interface SearchAlgorithmState extends BaseAlgorithmState {
  data: number[];
  targetValue: number | null;
  targetIndex: number | null;
  low: number;
  high: number;
  mid: number | null;
  found: boolean;
  eliminatedIndices: number[];
  path: number[]; // Indices of nodes visited in the tree
}
```
And add it to the `AlgorithmState` union:
```typescript
export type AlgorithmState =
  | ArrayAlgorithmState
  | SearchAlgorithmState // New
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState
  | MatrixAlgorithmState
  | ScatterAlgorithmState;
```

- [ ] **Step 2: Commit changes**
```bash
git add src/lib/types.ts
git commit -m "feat: add SearchAlgorithmState to types"
```

### Task 2: Implement Binary Search Generator
**Files:**
- Modify: `src/lib/algorithms/searching/binary-search/index.ts`

- [ ] **Step 1: Implement the `binarySearchGenerator`**
```typescript
import { AlgorithmEntry, SearchAlgorithmState } from '@/lib/types';

export const binarySearchEntry: AlgorithmEntry = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  visualizerType: 'array', // Will be mapped to SearchVisualizer
  tags: ['divide-and-conquer'],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  theory: 'Search a sorted array by repeatedly dividing the search interval in half.',
  code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
  leetcode: [],
  stable: true,
  *generator(initialArray: number[], target?: number): Generator<SearchAlgorithmState> {
    const data = [...initialArray].sort((a, b) => a - b);
    let low = 0;
    let high = data.length - 1;
    const path: number[] = [];
    const eliminatedIndices: number[] = [];

    // Step 0: Initial state (searching hasn't started or waiting for target)
    yield {
      step: 0,
      description: target === undefined ? 'Select a target element to begin' : `Searching for ${target}`,
      data,
      targetValue: target ?? null,
      targetIndex: target !== undefined ? data.indexOf(target) : null,
      low,
      high,
      mid: null,
      found: false,
      eliminatedIndices: [],
      path: [],
      codeLine: 1
    };

    if (target === undefined) return;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      path.push(mid);
      
      // Step: Calculate Mid
      yield {
        step: path.length * 2 - 1,
        description: `Comparing target ${target} with mid element ${data[mid]}`,
        data,
        targetValue: target,
        targetIndex: data.indexOf(target),
        low,
        high,
        mid,
        found: false,
        eliminatedIndices: [...eliminatedIndices],
        path: [...path],
        codeLine: 6
      };

      if (data[mid] === target) {
        yield {
          step: path.length * 2,
          description: `Found ${target} at index ${mid}!`,
          data,
          targetValue: target,
          targetIndex: mid,
          low: mid,
          high: mid,
          mid,
          found: true,
          eliminatedIndices: data.map((_, i) => i).filter(i => i !== mid),
          path: [...path],
          codeLine: 7
        };
        return;
      }

      if (data[mid] < target) {
        // Eliminate left side
        for (let i = low; i <= mid; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        low = mid + 1;
        yield {
          step: path.length * 2,
          description: `${data[mid]} < ${target}, searching right half`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 8
        };
      } else {
        // Eliminate right side
        for (let i = mid; i <= high; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        high = mid - 1;
        yield {
          step: path.length * 2,
          description: `${data[mid]} > ${target}, searching left half`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 9
        };
      }
    }

    yield {
      step: path.length * 2 + 1,
      description: `${target} not found in the array`,
      data,
      targetValue: target,
      targetIndex: -1,
      low,
      high,
      mid: null,
      found: false,
      eliminatedIndices: data.map((_, i) => i),
      path: [...path],
      codeLine: 11
    };
  },
};
```

- [ ] **Step 2: Commit changes**
```bash
git add src/lib/algorithms/searching/binary-search/index.ts
git commit -m "feat: implement Binary Search generator with elimination state"
```

### Task 3: Create SearchVisualizer Component
**Files:**
- Create: `src/components/visualizers/SearchVisualizer.tsx`

- [ ] **Step 1: Implement the `SearchVisualizer` with Tree and Array views**
```tsx
"use client";

import React, { useMemo } from 'react';
import { SearchAlgorithmState } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  id: number;
  value: number;
  index: number;
  left: TreeNode | null;
  right: TreeNode | null;
  depth: number;
  x: number;
}

export function SearchVisualizer({ state }: { state: SearchAlgorithmState }) {
  const { data, low, high, mid, targetIndex, eliminatedIndices, path, found } = state;

  // Build a balanced BST from the sorted array for visualization
  const treeRoot = useMemo(() => {
    function buildTree(arr: number[], originalIndices: number[], depth: number = 0): TreeNode | null {
      if (arr.length === 0) return null;
      const midIdx = Math.floor(arr.length / 2);
      const node: TreeNode = {
        id: originalIndices[midIdx],
        value: arr[midIdx],
        index: originalIndices[midIdx],
        depth,
        x: 0, // Will be calculated for layout
        left: buildTree(arr.slice(0, midIdx), originalIndices.slice(0, midIdx), depth + 1),
        right: buildTree(arr.slice(midIdx + 1), originalIndices.slice(midIdx + 1), depth + 1),
      };
      return node;
    }
    const indices = data.map((_, i) => i);
    return buildTree(data, indices);
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
      {/* Target Key Display */}
      <div className="flex flex-col items-center gap-2">
         <span className="text-[10px] font-bold tracking-widest uppercase text-text-muted">Target Key</span>
         <div className="w-16 h-16 rounded-xl bg-bg-tertiary border-2 border-accent/20 flex items-center justify-center text-2xl font-bold text-accent shadow-lg shadow-accent/5">
            {state.targetValue ?? '?'}
         </div>
      </div>

      {/* Tree Visualization (Logical View) */}
      <div className="relative flex-1 w-full max-w-3xl flex justify-center py-8">
         {/* Simplified Tree Render for Demo - In implementation use a robust Tree Layout */}
         <div className="text-text-muted italic text-sm">Decision Tree Visualization Logic goes here</div>
      </div>

      {/* Array Visualization (Physical View) */}
      <div className="w-full max-w-4xl flex items-end justify-center gap-2 h-40">
        {data.map((val, idx) => {
          const isEliminated = eliminatedIndices.includes(idx);
          const isActive = idx === mid;
          const isTarget = idx === targetIndex;
          const isInRange = idx >= low && idx <= high;

          return (
            <motion.div
              key={idx}
              layout
              className="flex flex-col items-center gap-2"
              animate={{
                opacity: isEliminated ? 0.2 : 1,
                y: isEliminated ? 20 : 0,
                scale: isActive ? 1.1 : 1
              }}
            >
              <div 
                className={`w-12 flex items-center justify-center rounded-lg border transition-all duration-500 font-bold ${
                  isActive 
                    ? 'h-24 bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-110 z-10' 
                    : isTarget && found
                    ? 'h-20 bg-success/20 text-success border-success'
                    : isInRange
                    ? 'h-20 bg-bg-tertiary text-text-primary border-border'
                    : 'h-16 bg-bg-secondary text-text-muted border-transparent'
                }`}
              >
                {val}
              </div>
              <div className="text-[10px] text-text-muted font-mono">{idx}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit changes**
```bash
git add src/components/visualizers/SearchVisualizer.tsx
git commit -m "feat: create SearchVisualizer component"
```

### Task 4: Register Visualizer in Panel
**Files:**
- Modify: `src/components/visualizers/VisualizerPanel.tsx`

- [ ] **Step 1: Add `SearchVisualizer` to the panel factory**
```tsx
import { SearchVisualizer } from './SearchVisualizer';
// ... inside VisualizerPanel
if (type === 'array' && state.category === 'searching') {
  return <SearchVisualizer state={state as SearchAlgorithmState} />;
}
```

- [ ] **Step 2: Commit changes**
```bash
git add src/components/visualizers/VisualizerPanel.tsx
git commit -m "feat: integrate SearchVisualizer into VisualizerPanel"
```
