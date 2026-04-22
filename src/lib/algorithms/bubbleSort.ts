import { AlgorithmState } from '../types';

export function* bubbleSortGenerator(initialArray: number[]): Generator<AlgorithmState, void, unknown> {
  const arr = [...initialArray];
  let step = 1;
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Yield comparison state
      yield {
        step: step++,
        description: `Comparing ${arr[j]} and ${arr[j+1]}`,
        activeIndices: [j, j+1],
        swapped: false,
        data: [...arr]
      };

      if (arr[j] > arr[j + 1]) {
        // Perform swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Yield swap state
        yield {
          step: step++,
          description: `Swapping ${arr[j]} and ${arr[j+1]}`,
          activeIndices: [j, j+1],
          swapped: true,
          data: [...arr]
        };
      }
    }
  }
}
