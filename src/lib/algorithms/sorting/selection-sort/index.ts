import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const selectionSortEntry: AlgorithmEntry = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  stable: false,
  theory:
    'Selection sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list.',
  code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`,
  leetcode: [
    {
      title: 'Sort an Array',
      url: 'https://leetcode.com/problems/sort-an-array',
      difficulty: 'medium',
    },
  ],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Selection Sort',
      codeLine: 1,
      step: 0,
      swapped: false,
    };

    for (let i = 0; i < array.length - 1; i++) {
      let minIdx = i;
      yield {
        data: [...array],
        activeIndices: [i],
        description: `Assuming minimum is at index ${i}`,
        codeLine: 3,
        step: i + 1,
        swapped: false,
      };

      for (let j = i + 1; j < array.length; j++) {
        yield {
          data: [...array],
          activeIndices: [minIdx, j],
          description: `Comparing ${array[j]} and ${array[minIdx]}`,
          codeLine: 5,
          step: i + 1,
          swapped: false,
        };
        if (array[j] < array[minIdx]) {
          minIdx = j;
          yield {
            data: [...array],
            activeIndices: [minIdx],
            description: `New minimum found at index ${minIdx}`,
            codeLine: 6,
            step: i + 1,
            swapped: false,
          };
        }
      }

      if (minIdx !== i) {
        yield {
          data: [...array],
          activeIndices: [i, minIdx],
          description: `Swapping ${array[i]} and ${array[minIdx]}`,
          codeLine: 10,
          step: i + 1,
          swapped: true,
        };
        const temp = array[i];
        array[i] = array[minIdx];
        array[minIdx] = temp;
      }
      yield {
        data: [...array],
        activeIndices: [],
        description: `Element ${array[i]} is now in its correct position`,
        codeLine: 14,
        step: i + 1,
        swapped: false,
      };
    }
    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 16,
      step: array.length,
      swapped: false,
    };
  },
};
