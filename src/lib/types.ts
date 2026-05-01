export interface Category {
  id: string;
  name: string;
  section: SectionLabel;
  icon: string;
  description: string;
  defaultAlgorithmId?: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface SearchAlgorithmState extends BaseAlgorithmState {
  data: number[];
  targetValue: number | null;
  targetIndex: number | null;
  low: number;
  high: number;
  mid: number | null;
  found: boolean;
  eliminatedIndices: number[];
  path: number[]; // Indices of nodes visited in the tree
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

export type CellState = 'empty' | 'computing' | 'filled' | 'optimal' | 'conflict' | 'current';

export interface MatrixAlgorithmState extends BaseAlgorithmState {
  matrix: (number | string | null)[][];
  rowHeaders?: string[];
  colHeaders?: string[];
  highlightedCells: { row: number; col: number; state: CellState }[];
  pathCells?: { row: number; col: number }[];
  currentCell?: { row: number; col: number };
}

export interface DataPoint {
  id: string;
  x: number;
  y: number;
  label?: number;
  predictedLabel?: number;
  isCorrect?: boolean;
}

export interface Centroid {
  id: string;
  x: number;
  y: number;
  clusterId: number;
  previousX?: number;
  previousY?: number;
}

export interface BoundaryLine {
  type: 'linear' | 'curve';
  points: { x: number; y: number }[];
  color: string;
}

export interface ScatterAlgorithmState extends BaseAlgorithmState {
  points: DataPoint[];
  boundaries?: BoundaryLine[];
  centroids?: Centroid[];
  regressionLine?: { slope: number; intercept: number };
  costHistory?: number[];
  iteration: number;
  totalIterations: number;
  weights?: number[];
  highlightedPoints?: string[];
}

export interface MLGeneratorInput {
  points: DataPoint[];
  hyperparameters: {
    learningRate?: number;
    k?: number;
    maxIterations?: number;
    seed?: number;
  };
}

export type AlgorithmState =
  | ArrayAlgorithmState
  | SearchAlgorithmState
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState
  | MatrixAlgorithmState
  | ScatterAlgorithmState;

export type VisualizerType = 'array' | 'graph' | 'tree' | 'matrix' | 'scatter' | 'linked-list';
export type SectionLabel = 'fundamentals' | 'advanced' | 'data-structures' | 'intelligence';
