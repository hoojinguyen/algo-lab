import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';
export const interpolationSearchEntry: AlgorithmEntry = {
  id: 'interpolation-search', name: 'Interpolation Search', category: 'searching', visualizerType: 'bars', tags: ['heuristic'],
  complexity: { best: 'O(1)', average: 'O(log(log n))', worst: 'O(n)' },
  theory: 'Interpolation search is an improvement over Binary Search for instances where the values in a sorted array are uniformly distributed.',
  code: '// Interpolation Search', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [], description: 'Searching', codeLine: 1 }; }
};
