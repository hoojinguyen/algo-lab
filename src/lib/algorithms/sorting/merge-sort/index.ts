import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const mergeSortEntry: AlgorithmEntry = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['divide-and-conquer', 'comparison'],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  stable: true,
  theory: `Merge Sort uses the divide-and-conquer strategy: split the array in half recursively until each sub-array has one element (which is trivially sorted), then merge the sorted halves back together.

**Time Complexity:** O(n log n) for all cases — the array is always split into log n levels, and merging each level takes O(n) work. Unlike Quick Sort, Merge Sort's worst case is still O(n log n).

**Space Complexity:** O(n) — merging requires auxiliary space proportional to the array size.

**Stability:** Stable — during the merge step, when two elements are equal, the one from the left sub-array is always placed first, preserving relative order.

**When to use:** Merge Sort is the go-to algorithm when stability is required and extra memory is acceptable. It is the standard algorithm for sorting linked lists (where random access is expensive) and for external sorting (sorting data too large to fit in RAM, where data is read in sorted chunks from disk).

**Key Interview Insight:** The merge step is the core pattern. Problems involving "merge K sorted arrays/lists" or "count inversions in an array" all derive directly from the merge operation. Counting inversions is a classic Merge Sort variant where you count how many times an element from the right sub-array is smaller than an element from the left.`,
  code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
  leetcode: [
    {
      title: 'Merge Sorted Array',
      url: 'https://leetcode.com/problems/merge-sorted-array',
      difficulty: 'easy',
    },
    {
      title: 'Sort List',
      url: 'https://leetcode.com/problems/sort-list',
      difficulty: 'medium',
    },
    {
      title: 'Count of Smaller Numbers After Self',
      url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self',
      difficulty: 'hard',
    },
  ],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    let stepCounter = 0;

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Merge Sort — will recursively split and merge',
      codeLine: 1,
      step: stepCounter++,
      swapped: false,
    };

    // Bottom-up iterative merge sort for clean visualization
    const n = array.length;

    for (let width = 1; width < n; width *= 2) {
      for (let lo = 0; lo < n; lo += 2 * width) {
        const mid = Math.min(lo + width, n);
        const hi = Math.min(lo + 2 * width, n);

        if (mid >= hi) continue;

        const leftIndices = Array.from({ length: mid - lo }, (_, i) => lo + i);
        const rightIndices = Array.from({ length: hi - mid }, (_, i) => mid + i);

        yield {
          data: [...array],
          activeIndices: [...leftIndices, ...rightIndices],
          description: `Merging subarrays [${lo}..${mid - 1}] and [${mid}..${hi - 1}]`,
          codeLine: 9,
          step: stepCounter++,
          swapped: false,
        };

        const left = array.slice(lo, mid);
        const right = array.slice(mid, hi);
        let i = 0,
          j = 0,
          k = lo;

        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) {
            array[k] = left[i++];
          } else {
            array[k] = right[j++];
          }

          yield {
            data: [...array],
            activeIndices: [k],
            description: `Placed ${array[k]} at index ${k}`,
            codeLine: 13,
            step: stepCounter++,
            swapped: false,
          };
          k++;
        }

        while (i < left.length) {
          array[k] = left[i++];
          yield {
            data: [...array],
            activeIndices: [k],
            description: `Copied remaining left element ${array[k]} to index ${k}`,
            codeLine: 17,
            step: stepCounter++,
            swapped: false,
          };
          k++;
        }

        while (j < right.length) {
          array[k] = right[j++];
          yield {
            data: [...array],
            activeIndices: [k],
            description: `Copied remaining right element ${array[k]} to index ${k}`,
            codeLine: 17,
            step: stepCounter++,
            swapped: false,
          };
          k++;
        }
      }
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 6,
      step: stepCounter,
      swapped: false,
    };
  },
};
