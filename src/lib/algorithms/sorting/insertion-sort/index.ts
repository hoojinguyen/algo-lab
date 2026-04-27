import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const insertionSortEntry: AlgorithmEntry = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  stable: true,
  theory: `Imagine sorting a hand of playing cards. You pick up one card at a time from the table and slide it into the correct position among the cards already in your hand. That is exactly how Insertion Sort works — it builds a sorted sub-array one element at a time, shifting larger elements to the right to make room for the current element.

**Time Complexity:** O(n²) worst case (reverse-sorted input requires maximum shifting). O(n) best case — if the input is already sorted, each element is compared once and immediately placed, making a single O(n) pass.

**Space Complexity:** O(1) — in-place algorithm.

**Stability:** Stable — elements are only shifted past the current key if they are strictly greater, preserving the relative order of equal elements.

**Insertion Sort's defining strength:** It is adaptive. Its performance scales with how close the input is to being sorted. This makes it the algorithm of choice for small datasets (< 16–32 elements) and nearly sorted data.

**Real-world usage:** Python's Timsort and Java's Arrays.sort use Insertion Sort as a sub-routine for partitions smaller than a threshold (typically 32–64 elements). This is because for tiny arrays, the low overhead and cache-friendliness of Insertion Sort outperform the O(n log n) algorithms.

**Key Interview Insight:** The "shift and insert" pattern appears in problems involving maintaining a sorted window or inserting into a sorted position. Recognizing this pattern is key to solving linked-list sorting problems elegantly.`,
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
  leetcode: [
    {
      title: 'Insertion Sort List',
      url: 'https://leetcode.com/problems/insertion-sort-list',
      difficulty: 'medium',
    },
    {
      title: 'Relative Sort Array',
      url: 'https://leetcode.com/problems/relative-sort-array',
      difficulty: 'easy',
    },
    {
      title: 'K Closest Points to Origin',
      url: 'https://leetcode.com/problems/k-closest-points-to-origin',
      difficulty: 'medium',
    },
  ],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Insertion Sort',
      codeLine: 1,
      step: 0,
      swapped: false,
    };

    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;
      yield {
        data: [...array],
        activeIndices: [i],
        description: `Picking element ${key} to insert`,
        codeLine: 3,
        step: i,
        swapped: false,
      };

      while (j >= 0 && array[j] > key) {
        yield {
          data: [...array],
          activeIndices: [j, j + 1],
          description: `Shifting ${array[j]} to the right`,
          codeLine: 6,
          step: i,
          swapped: false,
        };
        array[j + 1] = array[j];
        j = j - 1;
      }
      array[j + 1] = key;
      yield {
        data: [...array],
        activeIndices: [j + 1],
        description: `Inserted ${key} at position ${j + 1}`,
        codeLine: 10,
        step: i,
        swapped: true,
      };
    }
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 12,
      step: array.length,
      swapped: false,
    };
  },
};
