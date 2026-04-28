'use client';

import { ArrayAlgorithmState } from '@/lib/types';
import { useMemo } from 'react';

export function ArrayVisualizer({ state }: { state: ArrayAlgorithmState }) {
  const maxValue = useMemo(() => Math.max(...state.data), [state.data]);

  return (
    <div className="flex items-end justify-center h-64 gap-2 px-8 w-full max-w-3xl">
      {state.data.map((value, idx) => {
        const isActive = state.activeIndices.includes(idx);
        const height = `${(value / maxValue) * 100}%`;

        let barStyles =
          'bg-bg-tertiary/80 dark:bg-bg-tertiary/40 backdrop-blur-md border border-border';

        if (isActive) {
          if (state.swapped) {
            barStyles = 'bg-success shadow-[0_0_15px_rgba(34,197,94,0.4)] border-success/50';
          } else {
            barStyles = 'bg-accent shadow-[0_0_15px_rgba(37,99,235,0.4)] border-accent/50';
          }
        }

        return (
          <div
            key={idx}
            className="flex flex-col items-center justify-end h-full flex-1 group relative"
          >
            <div
              className={`w-full rounded-t-lg transition-all duration-300 ease-out relative overflow-visible ${barStyles}`}
              style={{ height }}
            >
              {/* Value Label - Positioned relative to the bar top */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted text-[10px] font-mono font-bold tracking-tighter whitespace-nowrap">
                {value}
              </div>

              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 dark:from-white/10 to-transparent opacity-60" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 dark:from-black/20 to-transparent opacity-40" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
