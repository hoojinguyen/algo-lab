# Phase 3: DP, Greedy, Backtracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the foundation for Phase 3 algorithms including Dynamic Programming, Greedy, Backtracking, and String algorithms by extending the type system and creating a new MatrixVisualizer.

**Architecture:** We will extend the existing `AlgorithmState` union to support a `MatrixAlgorithmState` for 2D DP grids and chessboard visualizations. We will create a `MatrixVisualizer` component that seamlessly renders these grid-based state representations. Lastly, we will register the new categories in the global registry.

**Tech Stack:** TypeScript, React, Framer Motion (assumed for MatrixVisualizer animation).

---

### Task 1: Update Global Types for Phase 3

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add new Matrix types and visualizer type**

Update `src/lib/types.ts` to include the new `CellState` and `MatrixAlgorithmState` types, and update `VisualizerType` and `AlgorithmState` unions.

```typescript
export type CellState = 'empty' | 'computing' | 'filled' | 'optimal' | 'conflict' | 'current';

export interface MatrixAlgorithmState extends BaseAlgorithmState {
  matrix: (number | string | null)[][];
  rowHeaders?: string[];
  colHeaders?: string[];
  highlightedCells: { row: number; col: number; state: CellState }[];
  pathCells?: { row: number; col: number }[];
  currentCell?: { row: number; col: number };
}

// Update existing AlgorithmState to include MatrixAlgorithmState
export type AlgorithmState =
  | ArrayAlgorithmState
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState
  | MatrixAlgorithmState;

// Update VisualizerType to include 'matrix'
export type VisualizerType = 'array' | 'graph' | 'tree' | 'matrix' | 'scatter' | 'linked-list';
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add MatrixAlgorithmState and update types for Phase 3"
```

### Task 2: Register Phase 3 Categories

**Files:**
- Modify: `src/lib/algorithms/categories.ts`

- [ ] **Step 1: Add new categories**

Append the new Phase 3 categories to `CATEGORIES` array in `src/lib/algorithms/categories.ts`.

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
  },
  { id: 'graph-traversal', name: 'Graph Traversal', section: 'advanced', icon: 'Network', description: 'Explore graphs' },
  { id: 'shortest-path', name: 'Shortest Path', section: 'advanced', icon: 'Route', description: 'Find paths' },
  { id: 'mst', name: 'Minimum Spanning Tree', section: 'advanced', icon: 'GitFork', description: 'Connect nodes' },
  { id: 'tree', name: 'Tree', section: 'data-structures', icon: 'TreeDeciduous', description: 'Hierarchical data' },
  { id: 'linked-list', name: 'Linked List', section: 'data-structures', icon: 'Link', description: 'Chained nodes' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', section: 'advanced', icon: 'Grid3x3', description: 'Solve complex problems by breaking them down into simpler subproblems' },
  { id: 'greedy', name: 'Greedy', section: 'advanced', icon: 'Zap', description: 'Make the locally optimal choice at each stage' },
  { id: 'backtracking', name: 'Backtracking', section: 'advanced', icon: 'Undo2', description: 'Incrementally build candidates and abandon them if they cannot be completed' },
  { id: 'string', name: 'String', section: 'fundamentals', icon: 'Type', description: 'Process and search within text strings' },
  { id: 'divide-conquer', name: 'Divide & Conquer', section: 'advanced', icon: 'Split', description: 'Recursively break down a problem into two or more sub-problems' },
  { id: 'union-find', name: 'Union-Find', section: 'data-structures', icon: 'Merge', description: 'Keep track of elements partitioned into disjoint sets' }
];
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/algorithms/categories.ts
git commit -m "feat: register Phase 3 algorithm categories"
```

### Task 3: Create MatrixVisualizer Component

**Files:**
- Create: `src/components/visualizers/MatrixVisualizer.tsx`

- [ ] **Step 1: Write minimal MatrixVisualizer implementation**

Create `src/components/visualizers/MatrixVisualizer.tsx`:

```tsx
'use client';

import React from 'react';
import { MatrixAlgorithmState, CellState } from '@/lib/types';
import { motion } from 'framer-motion';

interface MatrixVisualizerProps {
  state: MatrixAlgorithmState;
}

export const MatrixVisualizer: React.FC<MatrixVisualizerProps> = ({ state }) => {
  const getCellColor = (row: number, col: number) => {
    if (state.currentCell?.row === row && state.currentCell?.col === col) {
      return 'bg-blue-500 text-white';
    }
    
    const highlighted = state.highlightedCells?.find(h => h.row === row && h.col === col);
    if (highlighted) {
      switch (highlighted.state) {
        case 'computing': return 'bg-yellow-400 text-black';
        case 'filled': return 'bg-gray-700 text-white';
        case 'optimal': return 'bg-green-500 text-white';
        case 'conflict': return 'bg-red-500 text-white';
        case 'current': return 'bg-blue-500 text-white';
        default: return 'bg-gray-800 text-gray-300';
      }
    }
    
    const isPath = state.pathCells?.some(p => p.row === row && p.col === col);
    if (isPath) {
      return 'bg-green-600 text-white';
    }

    return 'bg-gray-800 text-gray-300';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 overflow-auto">
      <div className="relative">
        <table className="border-collapse">
          <thead>
            {state.colHeaders && (
              <tr>
                {state.rowHeaders && <th></th>}
                {state.colHeaders.map((header, i) => (
                  <th key={i} className="p-2 text-sm text-gray-400 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {state.matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {state.rowHeaders && (
                  <th className="p-2 text-sm text-gray-400 font-medium pr-4">
                    {state.rowHeaders[rowIndex]}
                  </th>
                )}
                {row.map((cellValue, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <motion.div
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`flex items-center justify-center w-12 h-12 rounded shadow-sm font-medium ${getCellColor(rowIndex, colIndex)}`}
                    >
                      {cellValue}
                    </motion.div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/visualizers/MatrixVisualizer.tsx
git commit -m "feat: create MatrixVisualizer component"
```

### Task 4: Integrate MatrixVisualizer into VisualizerPanel

**Files:**
- Modify: `src/components/visualizers/VisualizerPanel.tsx`

- [ ] **Step 1: Update VisualizerPanel to render MatrixVisualizer**

Update `src/components/visualizers/VisualizerPanel.tsx` to handle the `matrix` visualizer type.

```tsx
'use client';

import React from 'react';
import { AlgorithmState, AlgorithmConfig } from '@/lib/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';

interface VisualizerPanelProps {
  config: AlgorithmConfig;
  state: AlgorithmState;
}

export const VisualizerPanel: React.FC<VisualizerPanelProps> = ({ config, state }) => {
  const renderVisualizer = () => {
    switch (config.visualizerType) {
      case 'array':
        return <ArrayVisualizer state={state as any} />;
      case 'graph':
        return <GraphVisualizer state={state as any} />;
      case 'tree':
        return <TreeVisualizer state={state as any} />;
      case 'linked-list':
        return <LinkedListVisualizer state={state as any} />;
      case 'matrix':
        return <MatrixVisualizer state={state as any} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            Visualizer for {config.visualizerType} is under construction.
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      {renderVisualizer()}
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/visualizers/VisualizerPanel.tsx
git commit -m "feat: integrate MatrixVisualizer into VisualizerPanel"
```
