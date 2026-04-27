import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const countingSortEntry: AlgorithmEntry = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)' },
  stable: true,
  theory: `Counting Sort does not compare elements against each other. Instead, it counts how many times each value appears, then uses those counts to directly place each element into its correct output position.

**How it works:** Given an input of integers in the range [0, k], create a count array of size k+1. Increment count[value] for each element. Then compute a prefix sum over the count array so count[i] holds the number of elements ≤ i. Finally, iterate the input in reverse, placing each element at position count[element]-1 in the output and decrementing the count.

**Time Complexity:** O(n + k) — one pass to count (O(n)), one pass to prefix-sum (O(k)), one pass to reconstruct (O(n)).

**Space Complexity:** O(k) for the count array, plus O(n) for the output array.

**Stability:** Stable — iterating the input in reverse during reconstruction ensures that elements with equal values maintain their original relative order.

**Constraint:** Only works on non-negative integers within a known, bounded range. When k >> n (e.g., sorting 10 integers that could be anywhere from 0 to 1,000,000), counting sort wastes memory and time.

**Key Interview Insight:** Counting Sort is the sub-routine that makes Radix Sort work. Understanding why the reconstruction pass iterates in reverse (to maintain stability across digit passes) is a critical insight interviewers test. It also underpins the "bucket by frequency" pattern used in Top-K problems.`,
  code: `function countingSort(arr: number[]): number[] {
  const k = Math.max(...arr);
  const count = new Array(k + 1).fill(0);

  // Phase 1: Count occurrences
  for (const val of arr) {
    count[val]++;
  }

  // Phase 2: Prefix sum — count[i] = number of elements ≤ i
  for (let i = 1; i <= k; i++) {
    count[i] += count[i - 1];
  }

  // Phase 3: Reconstruct output (reverse for stability)
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }

  return output;
}`,
  leetcode: [
    {
      title: 'Sort Colors',
      url: 'https://leetcode.com/problems/sort-colors',
      difficulty: 'medium',
    },
    {
      title: 'Relative Sort Array',
      url: 'https://leetcode.com/problems/relative-sort-array',
      difficulty: 'easy',
    },
    {
      title: 'Maximum Gap',
      url: 'https://leetcode.com/problems/maximum-gap',
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
      description: 'Starting Counting Sort — Phase 1: Count occurrences',
      codeLine: 1,
      step: stepCounter++,
      swapped: false,
    };

    const k = Math.max(...array);
    const count = new Array(k + 1).fill(0);

    // Phase 1: Count
    for (let i = 0; i < n; i++) {
      count[array[i]]++;
      yield {
        data: [...array],
        activeIndices: [i],
        description: `Counted ${array[i]} — count[${array[i]}] is now ${count[array[i]]}`,
        codeLine: 5,
        step: stepCounter++,
        swapped: false,
      };
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Phase 2: Computing prefix sums to find output positions',
      codeLine: 9,
      step: stepCounter++,
      swapped: false,
    };

    // Phase 2: Prefix sum
    for (let i = 1; i <= k; i++) {
      count[i] += count[i - 1];
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: `Prefix sums computed — Phase 3: Placing elements in output positions`,
      codeLine: 14,
      step: stepCounter++,
      swapped: false,
    };

    // Phase 3: Reconstruct (reverse iteration for stability)
    const output = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      const val = array[i];
      const pos = count[val] - 1;
      output[pos] = val;
      count[val]--;

      yield {
        data: [...output],
        activeIndices: [pos],
        description: `Placed ${val} at output position ${pos}`,
        codeLine: 17,
        step: stepCounter++,
        swapped: false,
      };
    }

    yield {
      data: [...output],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 21,
      step: stepCounter,
      swapped: false,
    };
  },
};
