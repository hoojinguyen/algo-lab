export interface Category {
  id: string;
  name: string;
  section: SectionLabel;
  icon: string;
  description: string;
}

export interface AlgorithmConfig {
  id: string;
  name: string;
  category: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  stable: boolean;
  visualizerType: VisualizerType;
  tags: string[];
}

export interface LeetCodeProblem {
  title: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AlgorithmEntry extends AlgorithmConfig {
  theory: string;
  code: string;
  generator: (input: any) => Generator<AlgorithmState>;
  leetcode: LeetCodeProblem[];
}

export interface BaseAlgorithmState {
  step: number;
  description: string;
  codeLine?: number;
}

export interface ArrayAlgorithmState extends BaseAlgorithmState {
  data: number[];
  activeIndices: number[];
  swapped: boolean;
}

export interface GraphNode {
  id: string;
  value: number;
  x: number;
  y: number;
  state: 'unvisited' | 'visiting' | 'visited' | 'current' | 'start' | 'end';
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state: 'default' | 'considering' | 'selected' | 'in-path' | 'rejected';
}

export interface GraphAlgorithmState extends BaseAlgorithmState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode?: string;
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number>;
}

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  balanceFactor?: number;
  height?: number;
}

export interface TreeAlgorithmState extends BaseAlgorithmState {
  root: TreeNode | null;
  highlightedNodes: string[];
  visitedNodes: string[];
  currentNode?: string;
  rotationType?: 'left' | 'right' | 'left-right' | 'right-left';
}

export interface ListNode {
  id: string;
  value: number;
  next: string | null;
}

export interface PointerMarker {
  name: string;
  nodeId: string;
  color: string;
}

export interface LinkedListAlgorithmState extends BaseAlgorithmState {
  nodes: ListNode[];
  headId: string;
  pointers: PointerMarker[];
  cycleTarget?: string;
}

export type AlgorithmState =
  | ArrayAlgorithmState
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState;

export type VisualizerType = 'array' | 'graph' | 'tree' | 'matrix' | 'scatter' | 'linked-list';
export type SectionLabel = 'fundamentals' | 'advanced' | 'data-structures' | 'intelligence';
