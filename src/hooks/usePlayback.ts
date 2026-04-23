import { useState, useEffect, useCallback, useRef } from 'react';
import { AlgorithmState } from '../lib/types';

export function usePlayback(states: AlgorithmState[], initialSpeedMs = 500) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(initialSpeedMs);
  
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, states.length - 1));
  }, [states.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isPlaying && currentIndex < states.length - 1) {
      timeoutId = setTimeout(() => {
        next();
      }, speedMs);
    } else if (currentIndex >= states.length - 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, currentIndex, speedMs, states.length, next]);

  return {
    currentState: states[currentIndex] || null,
    currentIndex,
    totalSteps: states.length,
    isPlaying,
    setIsPlaying,
    next,
    prev,
    reset,
    setSpeedMs
  };
}
