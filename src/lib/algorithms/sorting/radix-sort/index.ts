import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';

export const radixSortEntry: AlgorithmEntry = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['non-comparison'],
  complexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
  theory: 'Radix sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits.',
  code: '// Radix Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Radix Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
