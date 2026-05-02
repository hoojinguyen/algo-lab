import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const jumpSearchEntry: AlgorithmEntry = {
  id: 'jump-search',
  name: 'Jump Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['block-search'],
  complexity: {
    best: 'O(1)',
    average: 'O(sqrt(n))',
    worst: 'O(sqrt(n))',
    space: 'O(1)',
  },
  theory: `Jump Search is an efficiency improvement over Linear Search for **sorted arrays**. It works by jumping ahead by fixed steps (usually sqrt(n)) to find the block where the target value might exist, and then performing a Linear Search within that block.

**Key Logic:** Jump ahead in blocks of size m = sqrt(n). If the current block's last element is smaller than the target, jump to the next block. Once you find a block where the last element is greater than or equal to the target, perform a linear search backwards or forwards within that block.

**Efficiency:** Jump Search is faster than Linear Search because it skips many elements, but it is generally slower than Binary Search (O(log n)). It is useful when jumping back is costly, as it performs fewer "backward" moves than Binary Search in some data structures.

**Key Interview Insight:** The optimal jump size is sqrt(n). If we jump in blocks of size m, the number of jumps is n/m and the number of linear search steps is m-1. The total steps n/m + m-1 is minimized when m = sqrt(n).`,
  code: `function jumpSearch(arr, target) {
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;

  // Jump ahead in blocks
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }

  // Linear search in the identified block
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }

  if (arr[prev] === target) return prev;
  return -1;
}`,
  leetcode: [
    {
      title: 'Jump Search Implementation',
      url: 'https://www.geeksforgeeks.org/problems/jump-search/1',
      difficulty: 'easy',
    },
  ],
  stable: true,
  *generator(initialArray: number[], target?: number): Generator<AlgorithmState> {
    const data = [...initialArray].sort((a, b) => a - b);
    const n = data.length;
    const stepSize = Math.floor(Math.sqrt(n));

    yield {
      data,
      activeIndices: [],
      description:
        target === undefined ? 'Select a target element to begin' : `Searching for ${target}`,
      codeLine: 1,
      step: 0,
      swapped: false,
    };

    if (target === undefined) return;

    let prev = 0;
    let step = stepSize;

    // Jump Phase
    while (data[Math.min(step, n) - 1] < target) {
      yield {
        data,
        activeIndices: [Math.min(step, n) - 1],
        description: `Jumping to index ${Math.min(step, n) - 1}: ${data[Math.min(step, n) - 1]} < ${target}`,
        codeLine: 7,
        step: step / stepSize,
        swapped: false,
      };
      prev = step;
      step += stepSize;
      if (prev >= n) {
        yield {
          data,
          activeIndices: [],
          description: 'Target exceeds array bounds',
          codeLine: 10,
          step: 99,
          swapped: false,
        };
        return;
      }
    }

    // Linear Search Phase
    yield {
      data,
      activeIndices: Array.from({ length: Math.min(step, n) - prev }, (_, i) => prev + i),
      description: `Target in block [${prev}, ${Math.min(step, n) - 1}]. Starting linear search.`,
      codeLine: 14,
      step: 10,
      swapped: false,
    };

    for (let i = prev; i < Math.min(step, n); i++) {
      yield {
        data,
        activeIndices: [i],
        description: `Checking index ${i}: ${data[i]} === ${target}?`,
        codeLine: 14,
        step: 11 + (i - prev),
        swapped: false,
      };

      if (data[i] === target) {
        yield {
          data,
          activeIndices: [i],
          description: `Found ${target} at index ${i}!`,
          codeLine: 19,
          step: 20,
          swapped: true,
        };
        return;
      }
    }

    yield {
      data,
      activeIndices: [],
      description: `${target} not found`,
      codeLine: 20,
      step: 21,
      swapped: false,
    };
  },
};
