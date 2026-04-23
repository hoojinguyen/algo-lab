import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const jumpSearchEntry: AlgorithmEntry = {
  id: 'jump-search', name: 'Jump Search', category: 'searching', visualizerType: 'array', tags: ['block-search'],
  complexity: { best: 'O(sqrt(n))', average: 'O(sqrt(n))', worst: 'O(sqrt(n))', space: 'O(1)' },
  theory: 'Jump search works on sorted arrays. It checks fewer elements than linear search by jumping ahead by fixed steps.',
  code: '// Jump Search', leetcode: [],
  stable: true,
  *generator(initialArray: number[]): Generator<AlgorithmState> { yield { data: [...initialArray], activeIndices: [], description: 'Searching', codeLine: 1, step: 0, swapped: false }; }
};
