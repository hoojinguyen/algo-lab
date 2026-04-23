import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';

export const countingSortEntry: AlgorithmEntry = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
  theory: 'Counting sort is a sorting technique based on keys between a specific range.',
  code: '// Counting Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Counting Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
