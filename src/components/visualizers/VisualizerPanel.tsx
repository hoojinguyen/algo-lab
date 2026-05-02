import {
  AlgorithmState,
  VisualizerType,
  ArrayAlgorithmState,
  GraphAlgorithmState,
  TreeAlgorithmState,
  LinkedListAlgorithmState,
  MatrixAlgorithmState,
  SearchAlgorithmState,
} from '@/lib/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { ScatterVisualizer } from './ScatterVisualizer';
import { SearchVisualizer } from './SearchVisualizer';
interface VisualizerPanelProps {
  type: VisualizerType;
  state: AlgorithmState;
  onSelect?: (value: number) => void;
}

export function VisualizerPanel({ type, state, onSelect }: VisualizerPanelProps) {
  switch (type) {
    case 'array':
      if ('low' in state && 'high' in state) {
        return <SearchVisualizer state={state as SearchAlgorithmState} onSelect={onSelect} />;
      }
      return <ArrayVisualizer state={state as ArrayAlgorithmState} />;
    case 'graph':
      return <GraphVisualizer state={state as GraphAlgorithmState} />;
    case 'tree':
      return <TreeVisualizer state={state as TreeAlgorithmState} />;
    case 'linked-list':
      return <LinkedListVisualizer state={state as LinkedListAlgorithmState} />;
    case 'matrix':
      return <MatrixVisualizer state={state as MatrixAlgorithmState} />;
    case 'scatter':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ScatterVisualizer state={state as any} />;
    default:
      return <div className="text-text-muted">Unsupported visualizer type: {type}</div>;
  }
}
