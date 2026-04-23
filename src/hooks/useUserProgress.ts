'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/algorithms/categories';

export interface UserProgress {
  completedAlgorithms: string[];
  recentlyStudied: string[];
}

export function useUserProgress() {
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({
    completedAlgorithms: [],
    recentlyStudied: [],
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const stored = localStorage.getItem('algolab_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('algolab_progress', JSON.stringify(newProgress));
  };

  const markCompleted = (id: string) => {
    if (progress.completedAlgorithms.includes(id)) return;
    saveProgress({
      ...progress,
      completedAlgorithms: [...progress.completedAlgorithms, id],
    });
  };

  const addRecentlyStudied = (id: string) => {
    const filtered = progress.recentlyStudied.filter((item) => item !== id);
    saveProgress({
      ...progress,
      recentlyStudied: [id, ...filtered].slice(0, 5),
    });
  };

  // For Phase 1 we assume a total of 55 algorithms as per spec
  const totalAlgorithms = 55;
  const completionPercentage =
    Math.round((progress.completedAlgorithms.length / totalAlgorithms) * 100) || 0;

  const getSuggestedNext = () => {
    // Suggestion logic: return the first default algorithm of the first category
    // that hasn't been completed.
    for (const cat of CATEGORIES) {
      if (
        cat.defaultAlgorithmId &&
        !progress.completedAlgorithms.includes(cat.defaultAlgorithmId)
      ) {
        return {
          id: cat.defaultAlgorithmId,
          categoryId: cat.id,
          name: cat.name + ' Algorithm',
        };
      }
    }
    // Fallback if all are completed or no defaults exist
    return { id: 'bubble-sort', categoryId: 'sorting', name: 'Bubble Sort' };
  };

  return {
    isMounted,
    progress,
    markCompleted,
    addRecentlyStudied,
    getSuggestedNext,
    completionPercentage,
    totalAlgorithms,
  };
}
