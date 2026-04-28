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

        let barStyles = 'bg-bg-tertiary/40 backdrop-blur-sm border border-border/50';

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
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted text-[10px] font-mono font-bold tracking-tighter">
              {value}
            </div>
            <div
              className={`w-full rounded-t-lg transition-all duration-300 ease-out relative overflow-hidden ${barStyles}`}
              style={{ height }}
            >
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
