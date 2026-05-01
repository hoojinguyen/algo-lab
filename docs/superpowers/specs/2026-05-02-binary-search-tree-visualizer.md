# Binary Search Tree Visualizer Design

Implement a dual-view visualization for Binary Search that maps array-based searching to a logical Binary Search Tree (BST) structure, emphasizing search space elimination.

## 1. Overview
Searching algorithms in AlgoLab currently use a placeholder bar-chart visualizer. This design replaces that with a "Search-First" visualizer that uses a balanced tree to represent the decision logic of Binary Search.

## 2. Core Concepts
- **Elimination Zone**: Ruled-out search spaces (left or right half) visually recede via dimming and blurring.
- **Dual Representation**: The UI displays both the physical Array and the logical BST, connected by visual "mapping lines."
- **The Probe**: The `mid` element is highlighted as a "Probe" that compares its value against the Target.

## 3. Architecture & Components

### 3.1 Data Structures (`src/lib/types.ts`)
Add a specialized search state:
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

### 3.2 `BinarySearchVisualizer` Component
A new component that handles the dual rendering:
- **Tree View**: Renders a balanced BST using D3-style layout logic (centering the `mid` element of each range as a parent).
- **Array View**: Renders the linear array with "Click-to-Target" functionality.
- **SVG Layer**: Draws dynamic "mapping strings" between array items and tree nodes.

### 3.3 Algorithm Implementation (`src/lib/algorithms/searching/binary-search/index.ts`)
Refactor the `generator` to yield the new `SearchAlgorithmState`:
- Step 0: Waiting for target selection.
- Step 1+: Binary search loop, yielding state with updated `low`, `high`, `mid`, and `eliminatedIndices`.

## 4. Visual Design
- **Theme**: Deep Purple / Magenta accent (Search Identity).
- **Active Path**: The path from the tree root to the current `mid` node is highlighted with a glowing magenta line.
- **Elimination**: Elements outside `[low, high]` drop their opacity to 20% and shift downwards by 10px.

## 5. Interaction Model
1. **Selection**: User clicks any bar in the Array.
2. **Activation**: The target is highlighted, and the Playback Controls enable.
3. **Visualization**: Playback moves through the search steps, highlighting the BST traversal path.
4. **Completion**: If found, the Target node/bar pulses green. If not found, a "Not Found" state is shown.

## 6. Implementation Stages
1. **Types**: Update `SearchAlgorithmState`.
2. **Algorithm**: Fully implement `binarySearchGenerator`.
3. **Visualizer**: Build `SearchVisualizer` (Dual View).
4. **Integration**: Update `VisualizerPanel` and `LessonPage` to support search-specific inputs (target selection).
