import { AlgorithmState } from '../types';

export function* mergeSortGenerator(initialArray: number[]): Generator<AlgorithmState, void, unknown> {
  const arr = [...initialArray];
  let step = 1;

  function* mergeSort(left: number, right: number): Generator<AlgorithmState, void, unknown> {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    yield* mergeSort(left, mid);
    yield* mergeSort(mid + 1, right);
    yield* merge(left, mid, right);
  }

  function* merge(left: number, mid: number, right: number): Generator<AlgorithmState, void, unknown> {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      yield {
        step: step++,
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        activeIndices: [left + i, mid + 1 + j],
        swapped: false,
        data: [...arr]
      };

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      
      yield {
        step: step++,
        description: `Placing ${arr[k]} into position`,
        activeIndices: [k],
        swapped: true,
        data: [...arr]
      };
      
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      yield {
        step: step++,
        description: `Placing remaining ${arr[k]} into position`,
        activeIndices: [k],
        swapped: true,
        data: [...arr]
      };
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      yield {
        step: step++,
        description: `Placing remaining ${arr[k]} into position`,
        activeIndices: [k],
        swapped: true,
        data: [...arr]
      };
      j++;
      k++;
    }
  }

  yield* mergeSort(0, arr.length - 1);
  
  yield {
    step: step,
    description: `Merge Sort complete!`,
    activeIndices: [],
    swapped: false,
    data: [...arr]
  };
}
