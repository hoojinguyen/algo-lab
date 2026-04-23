import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const binarySearchEntry: AlgorithmEntry = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['divide-and-conquer'],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  theory: 'Search a sorted array by repeatedly dividing the search interval in half.',
  code: '// Binary Search',
  leetcode: [],
  stable: true,
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    yield {
      data: [...initialArray],
      activeIndices: [Math.floor(initialArray.length / 2)],
      description: 'Searching',
      codeLine: 1,
      step: 0,
      swapped: false,
    };
  },
};
