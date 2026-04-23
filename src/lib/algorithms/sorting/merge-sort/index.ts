import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const mergeSortEntry: AlgorithmEntry = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['divide-and-conquer', 'comparison'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  stable: true,
  theory:
    'Merge Sort is a divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
  code: `// Merge Sort implementation`,
  leetcode: [],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Merge Sort (simplified state)',
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
