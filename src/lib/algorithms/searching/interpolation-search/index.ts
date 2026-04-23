import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const interpolationSearchEntry: AlgorithmEntry = {
  id: 'interpolation-search',
  name: 'Interpolation Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['heuristic'],
  complexity: { best: 'O(1)', average: 'O(log(log n))', worst: 'O(n)', space: 'O(1)' },
  theory:
    'Interpolation search is an improvement over binary search for instances where the values in a sorted array are uniformly distributed.',
  code: '// Interpolation Search',
  leetcode: [],
  stable: true,
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    yield {
      data: [...initialArray],
      activeIndices: [],
      description: 'Searching',
      codeLine: 1,
      step: 0,
      swapped: false,
    };
  },
};
