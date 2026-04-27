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

**Key Interview Insight:** The heap data structure is used far more often than Heap Sort itself. A max-heap or min-heap solves "find the k largest/smallest elements" in O(n log k) time, which is far better than sorting in O(n log n) when k is much smaller than n. Knowing how siftDown works is the key to implementing a priority queue from scratch.`,
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

    // Inline iterative siftDown for generator compatibility
    const siftDownIter = function* (heapSize: number, root: number): Generator<AlgorithmState> {
      let current = root;

      while (true) {
        let largest = current;
        const left = 2 * current + 1;
        const right = 2 * current + 2;

        const candidates: number[] = [current];
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
          description: `Swapped ${array[largest]} ↔ ${array[current]} to maintain heap property`,
          codeLine: 25,
          step: stepCounter++,
          swapped: true,
        };

        current = largest;
      }
    };

    // Phase 1: Build max-heap (start from last internal node)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield {
        data: [...array],
        activeIndices: [i],
        description: `Heapifying subtree rooted at index ${i} (value ${array[i]})`,
        codeLine: 5,
        step: stepCounter++,
        swapped: false,
      };
      yield* siftDownIter(n, i);
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Max-Heap built — Phase 2: Extract elements one by one',
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

      yield* siftDownIter(i, 0);
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
