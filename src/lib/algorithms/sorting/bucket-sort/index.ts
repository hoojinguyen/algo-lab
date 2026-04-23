import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';

export const bucketSortEntry: AlgorithmEntry = {
  id: 'bucket-sort',
  name: 'Bucket Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)' },
  theory: 'Bucket sort is mainly useful when input is uniformly distributed over a range.',
  code: '// Bucket Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Bucket Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
