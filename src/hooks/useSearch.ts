'use client';

import { useMemo } from 'react';
import { ALGORITHM_REGISTRY } from '@/lib/algorithms/registry';
import { AlgorithmEntry } from '@/lib/types';

export function useSearch(query: string) {
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const allAlgorithms = Object.values(ALGORITHM_REGISTRY);

    return allAlgorithms.filter(
      (algo) =>
        algo.name.toLowerCase().includes(lowerQuery) ||
        algo.category.toLowerCase().includes(lowerQuery) ||
        algo.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, AlgorithmEntry[]> = {};
    results.forEach((algo) => {
      if (!groups[algo.category]) {
        groups[algo.category] = [];
      }
      groups[algo.category].push(algo);
    });
    return groups;
  }, [results]);

  return { results, groupedResults };
}
