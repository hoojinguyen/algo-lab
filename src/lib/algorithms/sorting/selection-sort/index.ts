import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const selectionSortEntry: AlgorithmEntry = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  stable: false,
  theory: `Selection Sort divides the array into two conceptual regions: a sorted region on the left and an unsorted region on the right. On each pass, it scans the entire unsorted region to find the minimum element, then swaps it into the next position of the sorted region.

**Time Complexity:** O(n²) for best, average, and worst cases — the inner scan must always traverse the full unsorted region regardless of the data's initial order.

**Space Complexity:** O(1) — sorting is done in-place.

**Stability:** Unstable — the swap operation can change the relative order of equal elements. For example, in [5a, 5b, 1], the 1 swaps with 5a, moving 5b before 5a.

**Selection Sort's unique advantage:** It makes at most O(n) write operations (swaps). This is its defining trait. In systems where writing to memory is significantly more expensive than reading (e.g., flash memory or EEPROM), Selection Sort can outperform algorithms with better time complexity.

**When to use:** Prefer Selection Sort over Bubble Sort for memory-constrained hardware where minimizing writes matters. In most software contexts, it is outperformed by Insertion Sort for small arrays and O(n log n) algorithms for large ones.

**Key Interview Insight:** The "scan to find minimum and swap" pattern is the kernel of many problems. When a problem asks for "the k-th smallest/largest element" through repeated selection, that's Selection Sort logic.`,
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
  leetcode: [
    {
      title: 'Kth Largest Element in an Array',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array',
      difficulty: 'medium',
    },
    {
      title: 'Third Maximum Number',
      url: 'https://leetcode.com/problems/third-maximum-number',
      difficulty: 'easy',
    },
    {
      title: 'Minimum Operations to Make Array Equal',
      url: 'https://leetcode.com/problems/minimum-operations-to-make-array-equal',
      difficulty: 'medium',
    },
  ],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Selection Sort',
      codeLine: 1,
      step: 0,
      swapped: false,
    };

    for (let i = 0; i < array.length - 1; i++) {
      let minIdx = i;
      yield {
        data: [...array],
        activeIndices: [i],
        description: `Assuming minimum is at index ${i}`,
        codeLine: 3,
        step: i + 1,
        swapped: false,
      };

      for (let j = i + 1; j < array.length; j++) {
        yield {
          data: [...array],
          activeIndices: [minIdx, j],
          description: `Comparing ${array[j]} and ${array[minIdx]}`,
          codeLine: 5,
          step: i + 1,
          swapped: false,
        };
        if (array[j] < array[minIdx]) {
          minIdx = j;
          yield {
            data: [...array],
            activeIndices: [minIdx],
            description: `New minimum found at index ${minIdx}`,
            codeLine: 6,
            step: i + 1,
            swapped: false,
          };
        }
      }

      if (minIdx !== i) {
        yield {
          data: [...array],
          activeIndices: [i, minIdx],
          description: `Swapping ${array[i]} and ${array[minIdx]}`,
          codeLine: 10,
          step: i + 1,
          swapped: true,
        };
        const temp = array[i];
        array[i] = array[minIdx];
        array[minIdx] = temp;
      }
      yield {
        data: [...array],
        activeIndices: [],
        description: `Element ${array[i]} is now in its correct position`,
        codeLine: 14,
        step: i + 1,
        swapped: false,
      };
    }
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 16,
      step: array.length,
      swapped: false,
    };
  },
};
