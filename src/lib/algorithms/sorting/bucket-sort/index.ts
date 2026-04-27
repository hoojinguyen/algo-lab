import { AlgorithmEntry, AlgorithmState } from '@/lib/types';

export const bucketSortEntry: AlgorithmEntry = {
  id: 'bucket-sort',
  name: 'Bucket Sort',
  category: 'sorting',
  visualizerType: 'array',
  tags: ['non-comparison'],
  complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)', space: 'O(n)' },
  stable: true,
  theory: `Bucket Sort distributes elements into a fixed number of "buckets" based on their value range, sorts each bucket individually (usually with Insertion Sort since buckets are small), then concatenates the sorted buckets back into the array.

**How it works:** Given n elements in the range [min, max], create n buckets each covering an equal sub-range. Assign each element to a bucket using: bucketIndex = floor((value - min) / rangePerBucket). Sort each bucket with Insertion Sort, then concatenate all buckets in order.

**Time Complexity:** O(n + k) average when data is uniformly distributed — distributing is O(n), sorting all buckets totals O(n) expected (each bucket gets ~1 element), concatenation is O(n + k). Worst case O(n²) when all elements land in a single bucket (degenerates to Insertion Sort on the full array).

**Space Complexity:** O(n) for the bucket arrays.

**Stability:** Stable — Insertion Sort (used within each bucket) is stable, and buckets are concatenated in order.

**When to use:** Bucket Sort excels when input is uniformly distributed over a continuous range — for example, floating-point numbers in [0.0, 1.0), or exam scores normalized to [0, 100]. It is commonly used in computer graphics for sorting fragments by depth.

**Key Interview Insight:** The "bucket by value range" pattern shows up in clever O(n) solutions. The classic "Maximum Gap" problem uses the pigeonhole principle: if you put n numbers into n+1 buckets, at least one bucket must be empty, meaning the max gap must span at least one empty bucket — so you only need to check inter-bucket gaps, not intra-bucket comparisons.`,
  code: `function bucketSort(arr: number[]): number[] {
  const n = arr.length;
  if (n <= 1) return arr;

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min;
  const bucketCount = n;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  // Phase 1: Distribute elements into buckets
  for (const val of arr) {
    const idx = range === 0
      ? 0
      : Math.min(Math.floor(((val - min) / range) * bucketCount), bucketCount - 1);
    buckets[idx].push(val);
  }

  // Phase 2: Sort each bucket with Insertion Sort
  for (const bucket of buckets) {
    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i];
      let j = i - 1;
      while (j >= 0 && bucket[j] > key) {
        bucket[j + 1] = bucket[j--];
      }
      bucket[j + 1] = key;
    }
  }

  // Phase 3: Concatenate buckets
  return buckets.flat();
}`,
  leetcode: [
    {
      title: 'Top K Frequent Elements',
      url: 'https://leetcode.com/problems/top-k-frequent-elements',
      difficulty: 'medium',
    },
    {
      title: 'Sort Characters By Frequency',
      url: 'https://leetcode.com/problems/sort-characters-by-frequency',
      difficulty: 'medium',
    },
    {
      title: 'Maximum Gap',
      url: 'https://leetcode.com/problems/maximum-gap',
      difficulty: 'hard',
    },
  ],
  *generator(initialArray: number[]): Generator<AlgorithmState> {
    const array = [...initialArray];
    const n = array.length;
    let stepCounter = 0;

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Starting Bucket Sort — Phase 1: Distribute elements into buckets',
      codeLine: 1,
      step: stepCounter++,
      swapped: false,
    };

    if (n <= 1) {
      yield {
        data: [...array],
        activeIndices: [],
        description: 'Array has 0 or 1 element — already sorted!',
        codeLine: 2,
        step: stepCounter,
        swapped: false,
      };
      return;
    }

    const min = Math.min(...array);
    const max = Math.max(...array);
    const range = max - min;
    const bucketCount = n;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    // Phase 1: Distribute
    for (let i = 0; i < n; i++) {
      const val = array[i];
      const bucketIdx =
        range === 0
          ? 0
          : Math.min(Math.floor(((val - min) / range) * bucketCount), bucketCount - 1);
      buckets[bucketIdx].push(val);

      yield {
        data: [...array],
        activeIndices: [i],
        description: `Assigned ${val} to bucket ${bucketIdx} (range: ${(min + (bucketIdx * range) / bucketCount) | 0}–${(min + ((bucketIdx + 1) * range) / bucketCount) | 0})`,
        codeLine: 12,
        step: stepCounter++,
        swapped: false,
      };
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Phase 2: Sorting each non-empty bucket with Insertion Sort',
      codeLine: 19,
      step: stepCounter++,
      swapped: false,
    };

    // Phase 2: Sort each bucket (Insertion Sort) with yields
    for (let b = 0; b < bucketCount; b++) {
      const bucket = buckets[b];
      if (bucket.length <= 1) continue;

      for (let i = 1; i < bucket.length; i++) {
        const key = bucket[i];
        let j = i - 1;

        while (j >= 0 && bucket[j] > key) {
          bucket[j + 1] = bucket[j--];
        }
        bucket[j + 1] = key;
      }

      yield {
        data: [...array],
        activeIndices: [],
        description: `Sorted bucket ${b}: [${bucket.join(', ')}]`,
        codeLine: 21,
        step: stepCounter++,
        swapped: true,
      };
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Phase 3: Concatenating sorted buckets',
      codeLine: 29,
      step: stepCounter++,
      swapped: false,
    };

    // Phase 3: Concatenate and yield per element placed
    let writeIdx = 0;
    for (let b = 0; b < bucketCount; b++) {
      for (const val of buckets[b]) {
        array[writeIdx] = val;
        yield {
          data: [...array],
          activeIndices: [writeIdx],
          description: `Wrote ${val} from bucket ${b} to position ${writeIdx}`,
          codeLine: 30,
          step: stepCounter++,
          swapped: false,
        };
        writeIdx++;
      }
    }

    yield {
      data: [...array],
      activeIndices: [],
      description: 'Array is sorted!',
      codeLine: 31,
      step: stepCounter,
      swapped: false,
    };
  },
};
