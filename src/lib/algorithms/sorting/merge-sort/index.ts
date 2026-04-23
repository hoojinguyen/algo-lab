import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';

export const mergeSortEntry: AlgorithmEntry = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['divide-and-conquer', 'comparison'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  theory: 'Merge Sort is a divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
  code: `// Merge Sort implementation`,
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Merge Sort (simplified state)', codeLine: 1 };
    array.sort((a, b) => a - b);
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 2 };
  }
};
