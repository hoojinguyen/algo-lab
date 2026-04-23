'use client';

import React from 'react';
import { MatrixAlgorithmState } from '@/lib/types';
import { motion } from 'framer-motion';

interface MatrixVisualizerProps {
  state: MatrixAlgorithmState;
}

export const MatrixVisualizer: React.FC<MatrixVisualizerProps> = ({ state }) => {
  const getCellColor = (row: number, col: number) => {
    if (state.currentCell?.row === row && state.currentCell?.col === col) {
      return 'bg-blue-500 text-white';
    }

    const highlighted = state.highlightedCells?.find((h) => h.row === row && h.col === col);
    if (highlighted) {
      switch (highlighted.state) {
        case 'computing':
          return 'bg-yellow-400 text-black';
        case 'filled':
          return 'bg-gray-700 text-white';
        case 'optimal':
          return 'bg-green-500 text-white';
        case 'conflict':
          return 'bg-red-500 text-white';
        case 'current':
          return 'bg-blue-500 text-white';
        default:
          return 'bg-gray-800 text-gray-300';
      }
    }

    const isPath = state.pathCells?.some((p) => p.row === row && p.col === col);
    if (isPath) {
      return 'bg-green-600 text-white';
    }

    return 'bg-gray-800 text-gray-300';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 overflow-auto">
      <div className="relative">
        <table className="border-collapse">
          <thead>
            {state.colHeaders && (
              <tr>
                {state.rowHeaders && <th></th>}
                {state.colHeaders.map((header, i) => (
                  <th key={i} className="p-2 text-sm text-gray-400 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {state.matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {state.rowHeaders && (
                  <th className="p-2 text-sm text-gray-400 font-medium pr-4">
                    {state.rowHeaders[rowIndex]}
                  </th>
                )}
                {row.map((cellValue, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <motion.div
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`flex items-center justify-center w-12 h-12 rounded shadow-sm font-medium ${getCellColor(rowIndex, colIndex)}`}
                    >
                      {cellValue}
                    </motion.div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
