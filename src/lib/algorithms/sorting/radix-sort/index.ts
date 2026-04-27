import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const radixSortEntry: AlgorithmEntry = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['non-comparison'],
  complexity: { best: 'O(n·k)', average: 'O(n·k)', worst: 'O(n·k)', space: 'O(n + k)' },
  stable: true,
  theory: `Radix Sort sorts integers digit by digit, from the least significant digit (ones) to the most significant digit (LSD Radix Sort). Each digit pass is performed using a stable sort (typically Counting Sort on the digits 0–9).

**How it works:** For each digit position (1s, 10s, 100s…), group all numbers by that digit using a stable counting sort. Because each pass is stable, a number that was correctly ordered by a previous digit stays in the right relative position among numbers that share the same current digit.

**Time Complexity:** O(n·k) where n is the number of elements and k is the number of digits in the maximum value. For 32-bit integers, k ≤ 10, making this effectively O(n) for fixed-size integers.

**Space Complexity:** O(n + b) where b is the base (10 for decimal). Needs a temporary output buffer of size n.

**Stability:** Stable — each digit-pass counting sort is stable. This is what makes LSD Radix Sort correct: stability across passes ensures that the ordering from earlier (less significant) digits is preserved when later (more significant) digits are equal.

**When to use:** Radix Sort outperforms O(n log n) algorithms for large collections of integers where k (digits) is small and fixed. It is used in database indexing, network packet sorting, and suffix array construction.

**Key Interview Insight:** The critical question is "why does iterating from least significant to most significant digit work?" The answer is stability — each pass preserves the order established by previous passes. If you processed most significant first (MSD), you'd need recursive buckets (Trie-style), which is much more complex.`,
  code: `function radixSort(arr: number[]): number[] {
  const max = Math.max(...arr);

  // Sort by each digit position, starting from ones
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }

  return arr;
}

function countingSortByDigit(arr: number[], exp: number): void {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  // Count occurrences of each digit
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Prefix sum
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Reconstruct (reverse for stability)
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`,
  leetcode: [
    {
      title: 'Maximum Gap',
      url: 'https://leetcode.com/problems/maximum-gap',
      difficulty: 'hard',
    },
    {
      title: 'Sort an Array',
      url: 'https://leetcode.com/problems/sort-an-array',
      difficulty: 'medium',
    },
    {
      title: 'Largest Number',
      url: 'https://leetcode.com/problems/largest-number',
      difficulty: 'medium',
    },
  ],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    const n = array.length;
    let stepCounter = 0;

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Radix Sort (LSD) — will sort digit by digit from ones place',
      codeLine: 1,
      step: stepCounter++,
      swapped: false,
    };

    const max = Math.max(...array);
    const digitNames = ['ones', 'tens', 'hundreds', 'thousands'];

    let digitIndex = 0;
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const digitName = digitNames[digitIndex] ?? `10^${digitIndex}s`;
      digitIndex++;

      yield {
        data: [...array],
        activeIndices: [],
        description: `Pass ${digitIndex}: Sorting by ${digitName} digit`,
        codeLine: 4,
        step: stepCounter++,
        swapped: false,
      };

      const output = new Array(n).fill(0);
      const count = new Array(10).fill(0);

      // Count by digit
      for (let i = 0; i < n; i++) {
        const digit = Math.floor(array[i] / exp) % 10;
        count[digit]++;
        yield {
          data: [...array],
          activeIndices: [i],
          description: `${array[i]} → ${digitName} digit is ${digit}`,
          codeLine: 16,
          step: stepCounter++,
          swapped: false,
        };
      }

      // Prefix sum
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }

      yield {
        data: [...array],
        activeIndices: [],
        description: `Prefix sums computed — placing elements by ${digitName} digit`,
        codeLine: 22,
        step: stepCounter++,
        swapped: false,
      };

      // Reconstruct (reverse for stability)
      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        const pos = count[digit] - 1;
        output[pos] = array[i];
        count[digit]--;

        yield {
          data: [...output],
          activeIndices: [pos],
          description: `Placed ${array[i]} (${digitName} digit: ${digit}) at position ${pos}`,
          codeLine: 27,
          step: stepCounter++,
          swapped: false,
        };
      }

      // Copy back
      for (let i = 0; i < n; i++) {
        array[i] = output[i];
      }

      yield {
        data: [...array],
        activeIndices: [],
        description: `After ${digitName} pass: array partially ordered by ${digitName}`,
        codeLine: 32,
        step: stepCounter++,
        swapped: false,
      };
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 7,
      step: stepCounter,
      swapped: false,
    };
  },
};
