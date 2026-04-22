import { AlgorithmEntry } from '../types';
import { bubbleSortEntry } from './sorting/bubble-sort';
import { linearRegressionEntry } from './ai-ml/linear-regression';

export const ALGORITHM_REGISTRY: Record<string, AlgorithmEntry> = {
  'bubble-sort': bubbleSortEntry,
  'linear-regression': linearRegressionEntry
};

export const getAlgorithmsByCategory = (categoryId: string) => {
  return Object.values(ALGORITHM_REGISTRY).filter(algo => algo.category === categoryId);
};
