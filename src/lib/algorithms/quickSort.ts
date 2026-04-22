import { AlgorithmState } from '../types';

export function* quickSortGenerator(initialArray: number[]): Generator<AlgorithmState, void, unknown> {
  const arr = [...initialArray];
  let step = 1;

  function* quickSort(low: number, high: number): Generator<AlgorithmState, void, unknown> {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* quickSort(low, pi - 1);
      yield* quickSort(pi + 1, high);
    }
  }

  function* partition(low: number, high: number): Generator<AlgorithmState, number, unknown> {
    const pivot = arr[high];
    let i = low - 1;

    yield {
      step: step++,
      description: `Selecting pivot ${pivot}`,
      activeIndices: [high],
      swapped: false,
      data: [...arr]
    };

    for (let j = low; j < high; j++) {
      yield {
        step: step++,
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        activeIndices: [j, high],
        swapped: false,
        data: [...arr]
      };

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          yield {
            step: step++,
            description: `Swapping ${arr[i]} and ${arr[j]}`,
            activeIndices: [i, j],
            swapped: true,
            data: [...arr]
          };
        }
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    yield {
      step: step++,
      description: `Placing pivot ${arr[i + 1]} in its correct position`,
      activeIndices: [i + 1, high],
      swapped: true,
      data: [...arr]
    };

    return i + 1;
  }

  yield* quickSort(0, arr.length - 1);
  
  yield {
    step: step,
    description: `Quick Sort complete!`,
    activeIndices: [],
    swapped: false,
    data: [...arr]
  };
}
