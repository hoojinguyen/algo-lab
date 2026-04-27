import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const bubbleSortGenerator = function* (arr: number[]): Generator<AlgorithmState> {
  const data = [...arr];
  const n = data.length;
  let codeLine = 1;

  yield {
    step: 0,
    description: 'Initial array state',
    activeIndices: [],
    swapped: false,
    data: [...data],
    codeLine: 1,
  };

  for (let i = 0; i < n; i++) {
    codeLine = 2;
    yield {
      step: 0,
      description: `Starting pass ${i + 1}`,
      activeIndices: [],
      swapped: false,
      data: [...data],
      codeLine,
    };

    for (let j = 0; j < n - i - 1; j++) {
      codeLine = 3;
      yield {
        step: 0,
        description: `Comparing elements at index ${j} and ${j + 1}`,
        activeIndices: [j, j + 1],
        swapped: false,
        data: [...data],
        codeLine,
      };

      codeLine = 4;
      if (data[j] > data[j + 1]) {
        yield {
          step: 0,
          description: `${data[j]} > ${data[j + 1]}, need to swap`,
          activeIndices: [j, j + 1],
          swapped: false,
          data: [...data],
          codeLine,
        };

        const temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;

        codeLine = 5;
        yield {
          step: 0,
          description: `Swapped elements`,
          activeIndices: [j, j + 1],
          swapped: true,
          data: [...data],
          codeLine,
        };
      } else {
        yield {
          step: 0,
          description: `${data[j]} <= ${data[j + 1]}, no swap needed`,
          activeIndices: [j, j + 1],
          swapped: false,
          data: [...data],
          codeLine,
        };
      }
    }
  }

  codeLine = 11;
  yield {
    step: 0,
    description: 'Array is completely sorted',
    activeIndices: [],
    swapped: false,
    data: [...data],
    codeLine,
  };
};

export const bubbleSortEntry: AlgorithmEntry = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  complexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
  },
  stable: true,
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  theory: `Bubble Sort works by making repeated passes through the array, comparing each pair of adjacent elements and swapping them if they are in the wrong order. After each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.

**Time Complexity:** O(n²) average and worst case — every element may need to be compared against every other element. However, with an early-exit optimization (a flag to detect if any swaps occurred in a pass), the best case drops to O(n) when the input is already sorted.

**Space Complexity:** O(1) — sorting happens in-place with no auxiliary data structures.

**Stability:** Stable — equal elements are never swapped past each other, preserving their original relative order.

**When to use:** Bubble Sort is rarely used in production due to its quadratic time complexity. It is useful for teaching, and its early-exit variant can be practical when data is known to be nearly sorted and the dataset is very small (< 10 elements). Its in-place nature makes it usable in extremely memory-constrained environments.

**Key Interview Insight:** The early-exit optimization transforms this from a naive algorithm into one that can detect a sorted array in O(n) time. Interviewers sometimes ask you to implement this optimized version.`,
  code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
  generator: bubbleSortGenerator,
  leetcode: [
    {
      title: 'Sort an Array',
      url: 'https://leetcode.com/problems/sort-an-array',
      difficulty: 'medium',
    },
    {
      title: 'Move Zeroes',
      url: 'https://leetcode.com/problems/move-zeroes',
      difficulty: 'easy',
    },
    {
      title: 'Sort Colors',
      url: 'https://leetcode.com/problems/sort-colors',
      difficulty: 'medium',
    },
  ],
};
