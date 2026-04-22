import { LinkedListAlgorithmState } from '@/lib/types';
import { motion } from 'framer-motion';

export function LinkedListVisualizer({ state }: { state: LinkedListAlgorithmState }) {
  return (
    <div className="flex items-center justify-center h-full w-full gap-4 p-8 overflow-x-auto">
      {state.nodes.map((node) => (
        <div key={node.id} className="flex items-center gap-4">
          <motion.div 
            className="border border-border p-4 rounded bg-bg-secondary text-text-primary"
          >
            {node.value}
          </motion.div>
          {node.next && (
            <div className="text-text-muted font-bold">→</div>
          )}
        </div>
      ))}
    </div>
  );
}
