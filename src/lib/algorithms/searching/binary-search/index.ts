import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';
export const binarySearchEntry: AlgorithmEntry = {
  id: 'binary-search', name: 'Binary Search', category: 'searching', visualizerType: 'bars', tags: ['divide-and-conquer'],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  theory: 'Search a sorted array by repeatedly dividing the search interval in half.',
  code: '// Binary Search', leetcode: [{ id: 'binary-search', title: 'Binary Search', difficulty: 'Easy' }],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [Math.floor(initialArray.length/2)], description: 'Searching', codeLine: 1 }; }
};
