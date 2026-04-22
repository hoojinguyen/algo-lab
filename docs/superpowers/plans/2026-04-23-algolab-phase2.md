# AlgoLab Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand AlgoLab to support graph, tree, and linked list algorithms with specialized state types and visualizer components.

**Architecture:** Refactor `AlgorithmState` into a discriminated union. Implement a factory pattern `VisualizerPanel` to dynamically render `ArrayVisualizer`, `GraphVisualizer`, `TreeVisualizer`, or `LinkedListVisualizer` based on the algorithm's config.

**Tech Stack:** React, Framer Motion, TypeScript, Next.js.

---

### Task 1: Core Types & Categories Refactoring

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/algorithms/categories.ts`

- [ ] **Step 1: Refactor AlgorithmState in types.ts**

Modify `src/lib/types.ts` to replace the `AlgorithmState` interface with a discriminated union structure and add the required new types:

```typescript
export interface BaseAlgorithmState {
  step: number;
  description: string;
  codeLine?: number;
}

export interface ArrayAlgorithmState extends BaseAlgorithmState {
  data: number[];
  activeIndices: number[];
  swapped: boolean;
}

export interface GraphNode {
  id: string;
  value: number;
  x: number;
  y: number;
  state: 'unvisited' | 'visiting' | 'visited' | 'current' | 'start' | 'end';
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state: 'default' | 'considering' | 'selected' | 'in-path' | 'rejected';
}

export interface GraphAlgorithmState extends BaseAlgorithmState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode?: string;
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number>;
}

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  balanceFactor?: number;
  height?: number;
}

export interface TreeAlgorithmState extends BaseAlgorithmState {
  root: TreeNode | null;
  highlightedNodes: string[];
  visitedNodes: string[];
  currentNode?: string;
  rotationType?: 'left' | 'right' | 'left-right' | 'right-left';
}

export interface ListNode {
  id: string;
  value: number;
  next: string | null;
}

export interface PointerMarker {
  name: string;
  nodeId: string;
  color: string;
}

export interface LinkedListAlgorithmState extends BaseAlgorithmState {
  nodes: ListNode[];
  headId: string;
  pointers: PointerMarker[];
  cycleTarget?: string;
}

export type AlgorithmState =
  | ArrayAlgorithmState
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState;
```
*(Ensure `BaseAlgorithmState` properties are removed from old `AlgorithmState` definition since they are inherited now).*

- [ ] **Step 2: Update categories.ts**

Add the new categories to the array in `src/lib/algorithms/categories.ts`:

```typescript
  { id: 'graph-traversal', name: 'Graph Traversal', section: 'advanced', icon: 'Network', description: 'Explore graphs' },
  { id: 'shortest-path', name: 'Shortest Path', section: 'advanced', icon: 'Route', description: 'Find paths' },
  { id: 'mst', name: 'Minimum Spanning Tree', section: 'advanced', icon: 'GitFork', description: 'Connect nodes' },
  { id: 'tree', name: 'Tree', section: 'data-structures', icon: 'TreeDeciduous', description: 'Hierarchical data' },
  { id: 'linked-list', name: 'Linked List', section: 'data-structures', icon: 'Link', description: 'Chained nodes' }
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts src/lib/algorithms/categories.ts
git commit -m "refactor: update state types and add categories for Phase 2"
```

### Task 2: Graph Visualizer Component

**Files:**
- Create: `src/components/visualizers/GraphVisualizer.tsx`

- [ ] **Step 1: Write GraphVisualizer component**

```tsx
import { GraphAlgorithmState } from '@/lib/types';
import { motion } from 'framer-motion';

export function GraphVisualizer({ state }: { state: GraphAlgorithmState }) {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <svg className="w-full h-full overflow-visible">
        {state.edges.map((edge) => {
          const fromNode = state.nodes.find(n => n.id === edge.from);
          const toNode = state.nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={edge.state === 'in-path' ? '#4ade80' : '#4b5563'}
              strokeWidth={2}
            />
          );
        })}
        {state.nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={14}
            fill={node.state === 'visited' ? '#4ade80' : '#1f2937'}
            stroke="#4b5563"
            strokeWidth={2}
          />
        ))}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/visualizers/GraphVisualizer.tsx
git commit -m "feat: add GraphVisualizer component"
```

### Task 3: Tree Visualizer Component

**Files:**
- Create: `src/components/visualizers/TreeVisualizer.tsx`

- [ ] **Step 1: Write TreeVisualizer component**

```tsx
import { TreeAlgorithmState } from '@/lib/types';

export function TreeVisualizer({ state }: { state: TreeAlgorithmState }) {
  if (!state.root) return <div className="text-text-muted">Empty Tree</div>;

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="text-text-primary">
        Tree Visualization Placeholder. Root: {state.root.value}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/visualizers/TreeVisualizer.tsx
git commit -m "feat: add TreeVisualizer component placeholder"
```

### Task 4: Linked List Visualizer Component

**Files:**
- Create: `src/components/visualizers/LinkedListVisualizer.tsx`

- [ ] **Step 1: Write LinkedListVisualizer component**

```tsx
import { LinkedListAlgorithmState } from '@/lib/types';
import { motion } from 'framer-motion';

export function LinkedListVisualizer({ state }: { state: LinkedListAlgorithmState }) {
  return (
    <div className="flex items-center justify-center h-full w-full gap-4 p-8 overflow-x-auto">
      {state.nodes.map((node) => (
        <div key={node.id} className="flex items-center gap-4">
          <motion.div 
            className="border border-border p-4 rounded bg-bg-secondary text-text-primary"
          >
            {node.value}
          </motion.div>
          {node.next && (
            <div className="text-text-muted font-bold">→</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/visualizers/LinkedListVisualizer.tsx
git commit -m "feat: add LinkedListVisualizer component"
```

### Task 5: VisualizerPanel Factory

**Files:**
- Create: `src/components/visualizers/VisualizerPanel.tsx`

- [ ] **Step 1: Write VisualizerPanel component**

```tsx
import { AlgorithmState, VisualizerType, ArrayAlgorithmState, GraphAlgorithmState, TreeAlgorithmState, LinkedListAlgorithmState } from '@/lib/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';

interface VisualizerPanelProps {
  type: VisualizerType;
  state: AlgorithmState;
}

export function VisualizerPanel({ type, state }: VisualizerPanelProps) {
  switch (type) {
    case 'array':
      return <ArrayVisualizer state={state as ArrayAlgorithmState} />;
    case 'graph':
      return <GraphVisualizer state={state as GraphAlgorithmState} />;
    case 'tree':
      return <TreeVisualizer state={state as TreeAlgorithmState} />;
    case 'linked-list':
      return <LinkedListVisualizer state={state as LinkedListAlgorithmState} />;
    default:
      return <div className="text-text-muted">Unsupported visualizer type: {type}</div>;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/visualizers/VisualizerPanel.tsx
git commit -m "feat: add VisualizerPanel factory"
```

### Task 6: Update Lesson Page to Use Factory

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Replace visualizer import**

In `src/app/[category]/[algorithm]/page.tsx`, replace the `ArrayVisualizer` import:
```tsx
import { VisualizerPanel } from '@/components/visualizers/VisualizerPanel';
```

- [ ] **Step 2: Update the visualizer component render**

In `src/app/[category]/[algorithm]/page.tsx`, find `<ArrayVisualizer state={currentState} />` and replace it with:
```tsx
<VisualizerPanel type={entry.visualizerType} state={currentState} />
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[category]/[algorithm]/page.tsx
git commit -m "feat: wire up VisualizerPanel to lesson page"
```
