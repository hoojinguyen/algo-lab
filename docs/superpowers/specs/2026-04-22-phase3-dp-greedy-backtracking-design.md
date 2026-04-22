# AlgoLab Phase 3 — DP, Greedy, Backtracking, Strings & More

**Date:** 2026-04-22
**Status:** Designed (not yet planned for implementation)
**Depends on:** Phase 2 complete
**Scope:** 18 algorithms, 6 categories, 1 new visualizer type

## 1. Overview

Phase 3 covers algorithmic paradigms (how you think about problems) rather than data structures. These algorithms are less about visual data manipulation and more about decision-making processes — making the MatrixVisualizer and enhanced TreeVisualizer essential for showing DP tables, recursion trees, and backtracking state space.

## 2. New Categories

### Dynamic Programming (6 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Fibonacci | matrix | O(n) | O(1) optimized | Memoization vs tabulation intro |
| 0/1 Knapsack | matrix | O(n × W) | O(n × W) | 2D DP table, include/exclude decisions |
| Longest Common Subsequence | matrix | O(m × n) | O(m × n) | 2D table with string comparison |
| Longest Increasing Subsequence | array + matrix | O(n²) or O(n log n) | O(n) | 1D DP with binary search optimization |
| Coin Change | matrix | O(n × amount) | O(amount) | Unbounded knapsack variant |
| Matrix Chain Multiplication | matrix | O(n³) | O(n²) | Optimal parenthesization |

### Greedy (3 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Activity Selection | array | O(n log n) | O(1) | Sort by end time, greedy choice |
| Huffman Coding | tree | O(n log n) | O(n) | Greedy tree building, prefix codes |
| Fractional Knapsack | array | O(n log n) | O(1) | Sort by value/weight ratio |

### Backtracking (4 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| N-Queens | matrix | O(n!) | O(n²) | Place queens, backtrack on conflict |
| Sudoku Solver | matrix | O(9^(n²)) | O(n²) | Constraint propagation + backtracking |
| Subset Sum | tree | O(2^n) | O(n) | Decision tree: include/exclude |
| Permutations | tree | O(n!) | O(n) | Build permutations via swap tree |

### String (4 algorithms)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| KMP | array | O(n + m) | O(m) | Failure function, no backtracking |
| Rabin-Karp | array | O(n + m) avg | O(1) | Rolling hash for pattern matching |
| Longest Palindromic Substring | matrix | O(n²) | O(n²) | DP expansion from center |
| Trie Operations | tree | O(m) per op | O(alphabet × m × n) | Insert/search/prefix in trie |

### Divide & Conquer (2 unique algorithms, others already in Phase 1-2)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Closest Pair of Points | scatter (borrow from Phase 4) | O(n log n) | O(n) | Geometric divide & conquer |
| Strassen's Matrix Mult. | matrix | O(n^2.807) | O(n²) | Reduce multiplications from 8 to 7 |

### Union-Find (1 algorithm)
| Algorithm | Visualizer | Complexity (Time) | Space | Key Concept |
|-----------|-----------|-------------------|-------|-------------|
| Union-Find (DSU) | tree | O(α(n)) amortized | O(n) | Path compression + union by rank |

## 3. New Visualizer Type

### 3.1 MatrixVisualizer

**Purpose:** Render 2D grids/tables with cell-level highlighting for DP and backtracking.

**Visual design:**
- Grid of cells, each showing a numeric value
- Row/column headers for labeling (e.g., items in knapsack, characters in LCS)
- Cell states: empty, computing (accent pulse), filled (secondary), optimal-path (success), current (accent)
- Arrow overlays showing the decision path through the DP table
- For backtracking: cells show placed pieces (queens, numbers) with conflict highlighting (red)

**Data model extension:**
```typescript
interface MatrixAlgorithmState extends BaseAlgorithmState {
  matrix: (number | string | null)[][];
  rowHeaders?: string[];
  colHeaders?: string[];
  highlightedCells: { row: number; col: number; state: CellState }[];
  pathCells?: { row: number; col: number }[];  // optimal path through DP table
  currentCell?: { row: number; col: number };
}

type CellState = 'empty' | 'computing' | 'filled' | 'optimal' | 'conflict' | 'current';
```

**Specific layouts:**
- **DP table:** Standard grid with headers, filled left-to-right/top-to-bottom
- **N-Queens:** 8×8 chessboard with queen placement/removal animation
- **Sudoku:** 9×9 grid with 3×3 box borders, given vs. filled styling
- **String matching:** Two aligned strings with character-level comparison highlighting

**Input controls:**
- For DP: adjustable problem size (knapsack capacity, string length)
- For backtracking: board size (N for N-Queens), puzzle preset selection
- For strings: editable pattern and text inputs

## 4. Reuse of Existing Visualizers

Several Phase 3 algorithms reuse visualizers from earlier phases:
- **Activity Selection, Fractional Knapsack, LIS:** `ArrayVisualizer` with timeline/bar representation
- **Huffman Coding, Subset Sum, Permutations, Trie, Union-Find:** `TreeVisualizer` from Phase 2
- **Closest Pair:** borrows `ScatterVisualizer` from Phase 4 (implement early or use a simplified version)

This means Phase 3's only NEW visualizer is `MatrixVisualizer`. The rest leverage existing infrastructure.

## 5. LeetCode Problems (curated per algorithm)

| Algorithm | Problems |
|-----------|----------|
| Fibonacci | Climbing Stairs, Fibonacci Number, Tribonacci |
| 0/1 Knapsack | Partition Equal Subset Sum, Target Sum, Last Stone Weight II |
| LCS | Longest Common Subsequence, Edit Distance, Shortest Common Supersequence |
| LIS | Longest Increasing Subsequence, Number of LIS, Russian Doll Envelopes |
| Coin Change | Coin Change, Coin Change II, Perfect Squares |
| Matrix Chain | Burst Balloons, Minimum Score Triangulation |
| Activity Selection | Non-overlapping Intervals, Meeting Rooms II, Minimum Arrows |
| Huffman Coding | Minimum Cost to Merge Stones (conceptual) |
| Fractional Knapsack | Assign Cookies, Boats to Save People |
| N-Queens | N-Queens, N-Queens II |
| Sudoku Solver | Sudoku Solver, Valid Sudoku |
| Subset Sum | Combination Sum, Subsets, Partition Equal Subset Sum |
| Permutations | Permutations, Permutations II, Next Permutation |
| KMP | Find the Index of First Occurrence, Repeated Substring Pattern |
| Rabin-Karp | Repeated DNA Sequences, Longest Duplicate Substring |
| Longest Palindromic Substring | Longest Palindromic Substring, Palindromic Substrings |
| Trie | Implement Trie, Word Search II, Design Add and Search Words |
| Union-Find | Number of Connected Components, Redundant Connection, Accounts Merge |

## 6. Category Definitions

```typescript
{ id: 'dynamic-programming', name: 'Dynamic Programming', section: 'advanced', icon: 'Grid3x3' },
{ id: 'greedy', name: 'Greedy', section: 'advanced', icon: 'Zap' },
{ id: 'backtracking', name: 'Backtracking', section: 'advanced', icon: 'Undo2' },
{ id: 'string', name: 'String', section: 'fundamentals', icon: 'Type' },
{ id: 'divide-conquer', name: 'Divide & Conquer', section: 'advanced', icon: 'Split' },
{ id: 'union-find', name: 'Union-Find', section: 'data-structures', icon: 'Merge' },
```

## 7. UI Changes from Phase 2

- MatrixVisualizer component added to visualizer factory
- Matrix-specific input controls (board size, string inputs)
- The DP table may need horizontal scrolling for large inputs — add scroll container
- Backtracking visualizations benefit from a "recursion tree" toggle that shows the decision tree alongside the grid (reuses TreeVisualizer)
