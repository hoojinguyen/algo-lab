import { AlgorithmEntry, SearchAlgorithmState } from '@/lib/types';
export const interpolationSearchEntry: AlgorithmEntry = {
  id: 'interpolation-search',
  name: 'Interpolation Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['heuristic'],
  complexity: {
    best: 'O(1)',
    average: 'O(log(log n))',
    worst: 'O(n)',
    space: 'O(1)',
  },
  theory: `Interpolation Search is an advanced variation of Binary Search, optimized for **uniformly distributed** sorted arrays. While Binary Search always checks the middle element, Interpolation Search estimates the target's position based on its value relative to the values at the range's bounds.

**The Probing Formula:** The "probe" position is calculated using: 'pos = low + [(target - arr[low]) * (high - low) / (arr[high] - arr[low])]'. This is similar to how we might look for a name in a phonebook near the beginning or end depending on the first letter.

**Efficiency vs Distribution:** If the gap between elements is roughly constant, this algorithm is exceptionally fast (O(log log n)). However, if data is heavily skewed (e.g., [1, 2, 4, 8, 16...]), performance can degrade to O(n), making it slower than standard Binary Search.

**Key Interview Insight:** Interpolation search can be O(log log n) on average for uniformly distributed data. This is significantly faster than Binary Search's O(log n) for extremely large datasets. However, mention its worst-case O(n) vulnerability when data follows a power-law or is highly clustered.`,
  code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }

    // Estimate position based on value distribution
    let pos = low + Math.floor(
      ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
    );

    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
  leetcode: [
    {
      title: 'Interpolation Search Implementation',
      url: 'https://www.geeksforgeeks.org/problems/interpolation-search/1',
      difficulty: 'medium',
    },
  ],
  stable: true,
  *generator(initialArray: number[], target?: number): Generator<SearchAlgorithmState> {
    const data = [...initialArray].sort((a, b) => a - b);
    let low = 0;
    let high = data.length - 1;
    const path: number[] = [];
    const eliminatedIndices: number[] = [];

    yield {
      step: 0,
      description:
        target === undefined ? 'Select a target element to begin' : `Searching for ${target}`,
      data,
      targetValue: target ?? null,
      targetIndex: target !== undefined ? data.indexOf(target) : null,
      low,
      high,
      mid: null,
      found: false,
      eliminatedIndices: [],
      path: [],
      codeLine: 1,
    };

    if (target === undefined) return;

    while (low <= high && target >= data[low] && target <= data[high]) {
      if (low === high) {
        if (data[low] === target) {
          path.push(low);
          yield {
            step: path.length,
            description: `Found ${target} at index ${low}!`,
            data,
            targetValue: target,
            targetIndex: low,
            low,
            high,
            mid: low,
            found: true,
            eliminatedIndices: data.map((_, i) => i).filter((i) => i !== low),
            path: [...path],
            codeLine: 16,
          };
          return;
        }
        break;
      }

      // Interpolation formula
      const pos =
        low + Math.floor(((target - data[low]) * (high - low)) / (data[high] - data[low]));

      path.push(pos);

      yield {
        step: path.length * 2 - 1,
        description: `Probing estimated position ${pos} for target ${target}`,
        data,
        targetValue: target,
        targetIndex: data.indexOf(target),
        low,
        high,
        mid: pos,
        found: false,
        eliminatedIndices: [...eliminatedIndices],
        path: [...path],
        codeLine: 12,
      };

      if (data[pos] === target) {
        yield {
          step: path.length * 2,
          description: `Found ${target} at index ${pos}!`,
          data,
          targetValue: target,
          targetIndex: pos,
          low: pos,
          high: pos,
          mid: pos,
          found: true,
          eliminatedIndices: data.map((_, i) => i).filter((i) => i !== pos),
          path: [...path],
          codeLine: 16,
        };
        return;
      }

      if (data[pos] < target) {
        for (let i = low; i <= pos; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        low = pos + 1;
        yield {
          step: path.length * 2,
          description: `Target is larger than probe, searching right`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid: pos,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 17,
        };
      } else {
        for (let i = pos; i <= high; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        high = pos - 1;
        yield {
          step: path.length * 2,
          description: `Target is smaller than probe, searching left`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid: pos,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 18,
        };
      }
    }

    yield {
      step: path.length + 1,
      description: `${target} not found in range`,
      data,
      targetValue: target,
      targetIndex: -1,
      low,
      high,
      mid: null,
      found: false,
      eliminatedIndices: data.map((_, i) => i),
      path: [...path],
      codeLine: 20,
    };
  },
};
