import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const countingSortEntry: AlgorithmEntry = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)' },
  stable: true,
  theory: 'Counting sort is a sorting technique based on keys between a specific range.',
  code: '// Counting Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Counting Sort (simplified state)',
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
