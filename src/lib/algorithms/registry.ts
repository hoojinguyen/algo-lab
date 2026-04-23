import { AlgorithmEntry } from '../types';
import { bubbleSortEntry } from './sorting/bubble-sort';
import { selectionSortEntry } from './sorting/selection-sort';
import { insertionSortEntry } from './sorting/insertion-sort';
import { mergeSortEntry } from './sorting/merge-sort';
import { quickSortEntry } from './sorting/quick-sort';
import { heapSortEntry } from './sorting/heap-sort';
import { countingSortEntry } from './sorting/counting-sort';
import { radixSortEntry } from './sorting/radix-sort';
import { bucketSortEntry } from './sorting/bucket-sort';

import { linearSearchEntry } from './searching/linear-search';
import { binarySearchEntry } from './searching/binary-search';
import { jumpSearchEntry } from './searching/jump-search';
import { interpolationSearchEntry } from './searching/interpolation-search';

import { linearRegressionEntry } from './ai-ml/linear-regression';

export const ALGORITHM_REGISTRY: Record<string, AlgorithmEntry> = {
  // Sorting
  'bubble-sort': bubbleSortEntry,
  'selection-sort': selectionSortEntry,
  'insertion-sort': insertionSortEntry,
  'merge-sort': mergeSortEntry,
  'quick-sort': quickSortEntry,
  'heap-sort': heapSortEntry,
  'counting-sort': countingSortEntry,
  'radix-sort': radixSortEntry,
  'bucket-sort': bucketSortEntry,

  // Searching
  'linear-search': linearSearchEntry,
  'binary-search': binarySearchEntry,
  'jump-search': jumpSearchEntry,
  'interpolation-search': interpolationSearchEntry,

  // AI/ML
  'linear-regression': linearRegressionEntry
};

export const getAlgorithmsByCategory = (categoryId: string) => {
  return Object.values(ALGORITHM_REGISTRY).filter(algo => algo.category === categoryId);
};
