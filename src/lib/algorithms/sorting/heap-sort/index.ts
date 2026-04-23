import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const heapSortEntry: AlgorithmEntry = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  stable: false,
  theory: 'Heap sort is a comparison-based sorting technique based on Binary Heap data structure.',
  code: '// Heap Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Heap Sort (simplified state)',
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
