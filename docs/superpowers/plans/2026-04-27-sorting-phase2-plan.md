# Sorting Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder generators for Merge Sort, Quick Sort, and Heap Sort with fully step-by-step animated implementations, rich theory, readable code strings, and 3 mechanics-based LeetCode problems each.

**Architecture:** Each algorithm is a self-contained `AlgorithmEntry` in `src/lib/algorithms/sorting/<name>/index.ts`. The `generator` function is a TypeScript generator (`function*`) that yields `ArrayAlgorithmState` objects (`{ data, activeIndices, description, codeLine, step, swapped }`). No new files are created. No tests required.

**Tech Stack:** TypeScript, Next.js. Commit directly to `main`.

---

### Task 1: Complete Merge Sort Entry

**Files:**
- Modify: `src/lib/algorithms/sorting/merge-sort/index.ts`

- [ ] **Step 1: Replace the entire file content**

  Replace the full contents of `src/lib/algorithms/sorting/merge-sort/index.ts` with:

  ```typescript
  import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

  export const mergeSortEntry: AlgorithmEntry = {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    visualizerType: 'array',
    tags: ['divide-and-conquer', 'comparison'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    theory: `Merge Sort uses the divide-and-conquer strategy: split the array in half recursively until each sub-array has one element (which is trivially sorted), then merge the sorted halves back together.

  **Time Complexity:** O(n log n) for all cases — the array is always split into log n levels, and merging each level takes O(n) work. Unlike Quick Sort, Merge Sort's worst case is still O(n log n).

  **Space Complexity:** O(n) — merging requires auxiliary space proportional to the array size.

  **Stability:** Stable — during the merge step, when two elements are equal, the one from the left sub-array is always placed first, preserving relative order.

  **When to use:** Merge Sort is the go-to algorithm when stability is required and extra memory is acceptable. It is the standard algorithm for sorting linked lists (where random access is expensive) and for external sorting (sorting data too large to fit in RAM, where data is read in sorted chunks from disk).

  **Key Interview Insight:** The merge step is the core pattern. Problems involving "merge K sorted arrays/lists" or "count inversions in an array" all derive directly from the merge operation. Counting inversions is a classic Merge Sort variant where you count how many times an element from the right sub-array is smaller than an element from the left.`,
    code: `function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
  }

  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }`,
    leetcode: [
      {
        title: 'Merge Sorted Array',
        url: 'https://leetcode.com/problems/merge-sorted-array',
        difficulty: 'easy',
      },
      {
        title: 'Sort List',
        url: 'https://leetcode.com/problems/sort-list',
        difficulty: 'medium',
      },
      {
        title: 'Count of Smaller Numbers After Self',
        url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self',
        difficulty: 'hard',
      },
    ],
    *generator(initialArray: number[]): Generator<AlgorithmState> {
      const array = [...initialArray];
      let stepCounter = 0;

      yield {
        data: [...array],
        activeIndices: [],
        description: 'Starting Merge Sort — will recursively split and merge',
        codeLine: 1,
        step: stepCounter++,
        swapped: false,
      };

      // Iterative bottom-up merge sort for clean visualization
      const n = array.length;

      for (let width = 1; width < n; width *= 2) {
        for (let lo = 0; lo < n; lo += 2 * width) {
          const mid = Math.min(lo + width, n);
          const hi = Math.min(lo + 2 * width, n);

          if (mid >= hi) continue;

          // Highlight the two halves being merged
          const leftIndices = Array.from({ length: mid - lo }, (_, i) => lo + i);
          const rightIndices = Array.from({ length: hi - mid }, (_, i) => mid + i);

          yield {
            data: [...array],
            activeIndices: [...leftIndices, ...rightIndices],
            description: `Merging subarrays [${lo}..${mid - 1}] and [${mid}..${hi - 1}]`,
            codeLine: 9,
            step: stepCounter++,
            swapped: false,
          };

          // Perform the merge
          const left = array.slice(lo, mid);
          const right = array.slice(mid, hi);
          let i = 0, j = 0, k = lo;

          while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
              array[k] = left[i++];
            } else {
              array[k] = right[j++];
            }

            yield {
              data: [...array],
              activeIndices: [k],
              description: `Placed ${array[k]} at index ${k}`,
              codeLine: 13,
              step: stepCounter++,
              swapped: false,
            };
            k++;
          }

          while (i < left.length) {
            array[k] = left[i++];
            yield {
              data: [...array],
              activeIndices: [k],
              description: `Copied remaining left element ${array[k]} to index ${k}`,
              codeLine: 17,
              step: stepCounter++,
              swapped: false,
            };
            k++;
          }

          while (j < right.length) {
            array[k] = right[j++];
            yield {
              data: [...array],
              activeIndices: [k],
              description: `Copied remaining right element ${array[k]} to index ${k}`,
              codeLine: 17,
              step: stepCounter++,
              swapped: false,
            };
            k++;
          }
        }
      }

      yield {
        data: [...array],
        activeIndices: [],
        description: 'Array is sorted!',
        codeLine: 6,
        step: stepCounter,
        swapped: false,
      };
    },
  };
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/lib/algorithms/sorting/merge-sort/index.ts
  git commit -m "feat(sorting): implement merge sort generator, theory, and leetcode problems"
  ```

---

### Task 2: Complete Quick Sort Entry

**Files:**
- Modify: `src/lib/algorithms/sorting/quick-sort/index.ts`

- [ ] **Step 1: Replace the entire file content**

  Replace the full contents of `src/lib/algorithms/sorting/quick-sort/index.ts` with:

  ```typescript
  import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

  export const quickSortEntry: AlgorithmEntry = {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    visualizerType: 'array',
    tags: ['divide-and-conquer', 'comparison', 'in-place'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    stable: false,
    theory: `Quick Sort picks a pivot element and partitions the array into two sub-arrays: elements less than the pivot, and elements greater than the pivot. It then recursively sorts each sub-array.

  **Time Complexity:** O(n log n) average — the pivot splits the array roughly in half each time. O(n²) worst case — occurs when the pivot is always the smallest or largest element (e.g., on an already-sorted array with a naive last-element pivot). Randomizing the pivot or using the median-of-three strategy eliminates this in practice.

  **Space Complexity:** O(log n) — the recursion stack depth is proportional to the number of partitioning levels.

  **Stability:** Unstable — elements equal to the pivot may be reordered relative to each other during partitioning.

  **When to use:** Quick Sort is the fastest general-purpose sorting algorithm in practice for in-memory sorting. Its cache performance is excellent because it accesses data sequentially. The standard library sort in V8 (JavaScript engine) uses Timsort, but many C++ implementations use Introsort (Quick Sort + Heap Sort fallback).

  **Key Interview Insight:** The partition step is the foundation of Quickselect — an O(n) average algorithm for finding the k-th smallest/largest element. This is the optimal approach for "Kth Largest Element in an Array" problems. Understanding this pivot-placement mechanic is one of the most high-value patterns in technical interviews.`,
    code: `function quickSort(arr: number[], lo = 0, hi = arr.length - 1): number[] {
    if (lo < hi) {
      const pivotIdx = partition(arr, lo, hi);
      quickSort(arr, lo, pivotIdx - 1);
      quickSort(arr, pivotIdx + 1, hi);
    }
    return arr;
  }

  // Lomuto partition scheme — pivot is the last element
  function partition(arr: number[], lo: number, hi: number): number {
    const pivot = arr[hi];
    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    return i + 1;
  }`,
    leetcode: [
      {
        title: 'Sort an Array',
        url: 'https://leetcode.com/problems/sort-an-array',
        difficulty: 'medium',
      },
      {
        title: 'Kth Largest Element in an Array',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array',
        difficulty: 'medium',
      },
      {
        title: 'Partition Array Around Pivot',
        url: 'https://leetcode.com/problems/partition-array-around-pivot',
        difficulty: 'medium',
      },
    ],
    *generator(initialArray: number[]): Generator<AlgorithmState> {
      const array = [...initialArray];
      let stepCounter = 0;

      yield {
        data: [...array],
        activeIndices: [],
        description: 'Starting Quick Sort — will partition around a pivot element',
        codeLine: 1,
        step: stepCounter++,
        swapped: false,
      };

      function* partition(
        lo: number,
        hi: number,
      ): Generator<AlgorithmState> {
        const pivotValue = array[hi];

        yield {
          data: [...array],
          activeIndices: [hi],
          description: `Selected pivot: ${pivotValue} at index ${hi}`,
          codeLine: 11,
          step: stepCounter++,
          swapped: false,
        };

        let i = lo - 1;

        for (let j = lo; j < hi; j++) {
          yield {
            data: [...array],
            activeIndices: [j, hi],
            description: `Comparing ${array[j]} with pivot ${pivotValue}`,
            codeLine: 15,
            step: stepCounter++,
            swapped: false,
          };

          if (array[j] <= pivotValue) {
            i++;
            if (i !== j) {
              [array[i], array[j]] = [array[j], array[i]];
              yield {
                data: [...array],
                activeIndices: [i, j],
                description: `${array[j]} ≤ pivot, swapped indices ${i} and ${j}`,
                codeLine: 17,
                step: stepCounter++,
                swapped: true,
              };
            }
          }
        }

        // Place pivot in final position
        [array[i + 1], array[hi]] = [array[hi], array[i + 1]];
        yield {
          data: [...array],
          activeIndices: [i + 1],
          description: `Pivot ${pivotValue} placed at its final position: index ${i + 1}`,
          codeLine: 22,
          step: stepCounter++,
          swapped: true,
        };

        return i + 1;
      }

      // Iterative quick sort using an explicit stack to avoid deep recursion in generator
      const stack: [number, number][] = [[0, array.length - 1]];

      while (stack.length > 0) {
        const [lo, hi] = stack.pop()!;
        if (lo >= hi) continue;

        const partitionGen = partition(lo, hi);
        let result = partitionGen.next();
        while (!result.done) {
          yield result.value as AlgorithmState;
          result = partitionGen.next();
        }
        const pivotIdx = result.value as number;

        stack.push([pivotIdx + 1, hi]);
        stack.push([lo, pivotIdx - 1]);
      }

      yield {
        data: [...array],
        activeIndices: [],
        description: 'Array is sorted!',
        codeLine: 6,
        step: stepCounter,
        swapped: false,
      };
    },
  };
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/lib/algorithms/sorting/quick-sort/index.ts
  git commit -m "feat(sorting): implement quick sort generator, theory, and leetcode problems"
  ```

---

### Task 3: Complete Heap Sort Entry

**Files:**
- Modify: `src/lib/algorithms/sorting/heap-sort/index.ts`

- [ ] **Step 1: Replace the entire file content**

  Replace the full contents of `src/lib/algorithms/sorting/heap-sort/index.ts` with:

  ```typescript
  import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

  export const heapSortEntry: AlgorithmEntry = {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    visualizerType: 'array',
    tags: ['comparison', 'in-place'],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)',
    },
    stable: false,
    theory: `Heap Sort works in two phases. First, it builds a max-heap from the input array — a complete binary tree where every parent is greater than its children. Second, it repeatedly extracts the maximum element (the root) by swapping it to the end of the array and restoring the heap property on the remaining elements.

  **Time Complexity:** O(n log n) for all cases — building the heap is O(n) and each of the n extractions requires O(log n) to restore the heap property. Unlike Quick Sort, there is no worst-case degradation.

  **Space Complexity:** O(1) — sorting is done entirely in-place by treating the array as a heap.

  **Stability:** Unstable — swapping the root with the last element can change the relative order of equal elements.

  **When to use:** Heap Sort is chosen when you need guaranteed O(n log n) performance and O(1) auxiliary space. It is less common in practice than Quick Sort (worse cache performance) or Merge Sort (unstable), but is critical in real-time systems with strict memory constraints. The Priority Queue data structure is a direct application of the heap.

  **Key Interview Insight:** The heap data structure is used far more often than Heap Sort itself. A max-heap or min-heap solves "find the k largest/smallest elements" in O(n log k) time, which is far better than sorting in O(n log n) when k << n. Knowing how siftDown works is the key to implementing a heap from scratch.`,
    code: `function heapSort(arr: number[]): number[] {
    const n = arr.length;

    // Phase 1: Build max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      siftDown(arr, n, i);
    }

    // Phase 2: Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]]; // Move current max to end
      siftDown(arr, i, 0);                  // Restore heap on reduced array
    }

    return arr;
  }

  function siftDown(arr: number[], heapSize: number, root: number): void {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < heapSize && arr[left] > arr[largest]) largest = left;
    if (right < heapSize && arr[right] > arr[largest]) largest = right;

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      siftDown(arr, heapSize, largest);
    }
  }`,
    leetcode: [
      {
        title: 'Last Stone Weight',
        url: 'https://leetcode.com/problems/last-stone-weight',
        difficulty: 'easy',
      },
      {
        title: 'Kth Largest Element in a Stream',
        url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream',
        difficulty: 'medium',
      },
      {
        title: 'Find Median from Data Stream',
        url: 'https://leetcode.com/problems/find-median-from-data-stream',
        difficulty: 'hard',
      },
    ],
    *generator(initialArray: number[]): Generator<AlgorithmState> {
      const array = [...initialArray];
      const n = array.length;
      let stepCounter = 0;

      yield {
        data: [...array],
        activeIndices: [],
        description: 'Starting Heap Sort — Phase 1: Build Max-Heap',
        codeLine: 1,
        step: stepCounter++,
        swapped: false,
      };

      // Inline siftDown generator for step-by-step visualization
      function* siftDownGen(
        heapSize: number,
        root: number,
      ): Generator<AlgorithmState> {
        let current = root;

        while (true) {
          let largest = current;
          const left = 2 * current + 1;
          const right = 2 * current + 2;

          const candidates = [current];
          if (left < heapSize) candidates.push(left);
          if (right < heapSize) candidates.push(right);

          yield {
            data: [...array],
            activeIndices: candidates,
            description: `Checking node at index ${current} (value ${array[current]}) against its children`,
            codeLine: 19,
            step: stepCounter++,
            swapped: false,
          };

          if (left < heapSize && array[left] > array[largest]) largest = left;
          if (right < heapSize && array[right] > array[largest]) largest = right;

          if (largest === current) break;

          [array[current], array[largest]] = [array[largest], array[current]];

          yield {
            data: [...array],
            activeIndices: [current, largest],
            description: `Swapped ${array[largest]} and ${array[current]} to restore heap property`,
            codeLine: 25,
            step: stepCounter++,
            swapped: true,
          };

          current = largest;
        }
      }

      // Phase 1: Build max-heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield {
          data: [...array],
          activeIndices: [i],
          description: `Heapifying subtree rooted at index ${i}`,
          codeLine: 5,
          step: stepCounter++,
          swapped: false,
        };
        yield* siftDownGen(n, i);
      }

      yield {
        data: [...array],
        activeIndices: [],
        description: 'Max-Heap built — Phase 2: Extract elements',
        codeLine: 9,
        step: stepCounter++,
        swapped: false,
      };

      // Phase 2: Extract max elements
      for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];

        yield {
          data: [...array],
          activeIndices: [0, i],
          description: `Moved max element ${array[i]} to sorted position ${i}`,
          codeLine: 11,
          step: stepCounter++,
          swapped: true,
        };

        yield* siftDownGen(i, 0);
      }

      yield {
        data: [...array],
        activeIndices: [],
        description: 'Array is sorted!',
        codeLine: 13,
        step: stepCounter,
        swapped: false,
      };
    },
  };
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/lib/algorithms/sorting/heap-sort/index.ts
  git commit -m "feat(sorting): implement heap sort generator, theory, and leetcode problems"
  ```

---

### Task 4: Verify Build

- [ ] **Step 1: Run TypeScript type-check**

  ```bash
  yarn tsc --noEmit
  ```

  Expected: exits with code 0, no errors printed.

- [ ] **Step 2: Manual smoke test**

  Open `http://localhost:3000` and navigate to each of the three sorting pages (merge-sort, quick-sort, heap-sort). Verify:
  - Theory tab shows rich text content
  - LeetCode section shows 3 problems
  - Visualizer animates step-by-step (not a single jump to sorted)
