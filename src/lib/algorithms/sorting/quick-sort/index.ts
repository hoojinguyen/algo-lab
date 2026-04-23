import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const quickSortEntry: AlgorithmEntry = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['divide-and-conquer', 'comparison', 'in-place'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
  stable: false,
  theory:
    'QuickSort is a Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.',
  code: `// Quick Sort implementation`,
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Quick Sort (simplified state)',
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
