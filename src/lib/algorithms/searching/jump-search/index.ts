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
  *generator(initialArray: number[], target?: number): Generator<SearchAlgorithmState> {
    const data = [...initialArray].sort((a, b) => a - b);
    const n = data.length;
    const stepSize = Math.floor(Math.sqrt(n));

    yield {
      step: 0,
      description:
        target === undefined ? 'Select a target element to begin' : `Searching for ${target}`,
      data,
      targetValue: target ?? null,
      targetIndex: target !== undefined ? data.indexOf(target) : null,
      low: 0,
      high: n - 1,
      mid: null,
      found: false,
      eliminatedIndices: [],
      path: [],
      codeLine: 1,
    };

    if (target === undefined) return;

    let prev = 0;
    let step = stepSize;
    const path: number[] = [];
    const eliminatedIndices: number[] = [];

    // Jump Phase
    while (data[Math.min(step, n) - 1] < target) {
      const jumpIdx = Math.min(step, n) - 1;
      path.push(jumpIdx);

      yield {
        step: path.length,
        description: `Jumping to index ${jumpIdx}: ${data[jumpIdx]} < ${target}`,
        data,
        targetValue: target,
        targetIndex: data.indexOf(target),
        low: prev,
        high: n - 1,
        mid: jumpIdx,
        found: false,
        eliminatedIndices: [...eliminatedIndices],
        path: [...path],
        phase: 'jump',
        codeLine: 7,
      };

      // All elements in the skipped block are smaller than target
      for (let i = prev; i < jumpIdx; i++) {
        eliminatedIndices.push(i);
      }

      prev = step;
      step += stepSize;

      if (prev >= n) {
        yield {
          step: 99,
          description: 'Target exceeds array bounds',
          data,
          targetValue: target,
          targetIndex: -1,
          low: n,
          high: n - 1,
          mid: null,
          found: false,
          eliminatedIndices: data.map((_, i) => i),
          path: [...path],
          phase: 'jump',
          codeLine: 10,
        };
        return;
      }
    }

    // Identify the block
    const blockEnd = Math.min(step, n) - 1;
    yield {
      step: 10,
      description: `Target in block [${prev}, ${blockEnd}]. Starting linear search.`,
      data,
      targetValue: target,
      targetIndex: data.indexOf(target),
      low: prev,
      high: blockEnd,
      mid: null,
      found: false,
      eliminatedIndices: [...eliminatedIndices],
      path: [...path],
      phase: 'scan',
      codeLine: 14,
    };

    // Linear Search Phase within the block
    for (let i = prev; i <= blockEnd; i++) {
      path.push(i);
      yield {
        step: 11 + (i - prev),
        description: `Checking index ${i}: ${data[i]} === ${target}?`,
        data,
        targetValue: target,
        targetIndex: data.indexOf(target),
        low: prev,
        high: blockEnd,
        mid: i,
        found: false,
        eliminatedIndices: [...eliminatedIndices],
        path: [...path],
        phase: 'scan',
        codeLine: 14,
      };

      if (data[i] === target) {
        // Found! Eliminate everything else
        const finalEliminated = data.map((_, idx) => idx).filter((idx) => idx !== i);
        yield {
          step: 20,
          description: `Found ${target} at index ${i}!`,
          data,
          targetValue: target,
          targetIndex: i,
          low: i,
          high: i,
          mid: i,
          found: true,
          eliminatedIndices: finalEliminated,
          path: [...path],
          codeLine: 19,
        };
        return;
      }

      eliminatedIndices.push(i);
    }

    yield {
      step: 21,
      description: `${target} not found in the array`,
      data,
      targetValue: target,
      targetIndex: -1,
      low: n,
      high: n - 1,
      mid: null,
      found: false,
      eliminatedIndices: data.map((_, i) => i),
      path: [...path],
      phase: 'scan',
      codeLine: 20,
    };
  },
};
