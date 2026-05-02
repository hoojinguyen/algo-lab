import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const linearSearchEntry: AlgorithmEntry = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['sequential'],
  complexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
  },
  theory: `Linear Search is the most straightforward searching algorithm. It works by sequentially checking each element of the list until a match is found or the whole list has been searched.

**Key Characteristics:** Linear Search scans elements one by one from left to right. Unlike Binary Search, it does **not require the data to be sorted**, making it versatile for any array.

**Efficiency Trade-offs:** While easy to implement, it is inefficient for large datasets compared to more advanced searching algorithms. It is best used for small, unsorted lists or when you only need to search the data once.

**Key Interview Insight:** Linear search is the only option for searching an unsorted array without additional data structures (like a Hash Map). If an interviewer asks to search an unsorted array in less than O(n) time, they are likely looking for you to suggest pre-processing the data into a more efficient structure first.`,
  code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Target found at index i
    }
  }
  return -1; // Target not found
}`,
  leetcode: [
    {
      title: 'Find Numbers with Even Number of Digits',
      url: 'https://leetcode.com/problems/find-numbers-with-even-number-of-digits/',
      difficulty: 'easy',
    },
  ],
  stable: true,
  *generator(initialArray: number[], target?: number): Generator<SearchAlgorithmState> {
    const data = [...initialArray];

    yield {
      step: 0,
      description:
        target === undefined ? 'Select a target element to begin' : `Searching for ${target}`,
      data,
      targetValue: target ?? null,
      targetIndex: target !== undefined ? data.indexOf(target) : null,
      low: 0,
      high: data.length - 1,
      mid: null,
      found: false,
      eliminatedIndices: [],
      path: [],
      codeLine: 1,
    };

    if (target === undefined) return;

    const path: number[] = [];
    const eliminatedIndices: number[] = [];

    for (let i = 0; i < data.length; i++) {
      path.push(i);
      yield {
        step: i * 2 + 1,
        description: `Checking index ${i}: ${data[i]} === ${target}?`,
        data,
        targetValue: target,
        targetIndex: data.indexOf(target),
        low: i,
        high: data.length - 1,
        mid: i,
        found: false,
        eliminatedIndices: [...eliminatedIndices],
        path: [...path],
        codeLine: 3,
      };

      if (data[i] === target) {
        yield {
          step: i * 2 + 2,
          description: `Found ${target} at index ${i}!`,
          data,
          targetValue: target,
          targetIndex: i,
          low: i,
          high: i,
          mid: i,
          found: true,
          eliminatedIndices: data.map((_, idx) => idx).filter((idx) => idx !== i),
          path: [...path],
          codeLine: 4,
        };
        return;
      }

      eliminatedIndices.push(i);
    }

    yield {
      step: data.length * 2 + 1,
      description: `${target} not found in the array`,
      data,
      targetValue: target,
      targetIndex: -1,
      low: data.length,
      high: data.length - 1,
      mid: null,
      found: false,
      eliminatedIndices: data.map((_, idx) => idx),
      path: [...path],
      codeLine: 7,
    };
  },
};
