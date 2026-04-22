"use client";

import { AlgorithmState } from '@/lib/types';
import { useMemo } from 'react';

export function ArrayVisualizer({ state }: { state: AlgorithmState }) {
  const maxValue = useMemo(() => Math.max(...state.data), [state.data]);

  return (
    <div className="flex items-end justify-center h-64 gap-2 px-8 w-full max-w-3xl">
      {state.data.map((value, idx) => {
        const isActive = state.activeIndices.includes(idx);
        const height = `${(value / maxValue) * 100}%`;
        
        let bgColor = 'bg-bg-tertiary border border-border';
        if (isActive) {
          bgColor = state.swapped ? 'bg-success' : 'bg-accent';
        }

        return (
          <div 
            key={idx} 
            className="flex flex-col items-center justify-end h-full flex-1 group"
          >
            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted text-xs font-mono">
              {value}
            </div>
            <div 
              className={`w-full rounded-t-sm transition-all duration-300 ease-out ${bgColor}`}
              style={{ height }}
            />
          </div>
        );
      })}
    </div>
  );
}
