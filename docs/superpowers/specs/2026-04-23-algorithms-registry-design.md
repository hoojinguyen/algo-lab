# Phase 1 Algorithms & Registry — Design Spec

**Date:** 2026-04-23
**Status:** Pending Approval
**Scope:** Phase 1 Algorithms implementation and global registry system

## 1. Vision
To fully implement the Phase 1 algorithm catalog (13 algorithms total) defined in the main expansion spec, and establish a robust, file-based global registry system to manage them.

## 2. Global Registry Architecture

The registry acts as the single source of truth for the entire application, eliminating hardcoded algorithm lists.

### File Structure
```
src/lib/algorithms/
├── registry.ts              — Collects and exports all algorithms
├── categories.ts            — Category definitions (already created)
├── types.ts                 — Shared types (already created)
│
├── sorting/
│   ├── bubble-sort/         — (Already created)
│   ├── selection-sort/
│   │   ├── index.ts         — Entry point (combines config, theory, code, generator)
│   ├── insertion-sort/
│   ├── merge-sort/
│   ├── quick-sort/
│   ├── heap-sort/
│   ├── counting-sort/
│   ├── radix-sort/
│   └── bucket-sort/
│
└── searching/
    ├── linear-search/
    ├── binary-search/
    ├── jump-search/
    └── interpolation-search/
```

### `registry.ts` Implementation
```typescript
import { AlgorithmEntry } from './types';
import { bubbleSortEntry } from './sorting/bubble-sort';
import { selectionSortEntry } from './sorting/selection-sort';
// ... other imports

export const ALGORITHM_REGISTRY: Record<string, AlgorithmEntry> = {
  'bubble-sort': bubbleSortEntry,
  'selection-sort': selectionSortEntry,
  // ...
};

// Helper methods for UI consumption
export const getAlgorithmsByCategory = (categoryId: string): AlgorithmEntry[] => {
  return Object.values(ALGORITHM_REGISTRY).filter(algo => algo.category === categoryId);
};

export const getAlgorithmById = (id: string): AlgorithmEntry | undefined => {
  return ALGORITHM_REGISTRY[id];
};

export const getAllAlgorithms = (): AlgorithmEntry[] => {
  return Object.values(ALGORITHM_REGISTRY);
};
```

## 3. Algorithm Data Definitions

Each missing algorithm will have its own folder with an `index.ts` file exporting its `AlgorithmEntry`.

### Sorting Category
1. **Selection Sort**: `O(n²)` time, `O(1)` space. Not stable. Tags: `['comparison', 'in-place']`.
2. **Insertion Sort**: `O(n)` best, `O(n²)` worst time, `O(1)` space. Stable. Tags: `['comparison', 'in-place']`.
3. **Merge Sort**: `O(n log n)` time, `O(n)` space. Stable. Tags: `['divide-and-conquer', 'comparison']`.
4. **Quick Sort**: `O(n log n)` avg, `O(n²)` worst time, `O(log n)` space. Not stable. Tags: `['divide-and-conquer', 'comparison', 'in-place']`.
5. **Heap Sort**: `O(n log n)` time, `O(1)` space. Not stable. Tags: `['comparison', 'in-place']`.
6. **Counting Sort**: `O(n + k)` time, `O(n + k)` space. Stable. Tags: `['non-comparison']`.
7. **Radix Sort**: `O(nk)` time, `O(n + k)` space. Stable. Tags: `['non-comparison']`.
8. **Bucket Sort**: `O(n + k)` avg time, `O(n)` space. Stable. Tags: `['non-comparison']`.

### Searching Category
9. **Linear Search**: `O(n)` time, `O(1)` space. Tags: `['sequential']`.
10. **Binary Search**: `O(log n)` time, `O(1)` space. Requires sorted array. Tags: `['divide-and-conquer']`.
11. **Jump Search**: `O(√n)` time, `O(1)` space. Requires sorted array. Tags: `['block-search']`.
12. **Interpolation Search**: `O(log(log n))` avg time, `O(1)` space. Requires uniformly distributed sorted array. Tags: `['heuristic']`.

## 4. Generators and State

Each algorithm will require a custom TypeScript generator (`Generator<AlgorithmState>`). 
- **Sorting algorithms** will yield states describing comparisons, swaps, and active indices.
- **Searching algorithms** will yield states describing the search interval (left, right, mid bounds), comparisons, and the target found status.
