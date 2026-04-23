import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';

export const heapSortEntry: AlgorithmEntry = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  theory: 'Heap sort is a comparison-based sorting technique based on Binary Heap data structure.',
  code: '// Heap Sort',
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Heap Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
