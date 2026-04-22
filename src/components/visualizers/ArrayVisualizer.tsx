"use client";

import { motion } from 'framer-motion';
import { AlgorithmState } from '@/lib/types';

interface ArrayVisualizerProps {
  state: AlgorithmState;
}

export function ArrayVisualizer({ state }: ArrayVisualizerProps) {
  if (!state || !state.data) return null;

  const maxValue = Math.max(...state.data, 1);

  return (
    <div className="flex items-end justify-center h-64 gap-2 p-8">
      {state.data.map((value, index) => {
        const isActive = state.activeIndices.includes(index);
        const heightPercentage = (value / maxValue) * 100;
        
        return (
          <motion.div
            key={`${index}-${value}`} // Keys matter for layout animations, though here index might be better for swaps
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-12 rounded-t-sm flex items-end justify-center pb-2 ${
              isActive 
                ? state.swapped 
                  ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' 
                  : 'bg-electric shadow-[0_0_15px_rgba(62,106,225,0.8)]'
                : 'bg-cloud'
            }`}
            style={{ height: `${heightPercentage}%` }}
          >
            <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-carbon'}`}>
              {value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
