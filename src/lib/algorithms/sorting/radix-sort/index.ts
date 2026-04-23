import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const radixSortEntry: AlgorithmEntry = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['non-comparison'],
  complexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)' },
  stable: true,
  theory:
    'Radix sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits.',
  code: '// Radix Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Radix Sort (simplified state)',
      codeLine: 1,
      step: 0,
      swapped: false,
    };
    array.sort((a, b) => a - b);
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 2,
      step: 1,
      swapped: false,
    };
  },
};
