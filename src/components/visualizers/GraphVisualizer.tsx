import { GraphAlgorithmState } from '@/lib/types';
import { motion } from 'framer-motion';

export function GraphVisualizer({ state }: { state: GraphAlgorithmState }) {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <svg className="w-full h-full overflow-visible">
        {state.edges.map((edge) => {
          const fromNode = state.nodes.find((n) => n.id === edge.from);
          const toNode = state.nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={edge.state === 'in-path' ? '#4ade80' : '#4b5563'}
              strokeWidth={2}
            />
          );
        })}
        {state.nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={14}
            fill={node.state === 'visited' ? '#4ade80' : '#1f2937'}
            stroke="#4b5563"
            strokeWidth={2}
          />
        ))}
      </svg>
    </div>
  );
}
