# AlgoLab Phase 2 — Graph, Tree & Linked List

**Date:** 2026-04-22
**Status:** Designed (not yet planned for implementation)
**Depends on:** Phase 1 complete
**Scope:** 17 algorithms, 4 categories, 3 new visualizer types

## 1. Overview

Phase 2 introduces graph-based and hierarchical data structures — the most visually rich category. This phase requires three entirely new visualizer types (Graph, Tree, LinkedList) and extends the `AlgorithmState` type to support non-array data.

## 2. New Categories

### Graph Traversal (2 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| BFS | graph | O(V + E) | O(V) | Level-order exploration using queue |
| DFS | graph | O(V + E) | O(V) | Depth-first exploration using stack/recursion |

### Shortest Path (4 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Dijkstra's | graph | O((V + E) log V) | O(V) | Greedy shortest path, no negative weights |
| Bellman-Ford | graph | O(V × E) | O(V) | Handles negative weights, detects negative cycles |
| Floyd-Warshall | graph | O(V³) | O(V²) | All-pairs shortest path via DP |
| A* | graph | O(E) heuristic-dependent | O(V) | Heuristic-guided pathfinding |

### Minimum Spanning Tree (2 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Kruskal's | graph | O(E log E) | O(V) | Edge-sorted greedy with Union-Find |
| Prim's | graph | O((V + E) log V) | O(V) | Vertex-growing greedy with priority queue |

### Tree (4 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Inorder/Preorder/Postorder | tree | O(n) | O(h) | Three traversal orders, recursive/iterative |
| BST Insert/Delete/Search | tree | O(h) avg O(log n) | O(h) | Binary search tree CRUD operations |
| AVL Rotation | tree | O(log n) | O(1) | Self-balancing via left/right rotations |
| Heap Operations | tree | O(log n) | O(1) | Insert/extract with heapify up/down |

### Linked List (3 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Reversal | linked-list | O(n) | O(1) | In-place pointer reversal |
| Cycle Detection (Floyd's) | linked-list | O(n) | O(1) | Slow/fast pointer technique |
| Merge Two Sorted Lists | linked-list | O(n + m) | O(1) | Two-pointer merge |

## 3. New Visualizer Types

### 3.1 GraphVisualizer

**Purpose:** Render nodes and edges with animated traversal highlighting.

**Visual design:**
- Nodes: circles (28px diameter) with value labels, positioned via force-directed layout
- Edges: lines between nodes with optional weight labels
- Directed edges: arrowheads at endpoints
- Node states: unvisited (muted), visiting (accent pulse), visited (success), current (accent solid)
- Edge states: untraversed (muted border), traversed (accent), in-path (success)
- Animated transitions: nodes glow when visited, edges draw progressively

**Data model extension:**
```typescript
interface GraphState extends BaseAlgorithmState {
  nodes: { id: string; value: number; x: number; y: number; state: NodeState }[];
  edges: { from: string; to: string; weight?: number; state: EdgeState }[];
  currentNode?: string;
  queue?: string[];      // for BFS
  stack?: string[];      // for DFS
  distances?: Record<string, number>;  // for shortest path
}

type NodeState = 'unvisited' | 'visiting' | 'visited' | 'current' | 'start' | 'end';
type EdgeState = 'default' | 'considering' | 'selected' | 'in-path' | 'rejected';
```

**Input controls:**
- Preset graph configurations (small, medium, dense, sparse)
- User can add/remove nodes and edges by clicking
- Weight editing for shortest path algorithms
- Start/end node selection for pathfinding

**Implementation notes:**
- Use SVG for rendering (better for line/arrow drawing than Canvas)
- Force-directed layout via simple spring simulation (no D3 dependency)
- Framer Motion for node/edge state transitions

### 3.2 TreeVisualizer

**Purpose:** Render hierarchical tree structures with traversal animation.

**Visual design:**
- Nodes: rounded rectangles with value labels
- Edges: curved lines connecting parent to children
- Layout: top-down hierarchical, auto-calculated positions based on tree depth/width
- Node states: unvisited, visiting (current in traversal), visited, highlighted (for BST search)
- Subtree highlighting for divide-and-conquer operations
- AVL: show balance factors, animate rotations with smooth pivot

**Data model extension:**
```typescript
interface TreeState extends BaseAlgorithmState {
  root: TreeNode | null;
  highlightedNodes: string[];
  visitedNodes: string[];
  currentNode?: string;
  rotationType?: 'left' | 'right' | 'left-right' | 'right-left';
}

interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  balanceFactor?: number;  // for AVL
  height?: number;
}
```

**Input controls:**
- Insert/delete value input
- Preset tree configurations
- Random BST generator with configurable size

### 3.3 LinkedListVisualizer

**Purpose:** Render a chain of nodes with pointer arrows.

**Visual design:**
- Nodes: horizontal chain of boxes, each showing value + next pointer arrow
- Pointer arrows: curved lines pointing to next node
- Special pointers: `head`, `tail`, `slow`, `fast` labeled above nodes
- Cycle visualization: arrow curves back from tail to a previous node
- Node states: default, current, slow-pointer, fast-pointer, reversed

**Data model extension:**
```typescript
interface LinkedListState extends BaseAlgorithmState {
  nodes: { id: string; value: number; next: string | null }[];
  headId: string;
  pointers: { name: string; nodeId: string; color: string }[];
  cycleTarget?: string;  // node ID where cycle points back
}
```

## 4. AlgorithmState Refactoring

Phase 1's `AlgorithmState` is array-specific. Phase 2 requires a **base state** with specialized extensions:

```typescript
// Base state shared by ALL algorithm types
interface BaseAlgorithmState {
  step: number;
  description: string;
  codeLine?: number;
}

// Array-based (sorting, searching) — backward compatible with Phase 1
interface ArrayAlgorithmState extends BaseAlgorithmState {
  data: number[];
  activeIndices: number[];
  swapped: boolean;
}

// Graph-based
interface GraphAlgorithmState extends BaseAlgorithmState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode?: string;
  distances?: Record<string, number>;
}

// Tree-based
interface TreeAlgorithmState extends BaseAlgorithmState {
  root: TreeNode | null;
  highlightedNodes: string[];
  currentNode?: string;
}

// Linked-list-based
interface LinkedListAlgorithmState extends BaseAlgorithmState {
  nodes: ListNode[];
  headId: string;
  pointers: PointerMarker[];
}

// Union type for the generator
type AlgorithmState =
  | ArrayAlgorithmState
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState;
```

The `visualizerType` field in `AlgorithmConfig` determines which state shape and visualizer component to use.

## 5. LeetCode Problems (curated per algorithm)

| Algorithm | Problems |
|-----------|----------|
| BFS | Binary Tree Level Order Traversal, Rotting Oranges, Word Ladder |
| DFS | Number of Islands, Clone Graph, Course Schedule |
| Dijkstra | Network Delay Time, Path with Minimum Effort, Cheapest Flights |
| Bellman-Ford | Cheapest Flights Within K Stops, Network Delay Time |
| Floyd-Warshall | Find the City, Shortest Path Visiting All Nodes |
| A* | Shortest Path in Binary Matrix, Sliding Puzzle |
| Kruskal's | Min Cost to Connect All Points, Connecting Cities With Minimum Cost |
| Prim's | Min Cost to Connect All Points |
| Tree Traversals | Binary Tree Inorder/Preorder/Postorder Traversal |
| BST Operations | Validate BST, Insert/Delete in BST, Search in BST |
| AVL | Balanced Binary Tree, Convert Sorted Array to BST |
| Linked List Reversal | Reverse Linked List, Reverse Linked List II |
| Cycle Detection | Linked List Cycle, Linked List Cycle II |
| Merge Sorted Lists | Merge Two Sorted Lists, Merge k Sorted Lists |

## 6. Category Definitions

```typescript
// Added to categories.ts
{ id: 'graph-traversal', name: 'Graph Traversal', section: 'advanced', icon: 'Network' },
{ id: 'shortest-path', name: 'Shortest Path', section: 'advanced', icon: 'Route' },
{ id: 'mst', name: 'Minimum Spanning Tree', section: 'advanced', icon: 'GitFork' },
{ id: 'tree', name: 'Tree', section: 'data-structures', icon: 'TreeDeciduous' },
{ id: 'linked-list', name: 'Linked List', section: 'data-structures', icon: 'Link' },
```

## 7. UI Changes from Phase 1

- No structural changes to AppShell, IconRail, or SlidePanel
- New visualizer components registered in the visualizer factory
- Graph input controls: node/edge editor panel (replaces simple array input)
- Tree input controls: insert/delete value input
- The VisualizerPanel component gains a factory pattern to render the correct visualizer based on `visualizerType`
