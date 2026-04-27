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

    // Iterative quick sort using an explicit stack to avoid deep generator recursion
    const stack: [number, number][] = [[0, array.length - 1]];

    while (stack.length > 0) {
      const [lo, hi] = stack.pop()!;
      if (lo >= hi) continue;

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
              description: `${array[j]} ≤ pivot — swapped indices ${i} and ${j}`,
              codeLine: 17,
              step: stepCounter++,
              swapped: true,
            };
          }
        }
      }

      // Place pivot in its final sorted position
      [array[i + 1], array[hi]] = [array[hi], array[i + 1]];
      const pivotIdx = i + 1;

      yield {
        data: [...array],
        activeIndices: [pivotIdx],
        description: `Pivot ${array[pivotIdx]} placed at its final position: index ${pivotIdx}`,
        codeLine: 22,
        step: stepCounter++,
        swapped: true,
      };

      // Push sub-arrays onto stack (right first so left is processed first)
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
