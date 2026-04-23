import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';
export const linearSearchEntry: AlgorithmEntry = {
  id: 'linear-search', name: 'Linear Search', category: 'searching', visualizerType: 'bars', tags: ['sequential'],
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  theory: 'A simple approach is to do a linear search, i.e., start from the leftmost element and one by one compare target.',
  code: '// Linear Search', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [0], description: 'Searching', codeLine: 1 }; }
};
