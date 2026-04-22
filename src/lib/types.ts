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

export interface AlgorithmState {
  step: number;
  description: string;
  activeIndices: number[];
  swapped: boolean;
  data: number[];
  codeLine?: number;
}

export type VisualizerType = 'array' | 'graph' | 'tree' | 'matrix' | 'scatter' | 'linked-list';
export type SectionLabel = 'fundamentals' | 'advanced' | 'data-structures' | 'intelligence';
