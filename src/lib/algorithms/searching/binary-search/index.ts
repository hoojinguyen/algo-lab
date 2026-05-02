import { AlgorithmEntry, SearchAlgorithmState } from '@/lib/types';

export const binarySearchEntry: AlgorithmEntry = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  visualizerType: 'array',
  tags: ['divide-and-conquer'],
  complexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
  },
  theory: `Binary Search is a highly efficient algorithm for finding an item from a **sorted list** of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.

**How it Works:** Calculate the middle index of the current search range. Compare the middle element with the target value. If they are equal, the search is complete. If the target is smaller, repeat on the left half. If larger, repeat on the right half.

**The Logarithmic Advantage:** This "halving" process is what gives Binary Search its logarithmic time complexity, making it incredibly fast even for massive datasets (e.g., searching 1 billion items in just 30 comparisons).

**Key Interview Insight:** When calculating the middle index, use \`low + (high - low) / 2\` instead of \`(low + high) / 2\` to avoid potential integer overflow in languages with fixed-size integers (like Java or C++). While JavaScript handles this safely with large numbers, this is a classic interview question about robustness.`,
  code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    // Use Math.floor for integer division
    const mid = Math.floor(low + (high - low) / 2);
    const guess = arr[mid];

    if (guess === target) {
      return mid; // Found it!
    }

    if (guess > target) {
      high = mid - 1; // Target is in the left half
    } else {
      low = mid + 1; // Target is in the right half
    }
  }

  return -1; // Target not found
}`,
  leetcode: [
    {
      title: 'Binary Search',
      url: 'https://leetcode.com/problems/binary-search/',
      difficulty: 'easy',
    },
    {
      title: 'Search in Rotated Sorted Array',
      url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
      difficulty: 'medium',
    },
    {
      title: 'Find First and Last Position of Element',
      url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
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

    // Step 0: Initial state (searching hasn't started or waiting for target)
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

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      path.push(mid);

      // Step: Calculate Mid
      yield {
        step: path.length * 2 - 1,
        description: `Comparing target ${target} with mid element ${data[mid]}`,
        data,
        targetValue: target,
        targetIndex: data.indexOf(target),
        low,
        high,
        mid,
        found: false,
        eliminatedIndices: [...eliminatedIndices],
        path: [...path],
        codeLine: 7,
      };

      if (data[mid] === target) {
        yield {
          step: path.length * 2,
          description: `Found ${target} at index ${mid}!`,
          data,
          targetValue: target,
          targetIndex: mid,
          low: mid,
          high: mid,
          mid,
          found: true,
          eliminatedIndices: data.map((_, i) => i).filter((i) => i !== mid),
          path: [...path],
          codeLine: 11,
        };
        return;
      }

      if (data[mid] < target) {
        // Eliminate left side
        for (let i = low; i <= mid; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        low = mid + 1;
        yield {
          step: path.length * 2,
          description: `${data[mid]} < ${target}, searching right half`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 17,
        };
      } else {
        // Eliminate right side
        for (let i = mid; i <= high; i++) {
          if (!eliminatedIndices.includes(i)) eliminatedIndices.push(i);
        }
        high = mid - 1;
        yield {
          step: path.length * 2,
          description: `${data[mid]} > ${target}, searching left half`,
          data,
          targetValue: target,
          targetIndex: data.indexOf(target),
          low,
          high,
          mid,
          found: false,
          eliminatedIndices: [...eliminatedIndices],
          path: [...path],
          codeLine: 15,
        };
      }
    }

    yield {
      step: path.length * 2 + 1,
      description: `${target} not found in the array`,
      data,
      targetValue: target,
      targetIndex: -1,
      low,
      high,
      mid: null,
      found: false,
      eliminatedIndices: data.map((_, i) => i),
      path: [...path],
      codeLine: 21,
    };
  },
};
