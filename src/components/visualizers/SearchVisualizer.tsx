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
}

interface SearchVisualizerProps {
  state: SearchAlgorithmState;
  id?: string;
  onSelect?: (value: number) => void;
}

export function SearchVisualizer({ state, id, onSelect }: SearchVisualizerProps) {
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
        left: buildTree(arr.slice(0, midIdx), originalIndices.slice(0, midIdx), depth + 1),
        right: buildTree(arr.slice(midIdx + 1), originalIndices.slice(midIdx + 1), depth + 1),
      };
      return node;
    }
    const indices = data.map((_, i) => i);
    return buildTree(data, indices);
  }, [data]);

  // Flatten tree for easier rendering with absolute positions
  const flattenedNodes = useMemo(() => {
    const nodes: TreeNode[] = [];
    function traverse(node: TreeNode | null) {
      if (!node) return;
      nodes.push(node);
      traverse(node.left);
      traverse(node.right);
    }
    traverse(treeRoot);
    return nodes;
  }, [treeRoot]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-8 p-6 overflow-hidden select-none">
      {/* Header with Target Info */}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold tracking-widest uppercase text-text-muted">
            Target Key
          </span>
          <motion.div
            key={state.targetValue}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-14 h-14 rounded-xl border flex items-center justify-center text-xl font-bold shadow-sm transition-colors duration-500 ${
              found
                ? 'bg-success/10 border-success text-success shadow-success/10'
                : 'bg-bg-tertiary border-accent/20 text-accent shadow-accent/5'
            }`}
          >
            {state.targetValue ?? '?'}
          </motion.div>
        </div>

        {state.targetValue === null && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-accent font-medium animate-pulse"
          >
            ← Click any value to start searching
          </motion.div>
        )}
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 w-full max-w-4xl relative mt-4 flex flex-col items-center justify-center">
        {id === 'linear-search' ? (
          <div className="flex flex-col items-center gap-8 w-full">
            {/* Linear Progress / Scanner */}
            <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden relative border border-border/50">
              <motion.div
                initial={false}
                animate={{
                  width: `${((mid ?? 0) / (data.length - 1)) * 100}%`,
                }}
                className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              />
              {/* Scanner Line */}
              {mid !== null && (
                <motion.div
                  animate={{
                    left: `${(mid / (data.length - 1)) * 100}%`,
                  }}
                  className="absolute inset-y-0 w-1 bg-white z-10 shadow-[0_0_10px_white]"
                />
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
              {data.map((val, idx) => {
                const isActive = idx === mid;
                const isVisited = path.includes(idx);
                const isTarget = idx === targetIndex;
                const isEliminated = eliminatedIndices.includes(idx);

                return (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      opacity: isEliminated ? 0.3 : 1,
                    }}
                    className="relative cursor-pointer"
                    onClick={() => onSelect?.(val)}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${
                        isActive
                          ? 'bg-accent border-accent text-white shadow-xl shadow-accent/30 z-10'
                          : isTarget && found
                            ? 'bg-success border-success text-white shadow-xl shadow-success/30'
                            : isVisited
                              ? 'bg-bg-tertiary border-accent/40 text-text-primary'
                              : 'bg-bg-secondary border-border text-text-muted hover:border-accent/50'
                      }`}
                    >
                      <span className="text-lg font-bold">{val}</span>
                      <span className="text-[9px] opacity-60 font-mono">i={idx}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-marker"
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-accent font-bold text-xs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        SCANNING
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Render Connections first so they appear behind nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {flattenedNodes.map((node) => (
                <React.Fragment key={`lines-${node.id}`}>
                  {[node.left, node.right].map((child, i) => {
                    if (!child) return null;
                    const x1 = `${(node.index / (data.length - 1)) * 100}%`;
                    const y1 = node.depth * 70 + 20;
                    const x2 = `${(child.index / (data.length - 1)) * 100}%`;
                    const y2 = child.depth * 70 + 20;

                    const isPath = path.includes(node.index) && path.includes(child.index);
                    const isEliminated = eliminatedIndices.includes(child.index);

                    return (
                      <motion.line
                        key={`line-${node.id}-${child.id}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isPath ? 'var(--accent)' : 'var(--border)'}
                        strokeWidth={isPath ? 2 : 1}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: 1,
                          opacity: isEliminated ? 0.1 : isPath ? 0.8 : 0.3,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </svg>

            {/* Render Nodes */}
            {flattenedNodes.map((node) => {
              const isActive = node.index === mid;
              const isVisited = path.includes(node.index);
              const isTarget = node.index === targetIndex;
              const isEliminated = eliminatedIndices.includes(node.index);
              const xPos = (node.index / (data.length - 1)) * 100;
              const yPos = node.depth * 70;

              return (
                <motion.div
                  key={node.id}
                  initial={false}
                  animate={{
                    left: `${xPos}%`,
                    top: `${yPos}px`,
                    scale: isActive ? 1.15 : 1,
                    opacity: isEliminated ? 0.2 : 1,
                  }}
                  className="absolute -translate-x-1/2 cursor-pointer z-10"
                  onClick={() => onSelect?.(node.value)}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      isActive
                        ? 'bg-accent border-accent text-white shadow-lg shadow-accent/40'
                        : isTarget && found
                          ? 'bg-success border-success text-white shadow-lg shadow-success/40'
                          : isVisited
                            ? 'bg-bg-tertiary border-accent/40 text-text-primary'
                            : 'bg-bg-secondary border-border text-text-muted hover:border-accent/50'
                    }`}
                  >
                    {node.value}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>

      {/* Array Visualization (Physical View) */}
      <div className="w-full max-w-4xl flex items-end justify-between h-24 pt-4 border-t border-border/10">
        {data.map((val, idx) => {
          const isEliminated = eliminatedIndices.includes(idx);
          const isActive = idx === mid;
          const isTarget = idx === targetIndex;
          const isInRange = idx >= low && idx <= high;

          return (
            <motion.div
              key={idx}
              layout
              className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
              onClick={() => onSelect?.(val)}
              animate={{
                opacity: isEliminated ? 0.3 : 1,
                y: isEliminated ? 8 : 0,
              }}
            >
              <motion.div
                animate={{
                  height: isActive ? '60px' : '48px',
                  backgroundColor: isActive
                    ? 'var(--accent)'
                    : isTarget && found
                      ? 'var(--success)'
                      : isInRange
                        ? 'var(--bg-tertiary)'
                        : 'var(--bg-secondary)',
                }}
                className={`w-full max-w-[40px] flex items-center justify-center rounded-lg border transition-all duration-500 font-bold text-sm ${
                  isActive
                    ? 'text-white border-accent shadow-md shadow-accent/20 z-10'
                    : isTarget && found
                      ? 'text-white border-success'
                      : isInRange
                        ? 'text-text-primary border-border group-hover:border-accent/40'
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
