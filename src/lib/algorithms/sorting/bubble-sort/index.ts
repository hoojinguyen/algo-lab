import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const bubbleSortGenerator = function* (arr: number[]): Generator<AlgorithmState> {
  const data = [...arr];
  const n = data.length;
  let codeLine = 1;
  
  yield { step: 0, description: "Initial array state", activeIndices: [], swapped: false, data: [...data], codeLine: 1 };
  
  for (let i = 0; i < n; i++) {
    codeLine = 2;
    yield { step: 0, description: `Starting pass ${i + 1}`, activeIndices: [], swapped: false, data: [...data], codeLine };
    
    for (let j = 0; j < n - i - 1; j++) {
      codeLine = 3;
      yield { step: 0, description: `Comparing elements at index ${j} and ${j + 1}`, activeIndices: [j, j + 1], swapped: false, data: [...data], codeLine };
      
      codeLine = 4;
      if (data[j] > data[j + 1]) {
        yield { step: 0, description: `${data[j]} > ${data[j + 1]}, need to swap`, activeIndices: [j, j + 1], swapped: false, data: [...data], codeLine };
        
        const temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
        
        codeLine = 5;
        yield { step: 0, description: `Swapped elements`, activeIndices: [j, j + 1], swapped: true, data: [...data], codeLine };
      } else {
        yield { step: 0, description: `${data[j]} <= ${data[j + 1]}, no swap needed`, activeIndices: [j, j + 1], swapped: false, data: [...data], codeLine };
      }
    }
  }
  
  codeLine = 11;
  yield { step: 0, description: "Array is completely sorted", activeIndices: [], swapped: false, data: [...data], codeLine };
};

export const bubbleSortEntry: AlgorithmEntry = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  complexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)'
  },
  stable: true,
  visualizerType: 'array',
  tags: ['comparison', 'in-place'],
  theory: `Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.`,
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
  leetcode: []
};
