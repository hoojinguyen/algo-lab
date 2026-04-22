# AlgoLab Expansion — Design Spec

**Date:** 2026-04-22
**Status:** Approved
**Scope:** Phase 1 — Foundation rebuild + Sorting & Searching algorithms

## 1. Vision

Transform the current 3-algorithm sorting visualizer into a comprehensive algorithm learning platform covering 55 algorithms across 14 categories, with LeetCode integration and a professional, system-aware light/dark UI.

## 2. Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Learning flow | Course-style (Theory → Code → Visualizer → Practice) | Depth for real learning, LeetCode fits as "practice" step |
| Algorithm scope | 55 algorithms, 14 categories (incl. AI/ML) | Covers university DSA + interview prep + ML fundamentals |
| Navigation | Icon Rail (48px) + Slide Panel (200px, collapsible) | Max content space, all categories visible, modern app pattern |
| Content layout | Scrollable left column + Sticky Visualizer on right | Read theory/code while watching animation — no context-switching |
| Theme | Light + Dark + system auto-detect | `prefers-color-scheme` + localStorage override via toggle |
| LeetCode | Link list with difficulty badges | Simple, LeetCode's UI handles solving |
| Data architecture | TypeScript config, file-based registry | Type-safe, one language (generators are TS anyway), no JSON split |

## 3. Algorithm Catalog

### Phase 1 (this spec): 13 algorithms, 2 categories

**Sorting (9):** Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Bucket
**Searching (4):** Linear Search, Binary Search, Jump Search, Interpolation Search

### Future phases (spec'd separately)

**Phase 2 — Graph & Tree (17):** BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, A*, Kruskal's, Prim's, Inorder/Preorder/Postorder Traversal, BST Insert/Delete/Search, AVL Rotation, Heap Operations, Linked List Reversal, Cycle Detection, Merge Two Sorted Lists
**Phase 3 — DP, Greedy, Backtracking, Strings (18):** Fibonacci, Knapsack, LCS, LIS, Coin Change, Matrix Chain, Activity Selection, Huffman Coding, Fractional Knapsack, N-Queens, Sudoku Solver, Subset Sum, Permutations, KMP, Rabin-Karp, Longest Palindromic Substring, Trie Operations, Union-Find
**Phase 4 — AI/ML (7):** Linear Regression, KNN, K-Means, Decision Tree, Gradient Descent, Naive Bayes, Perceptron

## 4. Architecture

### 4.1 Routing (Next.js App Router)

```
/                           → Dashboard home (progress, categories, suggested next)
/[category]/[algorithm]     → Algorithm lesson page
```

- Dashboard is a server component that reads algorithm registry
- Lesson pages are client components (interactive visualizer, playback)

### 4.2 Component Hierarchy

```
RootLayout (server)
├── ThemeProvider (client) — system detection + localStorage + toggle
│   └── AppShell (client) — manages rail/panel/content layout
│       ├── IconRail — 48px, category icons, logo, search trigger, settings
│       ├── SlidePanel — 200px collapsible, algorithm list for active category
│       │   ├── PanelHeader — category name + count
│       │   ├── AlgorithmList — items with completion status
│       │   └── CategoryProgress — mini progress bar
│       └── MainContent
│           ├── DashboardHome (when no algorithm selected)
│           │   ├── ProgressOverview — overall stats
│           │   ├── CategoryGrid — all 14 categories as cards
│           │   └── RecentlyStudied — last accessed algorithms
│           └── LessonPage (when algorithm selected)
│               ├── TopBar — breadcrumbs + theme toggle
│               ├── ContentColumn (scrollable left)
│               │   ├── LessonHeader — name, complexity badges, tags
│               │   ├── TheorySection — markdown-rendered theory
│               │   ├── CodeSection — syntax-highlighted implementation
│               │   └── PracticeSection — LeetCode links with difficulty
│               └── VisualizerPanel (sticky right)
│                   ├── ArrayVisualizer (Phase 1)
│                   └── PlaybackControls — play/pause/step/reset/speed
```

### 4.3 Data Architecture

File-based registry pattern. Each algorithm is a self-contained folder:

```
src/lib/algorithms/
├── registry.ts              — collects and exports all algorithms
├── categories.ts            — category definitions
├── types.ts                 — shared types
│
├── sorting/
│   ├── bubble-sort/
│   │   ├── config.ts        — metadata
│   │   ├── theory.ts        — markdown theory content
│   │   ├── code.ts          — displayable source code
│   │   └── generator.ts     — step-by-step state generator
│   ├── selection-sort/
│   │   └── ...
│   └── ...
│
├── searching/
│   ├── binary-search/
│   │   └── ...
│   └── ...
```

### 4.4 Core Types

```typescript
// Category definition
interface Category {
  id: string;                    // "sorting"
  name: string;                  // "Sorting"
  section: SectionLabel;         // "fundamentals" | "advanced" | "data-structures" | "intelligence"
  icon: string;                  // Lucide icon name
  description: string;
}

// Algorithm configuration
interface AlgorithmConfig {
  id: string;                    // "bubble-sort"
  name: string;                  // "Bubble Sort"
  category: string;              // "sorting"
  complexity: {
    best: string;                // "O(n)"
    average: string;             // "O(n²)"
    worst: string;               // "O(n²)"
    space: string;               // "O(1)"
  };
  stable: boolean;
  visualizerType: VisualizerType;
  tags: string[];                // ["comparison", "in-place"]
}

// Full algorithm entry (config + content + logic)
interface AlgorithmEntry extends AlgorithmConfig {
  theory: string;                // markdown content
  code: string;                  // source code string
  generator: (input: unknown) => Generator<AlgorithmState>;
  leetcode: LeetCodeProblem[];
}

// Step state for visualizer
interface AlgorithmState {
  step: number;
  description: string;
  activeIndices: number[];
  swapped: boolean;
  data: number[];
  codeLine?: number;
}

// LeetCode problem reference
interface LeetCodeProblem {
  title: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

type VisualizerType = 'array' | 'graph' | 'tree' | 'matrix' | 'scatter' | 'linked-list';
type SectionLabel = 'fundamentals' | 'advanced' | 'data-structures' | 'intelligence';
```

## 5. Navigation Design

### 5.1 Icon Rail (48px)

- Fixed left edge, full viewport height
- Top: logo mark (white square with pulse icon)
- Middle: category icons stacked vertically, grouped by section
  - Active category: subtle background + left accent bar
  - Inactive: muted icon color
  - Tooltip on hover showing category name
- Bottom: search trigger, settings/theme toggle
- Icons: Lucide SVG, 16px, 1.75px stroke weight, monochrome

### 5.2 Slide Panel (200px)

- Appears when a category icon is clicked
- Collapsible — can be hidden to give full width to content
- Header: category name + algorithm count
- Algorithm list: name + completion indicator (checkmark, progress bar, or empty)
- Bottom: category progress bar
- Smooth slide animation (200ms ease-out)
- Hidden scrollbar (`scrollbar-width: none`)

### 5.3 Search (⌘K)

- Command palette overlay triggered by keyboard shortcut or search icon
- Searches across all 55 algorithm names and tags
- Results grouped by category
- Keyboard navigable (arrow keys + enter)
- Implemented as a modal with backdrop blur

## 6. Content Layout

### 6.1 Lesson Page — Split View

Left column (scrollable, ~55% width):
1. **LessonHeader** — algorithm name (h1), complexity badges (color-coded: green/yellow/red), tags
2. **TheorySection** — markdown-rendered explanation, formatted prose with headings
3. **CodeSection** — syntax-highlighted implementation with line numbers and active line tracking (synced with visualizer step)
4. **PracticeSection** — curated LeetCode links as cards with title, difficulty badge, external link icon

Right column (sticky, ~45% width):
1. **VisualizerPanel** — `position: sticky; top: 0` — stays visible as user scrolls through theory/code
2. **PlaybackControls** — anchored to bottom of visualizer panel
   - Play/Pause, Step Forward, Step Back, Reset
   - Speed control (0.5x, 1x, 2x)
   - Step counter: "Step 3 / 24"

### 6.2 Dashboard Home

Shown when no algorithm is selected (landing page at `/`):
- **ProgressOverview** — "3 of 55 completed" with overall progress bar
- **CategoryGrid** — all 14 categories as minimal cards (icon, name, count, completion)
- **RecentlyStudied** — last 3-5 accessed algorithms for quick resume
- **SuggestedNext** — algorithmically picks the next algorithm to study based on completion

## 7. Theme System

### 7.1 Detection & Persistence

1. On mount, check `localStorage.getItem('theme')`
2. If `null` or `'system'` → read `window.matchMedia('(prefers-color-scheme: dark)')`
3. If `'light'` or `'dark'` → use directly
4. Apply via `document.documentElement.setAttribute('data-theme', resolved)`
5. Listen for system changes via `matchMedia.addEventListener('change', ...)`
6. Toggle cycles: system → light → dark → system

### 7.2 Color Tokens

Defined in `globals.css` using Tailwind v4 `@theme` with `[data-theme]` selectors:

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--bg-primary` | `#09090b` (zinc-950) | `#ffffff` |
| `--bg-secondary` | `#18181b` (zinc-900) | `#f9fafb` (gray-50) |
| `--bg-tertiary` | `#27272a` (zinc-800) | `#f4f4f5` (zinc-100) |
| `--border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)` |
| `--text-primary` | `#fafafa` | `#09090b` |
| `--text-secondary` | `#a1a1aa` (zinc-400) | `#52525b` (zinc-600) |
| `--text-muted` | `#52525b` (zinc-600) | `#a1a1aa` (zinc-400) |
| `--accent` | `#3b82f6` (blue-500) | `#2563eb` (blue-600) |
| `--success` | `#22c55e` | `#16a34a` |
| `--warning` | `#eab308` | `#ca8a04` |
| `--error` | `#ef4444` | `#dc2626` |

### 7.3 Component Rules

- All components use CSS custom properties, never hardcoded colors
- The existing Tesla DESIGN.md palette is replaced by this zinc-based system
- Icon strokes use `--text-muted` for inactive, `--text-primary` for active
- Borders use `--border` everywhere for consistency
- The `glass-panel` class is removed; panels use `--bg-secondary` with `--border`

## 8. Design Aesthetic

Inspired by Linear, Vercel, and Raycast — professional developer tools, not a "learning toy."

### Principles
- **Monochrome + single accent** — zinc palette with blue accent only on active/interactive states
- **SVG line icons** — Lucide, 1.75px stroke, consistent 16px size
- **Minimal borders** — `rgba` semi-transparent, not solid colors
- **Typography** — Geist Sans for UI, Geist Mono for code. Two weights: 400 (body), 500/600 (headings)
- **No shadows** — depth via background color stepping and subtle borders
- **No emoji in UI** — SVG icons only
- **Hidden scrollbars** — `scrollbar-width: none` on sidebar/panels
- **Smooth transitions** — 200ms ease-out for panel open/close, 150ms for hover states
- **Semantic color only** — green/yellow/red reserved for complexity and completion status

### Font Stack
```css
--font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
```

## 9. Migration from Current Codebase

### What changes:
- `src/app/page.tsx` (191 lines) → split into Dashboard + LessonPage components
- `src/app/globals.css` → new theme system with dual-mode tokens
- `src/app/layout.tsx` → add ThemeProvider, update metadata
- `src/lib/types.ts` → expanded with new interfaces
- `src/lib/algorithms/` → restructure into folder-per-algorithm pattern
- `src/components/` → new AppShell, IconRail, SlidePanel, LessonPage components
- `DESIGN.md` → updated to reflect new design system (replaces Tesla theme)

### What's preserved:
- `usePlayback` hook — works as-is, no changes needed
- `ArrayVisualizer` component — refine, but core logic stays
- `PlaybackControls` — update styling, keep interaction logic
- Generator pattern — same `Generator<AlgorithmState>` contract
- Bubble/Merge/Quick sort generators — migrate to new folder structure

### What's deleted:
- `glass-panel` CSS class and Tesla-specific tokens
- Hardcoded `ALGORITHMS` object in `page.tsx`
- The three-column layout (sidebar + story + lab)

## 10. Build Error Fix

The current `CodeBlock.tsx` has a template literal parsing error on line 15 (unterminated backtick in querySelector). This must be fixed as part of the migration — the component will be rewritten with the new theme system.

## 11. Out of Scope (Phase 1)

- GraphVisualizer, TreeVisualizer, MatrixVisualizer, ScatterVisualizer, LinkedListVisualizer (Phase 2-4)
- User accounts or authentication
- Backend/database — everything is static
- In-app code editor for LeetCode problems
- Mobile-responsive layout (desktop-first for Phase 1)
- Progress persistence across devices (localStorage only)
- Algorithm comparison mode (side-by-side)
