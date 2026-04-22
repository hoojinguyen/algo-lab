import { TreeAlgorithmState } from '@/lib/types';

export function TreeVisualizer({ state }: { state: TreeAlgorithmState }) {
  if (!state.root) return <div className="text-text-muted">Empty Tree</div>;

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="text-text-primary">
        Tree Visualization Placeholder. Root: {state.root.value}
      </div>
    </div>
  );
}
