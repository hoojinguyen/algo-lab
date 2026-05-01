import { AlgorithmEntry, SearchAlgorithmState } from '@/lib/types';

export const binarySearchEntry: AlgorithmEntry = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['divide-and-conquer'],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  theory: 'Search a sorted array by repeatedly dividing the search interval in half.',
  code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
  leetcode: [],
  stable: true,
  *generator(initialArray: number[], target?: number): Generator<SearchAlgorithmState> {
    const data = [...initialArray].sort((a, b) => a - b);
    let low = 0;
    let high = data.length - 1;
    const path: number[] = [];
    const eliminatedIndices: number[] = [];

    // Step 0: Initial state (searching hasn't started or waiting for target)
    yield {
      step: 0,
      description:
        target === undefined ? 'Select a target element to begin' : `Searching for ${target}`,
      data,
      targetValue: target ?? null,
      targetIndex: target !== undefined ? data.indexOf(target) : null,
      low,
      high,
      mid: null,
      found: false,
      eliminatedIndices: [],
      path: [],
      codeLine: 1,
    };

    if (target === undefined) return;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      path.push(mid);

      // Step: Calculate Mid
      yield {
        step: path.length * 2 - 1,
        description: `Comparing target ${target} with mid element ${data[mid]}`,
        data,
        targetValue: target,
        targetIndex: data.indexOf(target),
        low,
        high,
        mid,
        found: false,
        eliminatedIndices: [...eliminatedIndices],
        path: [...path],
        codeLine: 6,
      };

      if (data[mid] === target) {
        yield {
          step: path.length * 2,
          description: `Found ${target} at index ${mid}!`,
          data,
          targetValue: target,
          targetIndex: mid,
          low: mid,
          high: mid,
          mid,
          found: true,
          eliminatedIndices: data.map((_, i) => i).filter((i) => i !== mid),
          path: [...path],
          codeLine: 7,
        };
        return;
      }

      if (data[mid] < target) {
        // Eliminate left side
        for (let i = low; i <= mid; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        low = mid + 1;
        yield {
          step: path.length * 2,
          description: `${data[mid]} < ${target}, searching right half`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 8,
        };
      } else {
        // Eliminate right side
        for (let i = mid; i <= high; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        high = mid - 1;
        yield {
          step: path.length * 2,
          description: `${data[mid]} > ${target}, searching left half`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 9,
        };
      }
    }

    yield {
      step: path.length * 2 + 1,
      description: `${target} not found in the array`,
      data,
      targetValue: target,
      targetIndex: -1,
      low,
      high,
      mid: null,
      found: false,
      eliminatedIndices: data.map((_, i) => i),
      path: [...path],
      codeLine: 11,
    };
  },
};
