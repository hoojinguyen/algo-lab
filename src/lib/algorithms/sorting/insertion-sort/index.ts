import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const insertionSortEntry: AlgorithmEntry = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  stable: true,
  theory:
    'Insertion sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
  code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  leetcode: [
    {
      title: 'Insertion Sort List',
      url: 'https://leetcode.com/problems/insertion-sort-list',
      difficulty: 'medium',
    },
  ],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Insertion Sort',
      codeLine: 1,
      step: 0,
      swapped: false,
    };

    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;
      yield {
        data: [...array],
        activeIndices: [i],
        description: `Picking element ${key} to insert`,
        codeLine: 3,
        step: i,
        swapped: false,
      };

      while (j >= 0 && array[j] > key) {
        yield {
          data: [...array],
          activeIndices: [j, j + 1],
          description: `Shifting ${array[j]} to the right`,
          codeLine: 6,
          step: i,
          swapped: false,
        };
        array[j + 1] = array[j];
        j = j - 1;
      }
      array[j + 1] = key;
      yield {
        data: [...array],
        activeIndices: [j + 1],
        description: `Inserted ${key} at position ${j + 1}`,
        codeLine: 10,
        step: i,
        swapped: true,
      };
    }
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 12,
      step: array.length,
      swapped: false,
    };
  },
};
