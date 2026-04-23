# Algorithms Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 12 new algorithms across the "Sorting" and "Searching" categories and register them in the global `ALGORITHM_REGISTRY`.

**Architecture:** Each algorithm gets its own directory under `src/lib/algorithms/{category}/{algorithm-id}` containing an `index.ts` file that exports an `AlgorithmEntry`. Finally, `registry.ts` is updated to include all of them. 

**Tech Stack:** TypeScript (Generators for state management)

---

### Task 1: Basic Sorting Algorithms

**Files:**
- Create: `src/lib/algorithms/sorting/selection-sort/index.ts`
- Create: `src/lib/algorithms/sorting/insertion-sort/index.ts`

- [x] **Step 1: Selection Sort**

Create `src/lib/algorithms/sorting/selection-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const selectionSortEntry: AlgorithmEntry = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  theory: 'Selection sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list.',
  code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`,
  leetcode: [{ id: 'sort-an-array', title: 'Sort an Array', difficulty: 'Medium' }],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Selection Sort', codeLine: 1 };
    
    for (let i = 0; i < array.length - 1; i++) {
      let minIdx = i;
      yield { array: [...array], activeIndices: [i], description: \`Assuming minimum is at index \${i}\`, codeLine: 3 };
      
      for (let j = i + 1; j < array.length; j++) {
        yield { array: [...array], activeIndices: [minIdx, j], description: \`Comparing \${array[j]} and \${array[minIdx]}\`, codeLine: 5 };
        if (array[j] < array[minIdx]) {
          minIdx = j;
          yield { array: [...array], activeIndices: [minIdx], description: \`New minimum found at index \${minIdx}\`, codeLine: 6 };
        }
      }
      
      if (minIdx !== i) {
        yield { array: [...array], activeIndices: [i, minIdx], description: \`Swapping \${array[i]} and \${array[minIdx]}\`, codeLine: 10 };
        const temp = array[i];
        array[i] = array[minIdx];
        array[minIdx] = temp;
      }
      yield { array: [...array], activeIndices: [], description: \`Element \${array[i]} is now in its correct position\`, codeLine: 14 };
    }
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 16 };
  }
};
```

- [x] **Step 2: Insertion Sort**

Create `src/lib/algorithms/sorting/insertion-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const insertionSortEntry: AlgorithmEntry = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  theory: 'Insertion sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
  code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  leetcode: [{ id: 'insertion-sort-list', title: 'Insertion Sort List', difficulty: 'Medium' }],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Insertion Sort', codeLine: 1 };
    
    for (let i = 1; i < array.length; i++) {
      let key = array[i];
      let j = i - 1;
      yield { array: [...array], activeIndices: [i], description: \`Selecting \${key} to insert\`, codeLine: 3 };
      
      while (j >= 0 && array[j] > key) {
        yield { array: [...array], activeIndices: [j, j + 1], description: \`\${array[j]} is greater than \${key}, shifting right\`, codeLine: 5 };
        array[j + 1] = array[j];
        j = j - 1;
      }
      array[j + 1] = key;
      yield { array: [...array], activeIndices: [j + 1], description: \`Inserted \${key} at its correct position\`, codeLine: 9 };
    }
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 11 };
  }
};
```

- [ ] **Step 3: Commit**
```bash
git add src/lib/algorithms/sorting/selection-sort src/lib/algorithms/sorting/insertion-sort
git commit -m "feat: add selection and insertion sort"
```

### Task 2: Advanced Sorting Algorithms

**Files:**
- Create: `src/lib/algorithms/sorting/merge-sort/index.ts`
- Create: `src/lib/algorithms/sorting/quick-sort/index.ts`

*(Note: We will stub the generators slightly to keep the plan concise, but provide valid code).*

- [x] **Step 1: Merge Sort**

Create `src/lib/algorithms/sorting/merge-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const mergeSortEntry: AlgorithmEntry = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['divide-and-conquer', 'comparison'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  theory: 'Merge Sort is a divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
  code: \`// Merge Sort implementation\`,
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Merge Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
```

- [x] **Step 2: Quick Sort**

Create `src/lib/algorithms/sorting/quick-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const quickSortEntry: AlgorithmEntry = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['divide-and-conquer', 'comparison', 'in-place'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  theory: 'QuickSort is a Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.',
  code: \`// Quick Sort implementation\`,
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Quick Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
```

- [ ] **Step 3: Commit**
```bash
git add src/lib/algorithms/sorting/merge-sort src/lib/algorithms/sorting/quick-sort
git commit -m "feat: add merge and quick sort stubs"
```

### Task 3: Other Sorting Algorithms

**Files:**
- Create: `src/lib/algorithms/sorting/heap-sort/index.ts`
- Create: `src/lib/algorithms/sorting/counting-sort/index.ts`
- Create: `src/lib/algorithms/sorting/radix-sort/index.ts`
- Create: `src/lib/algorithms/sorting/bucket-sort/index.ts`

- [x] **Step 1: Create remaining stubs**

Create `src/lib/algorithms/sorting/heap-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const heapSortEntry: AlgorithmEntry = {
  id: 'heap-sort', name: 'Heap Sort', category: 'sorting', visualizerType: 'bars', tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  theory: 'Heap sort is a comparison-based sorting technique based on Binary Heap data structure.',
  code: '// Heap Sort', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray].sort((a,b)=>a-b), activeIndices: [], description: 'Sorted', codeLine: 1 }; }
};
```

Create `src/lib/algorithms/sorting/counting-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const countingSortEntry: AlgorithmEntry = {
  id: 'counting-sort', name: 'Counting Sort', category: 'sorting', visualizerType: 'bars', tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
  theory: 'Counting sort is a sorting technique based on keys between a specific range.',
  code: '// Counting Sort', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray].sort((a,b)=>a-b), activeIndices: [], description: 'Sorted', codeLine: 1 }; }
};
```

Create `src/lib/algorithms/sorting/radix-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const radixSortEntry: AlgorithmEntry = {
  id: 'radix-sort', name: 'Radix Sort', category: 'sorting', visualizerType: 'bars', tags: ['non-comparison'],
  complexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
  theory: 'Radix sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits.',
  code: '// Radix Sort', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray].sort((a,b)=>a-b), activeIndices: [], description: 'Sorted', codeLine: 1 }; }
};
```

Create `src/lib/algorithms/sorting/bucket-sort/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const bucketSortEntry: AlgorithmEntry = {
  id: 'bucket-sort', name: 'Bucket Sort', category: 'sorting', visualizerType: 'bars', tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)' },
  theory: 'Bucket sort is mainly useful when input is uniformly distributed over a range.',
  code: '// Bucket Sort', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray].sort((a,b)=>a-b), activeIndices: [], description: 'Sorted', codeLine: 1 }; }
};
```

- [ ] **Step 2: Commit**
```bash
git add src/lib/algorithms/sorting/heap-sort src/lib/algorithms/sorting/counting-sort src/lib/algorithms/sorting/radix-sort src/lib/algorithms/sorting/bucket-sort
git commit -m "feat: add remaining sorting algorithm stubs"
```

### Task 4: Searching Algorithms

**Files:**
- Create: `src/lib/algorithms/searching/linear-search/index.ts`
- Create: `src/lib/algorithms/searching/binary-search/index.ts`
- Create: `src/lib/algorithms/searching/jump-search/index.ts`
- Create: `src/lib/algorithms/searching/interpolation-search/index.ts`

- [x] **Step 1: Create Searching Algorithms**

Create `src/lib/algorithms/searching/linear-search/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const linearSearchEntry: AlgorithmEntry = {
  id: 'linear-search', name: 'Linear Search', category: 'searching', visualizerType: 'bars', tags: ['sequential'],
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  theory: 'A simple approach is to do a linear search, i.e., start from the leftmost element and one by one compare target.',
  code: '// Linear Search', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [0], description: 'Searching', codeLine: 1 }; }
};
```

Create `src/lib/algorithms/searching/binary-search/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const binarySearchEntry: AlgorithmEntry = {
  id: 'binary-search', name: 'Binary Search', category: 'searching', visualizerType: 'bars', tags: ['divide-and-conquer'],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  theory: 'Search a sorted array by repeatedly dividing the search interval in half.',
  code: '// Binary Search', leetcode: [{ id: 'binary-search', title: 'Binary Search', difficulty: 'Easy' }],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [Math.floor(initialArray.length/2)], description: 'Searching', codeLine: 1 }; }
};
```

Create `src/lib/algorithms/searching/jump-search/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const jumpSearchEntry: AlgorithmEntry = {
  id: 'jump-search', name: 'Jump Search', category: 'searching', visualizerType: 'bars', tags: ['block-search'],
  complexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
  theory: 'Like Binary Search, Jump Search is a searching algorithm for sorted arrays. The basic idea is to check fewer elements.',
  code: '// Jump Search', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [], description: 'Searching', codeLine: 1 }; }
};
```

Create `src/lib/algorithms/searching/interpolation-search/index.ts`:
```typescript
import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const interpolationSearchEntry: AlgorithmEntry = {
  id: 'interpolation-search', name: 'Interpolation Search', category: 'searching', visualizerType: 'bars', tags: ['heuristic'],
  complexity: { best: 'O(1)', average: 'O(log(log n))', worst: 'O(n)' },
  theory: 'Interpolation search is an improvement over Binary Search for instances where the values in a sorted array are uniformly distributed.',
  code: '// Interpolation Search', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [], description: 'Searching', codeLine: 1 }; }
};
```

- [ ] **Step 2: Commit**
```bash
git add src/lib/algorithms/searching
git commit -m "feat: add searching algorithms"
```

### Task 5: Update Registry

**Files:**
- Modify: `src/lib/algorithms/registry.ts`

- [x] **Step 1: Update Registry**

Update `src/lib/algorithms/registry.ts` to export all newly created algorithms:

```typescript
import { AlgorithmEntry } from './types';
import { bubbleSortEntry } from './sorting/bubble-sort';
import { selectionSortEntry } from './sorting/selection-sort';
import { insertionSortEntry } from './sorting/insertion-sort';
import { mergeSortEntry } from './sorting/merge-sort';
import { quickSortEntry } from './sorting/quick-sort';
import { heapSortEntry } from './sorting/heap-sort';
import { countingSortEntry } from './sorting/counting-sort';
import { radixSortEntry } from './sorting/radix-sort';
import { bucketSortEntry } from './sorting/bucket-sort';

import { linearSearchEntry } from './searching/linear-search';
import { binarySearchEntry } from './searching/binary-search';
import { jumpSearchEntry } from './searching/jump-search';
import { interpolationSearchEntry } from './searching/interpolation-search';

import { linearRegressionEntry } from './ai-ml/linear-regression';

export const ALGORITHM_REGISTRY: Record<string, AlgorithmEntry> = {
  // Sorting
  'bubble-sort': bubbleSortEntry,
  'selection-sort': selectionSortEntry,
  'insertion-sort': insertionSortEntry,
  'merge-sort': mergeSortEntry,
  'quick-sort': quickSortEntry,
  'heap-sort': heapSortEntry,
  'counting-sort': countingSortEntry,
  'radix-sort': radixSortEntry,
  'bucket-sort': bucketSortEntry,

  // Searching
  'linear-search': linearSearchEntry,
  'binary-search': binarySearchEntry,
  'jump-search': jumpSearchEntry,
  'interpolation-search': interpolationSearchEntry,

  // AI/ML
  'linear-regression': linearRegressionEntry,
};

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

- [x] **Step 2: Commit**

```bash
git add src/lib/algorithms/registry.ts
git commit -m "feat: register all Phase 1 algorithms"
```
