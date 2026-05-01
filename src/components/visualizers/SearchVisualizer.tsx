'use client';

import React, { useMemo } from 'react';
import { SearchAlgorithmState } from '@/lib/types';
import { motion } from 'framer-motion';

interface TreeNode {
  id: number;
  value: number;
  index: number;
  left: TreeNode | null;
  right: TreeNode | null;
  depth: number;
  x: number;
}

export function SearchVisualizer({ state }: { state: SearchAlgorithmState }) {
  const { data, low, high, mid, targetIndex, eliminatedIndices, path, found } = state;

  // Build a balanced BST from the sorted array for visualization
  const treeRoot = useMemo(() => {
    function buildTree(
      arr: number[],
      originalIndices: number[],
      depth: number = 0
    ): TreeNode | null {
      if (arr.length === 0) return null;
      const midIdx = Math.floor(arr.length / 2);
      const node: TreeNode = {
        id: originalIndices[midIdx],
        value: arr[midIdx],
        index: originalIndices[midIdx],
        depth,
        x: 0, // In a real implementation, we'd calculate x for proper spacing
        left: buildTree(arr.slice(0, midIdx), originalIndices.slice(0, midIdx), depth + 1),
        right: buildTree(arr.slice(midIdx + 1), originalIndices.slice(midIdx + 1), depth + 1),
      };
      return node;
    }
    const indices = data.map((_, i) => i);
    return buildTree(data, indices);
  }, [data]);

  // Helper to render tree nodes recursively
  const renderTree = (node: TreeNode | null) => {
    if (!node) return null;

    const isActive = node.index === mid;
    const isVisited = path.includes(node.index);
    const isTarget = node.index === targetIndex;
    const isEliminated = eliminatedIndices.includes(node.index);

    return (
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: isActive ? 1.2 : 1,
            opacity: isEliminated ? 0.3 : 1,
          }}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors duration-500 ${
            isActive
              ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
              : isTarget && found
                ? 'bg-success/20 border-success text-success'
                : isVisited
                  ? 'bg-bg-tertiary border-accent/40 text-text-primary'
                  : 'bg-bg-secondary border-border text-text-muted'
          }`}
        >
          {node.value}
        </motion.div>

        <div className="flex gap-4 mt-4">
          {node.left && (
            <div className="flex flex-col items-center">
              <div className="h-4 w-px bg-border mb-0" />
              {renderTree(node.left)}
            </div>
          )}
          {node.right && (
            <div className="flex flex-col items-center">
              <div className="h-4 w-px bg-border mb-0" />
              {renderTree(node.right)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-8 p-6 overflow-hidden">
      {/* Target Key Display */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-bold tracking-widest uppercase text-text-muted">
          Target Key
        </span>
        <motion.div
          key={state.targetValue}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 rounded-xl bg-bg-tertiary border border-accent/20 flex items-center justify-center text-xl font-bold text-accent shadow-sm shadow-accent/5"
        >
          {state.targetValue ?? '?'}
        </motion.div>
      </div>

      {/* Tree Visualization (Logical View) */}
      <div className="flex-1 w-full flex items-start justify-center overflow-auto custom-scrollbar pt-4">
        <div className="scale-90 origin-top">{renderTree(treeRoot)}</div>
      </div>

      {/* Array Visualization (Physical View) */}
      <div className="w-full max-w-4xl flex items-end justify-center gap-1.5 h-32 pt-8 border-t border-border/10">
        {data.map((val, idx) => {
          const isEliminated = eliminatedIndices.includes(idx);
          const isActive = idx === mid;
          const isTarget = idx === targetIndex;
          const isInRange = idx >= low && idx <= high;

          return (
            <motion.div
              key={idx}
              layout
              className="flex flex-col items-center gap-1.5"
              animate={{
                opacity: isEliminated ? 0.3 : 1,
                y: isEliminated ? 12 : 0,
              }}
            >
              <motion.div
                animate={{
                  height: isActive ? '80px' : '64px',
                  backgroundColor: isActive
                    ? 'var(--accent)'
                    : isTarget && found
                      ? 'rgba(var(--success-rgb), 0.2)'
                      : isInRange
                        ? 'var(--bg-tertiary)'
                        : 'var(--bg-secondary)',
                }}
                className={`w-10 flex items-center justify-center rounded-lg border transition-all duration-500 font-bold text-sm ${
                  isActive
                    ? 'text-white border-accent shadow-md shadow-accent/20 z-10'
                    : isTarget && found
                      ? 'text-success border-success'
                      : isInRange
                        ? 'text-text-primary border-border'
                        : 'text-text-muted border-transparent'
                }`}
              >
                {val}
              </motion.div>
              <div className="text-[9px] text-text-muted font-mono">{idx}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
