import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';
export const jumpSearchEntry: AlgorithmEntry = {
  id: 'jump-search', name: 'Jump Search', category: 'searching', visualizerType: 'bars', tags: ['block-search'],
  complexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
  theory: 'Like Binary Search, Jump Search is a searching algorithm for sorted arrays. The basic idea is to check fewer elements.',
  code: '// Jump Search', leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { array: [...initialArray], activeIndices: [], description: 'Searching', codeLine: 1 }; }
};
