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
  *generator(initialArray: number[], target?: number): Generator<AlgorithmState> {
    const data = [...initialArray];

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

    for (let i = 0; i < data.length; i++) {
      yield {
        data,
        activeIndices: [i],
        description: `Checking index ${i}: ${data[i]} === ${target}?`,
        codeLine: 3,
        step: i + 1,
        swapped: false,
      };

      if (data[i] === target) {
        yield {
          data,
          activeIndices: [i],
          description: `Found ${target} at index ${i}!`,
          codeLine: 4,
          step: i + 2,
          swapped: true, // Use swapped to highlight success color
        };
        return;
      }
    }

    yield {
      data,
      activeIndices: [],
      description: `${target} not found in the array`,
      codeLine: 7,
      step: data.length + 1,
      swapped: false,
    };
  },
};
