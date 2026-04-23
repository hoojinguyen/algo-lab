import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const bucketSortEntry: AlgorithmEntry = {
  id: 'bucket-sort',
  name: 'Bucket Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)', space: 'O(n)' },
  stable: true,
  theory: 'Bucket sort is mainly useful when input is uniformly distributed over a range.',
  code: '// Bucket Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { data: [...array], activeIndices: [], description: 'Starting Bucket Sort (simplified state)', codeLine: 1, step: 0, swapped: false };
    array.sort((a, b) => a - b);
    yield { data: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2, step: 1, swapped: false };
  }
};
