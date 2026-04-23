import { AlgorithmEntry, AlgorithmState } from '@/lib/types';
export const linearSearchEntry: AlgorithmEntry = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['sequential'],
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  theory:
    'Linear search is the simplest search algorithm; it checks every element in the list until it finds the target.',
  code: '// Linear Search',
  leetcode: [],
  stable: true,
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    yield {
      data: [...initialArray],
      activeIndices: [0],
      description: 'Searching',
      codeLine: 1,
      step: 0,
      swapped: false,
    };
  },
};
