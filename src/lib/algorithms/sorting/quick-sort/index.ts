import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';

export const quickSortEntry: AlgorithmEntry = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['divide-and-conquer', 'comparison', 'in-place'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  theory: 'QuickSort is a Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.',
  code: `// Quick Sort implementation`,
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Quick Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
