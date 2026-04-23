import { AlgorithmEntry, AlgorithmState } from '@/lib/algorithms/types';

export const insertionSortEntry: AlgorithmEntry = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  visualizerType: 'bars',
  tags: ['comparison', 'in-place'],
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  theory: 'Insertion sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
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
  leetcode: [{ id: 'insertion-sort-list', title: 'Insertion Sort List', difficulty: 'Medium' }],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    yield { array: [...array], activeIndices: [], description: 'Starting Insertion Sort', codeLine: 1 };
    
    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;
      yield { array: [...array], activeIndices: [i], description: `Selecting ${key} to insert`, codeLine: 3 };
      
      while (j >= 0 && array[j] > key) {
        yield { array: [...array], activeIndices: [j, j + 1], description: `${array[j]} is greater than ${key}, shifting right`, codeLine: 5 };
        array[j + 1] = array[j];
        j = j - 1;
      }
      array[j + 1] = key;
      yield { array: [...array], activeIndices: [j + 1], description: `Inserted ${key} at its correct position`, codeLine: 9 };
    }
    yield { array: [...array], activeIndices: [], description: 'Array is sorted!', codeLine: 11 };
  }
};
