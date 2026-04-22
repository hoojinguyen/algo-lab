# Algorithm Visualizer Design Spec

## Project Goal
Build an interactive web application to help users learn and visualize algorithms for interview preparation. The application will feature step-by-step visualizations with explanations and code highlighting.

## Tech Stack
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS + shadcn/ui
* **Animation Engine (Arrays):** Framer Motion
* **Animation Engine (Graphs/Trees):** React Flow
* **Deployment:** Vercel

## Visual Theme & Design System (Tesla-Inspired)
The application will adhere to a radically minimal, ascetic design system:
* **Colors:** Predominantly Pure White (`#FFFFFF`) backgrounds and Carbon Dark (`#171A20`) text. Electric Blue (`#3E6AE1`) is used *exclusively* for primary CTAs and active interactive states (like the play button or highlighting the current sorting bar).
* **Typography:** Universal Sans (or a similar geometric sans like Inter). Display variant for headings (up to 40px, weight 500), and Text variant for UI (14px, weight 400/500).
* **Styling Rules:** ZERO shadows, ZERO gradients, ZERO decorative backgrounds. All interactive elements use a sharp 4px border-radius.
* **Transitions:** Universal 0.33s cubic-bezier transitions for all interactive state changes (color, background).
* **Elevation:** Handled via z-index, frosted glass (`rgba(255,255,255,0.75)`), or flat solid colors. No drop shadows.

## UI Layout (Minimalist IDE Style)
The layout will mimic a code editor/IDE but rendered through the minimal design lens:
* **Canvas Background:** Pure White (`#FFFFFF`) or Light Ash (`#F4F4F4`).
* **Dividers:** Clean 1px lines using Cloud Gray (`#EEEEEE`). No panel shadows.
* **Left Panel:** Sidebar menu for selecting algorithms (categorized by type: Sorting, Searching, Graphs). Navigation links use Graphite (`#393C41`), turning Carbon Dark (`#171A20`) on hover/active.
* **Center Panel:** The main interactive visualizer canvas. Array bars and Graph nodes are flat shapes (no 3D effects). Playback controls are stark, flat buttons with 4px border-radius. The Play button will be Electric Blue (`#3E6AE1`).
* **Right Panel:** Split vertically with a Cloud Gray divider.
  * **Top:** The algorithm code with the currently executing line highlighted (e.g., using a subtle Light Ash background).
  * **Bottom:** Variable states and step-by-step textual explanations in Graphite (`#393C41`).

## Supported Algorithms (Initial Scope)
* **Sorting Algorithms:** Bubble Sort, Merge Sort, Quick Sort.
* **Search Algorithms:** Binary Search, Linear Search.
* **Graph/Tree Traversals:** Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Algorithm.

## System Architecture

The core of the application separates the algorithm logic from the UI rendering.

### 1. Algorithm Engine
Algorithms will be implemented as plain JavaScript functions that act as generators (or return an array of states). Instead of manipulating the DOM, they yield a `State` object at every significant step (e.g., comparing two elements, swapping, traversing a node).

**Example State Object:**
```json
{
  "step": 4,
  "description": "Comparing element at index 2 and 3",
  "activeIndices": [2, 3],
  "swapped": false,
  "codeLine": 12,
  "data": [5, 2, 8, 1, 9]
}
```

### 2. Playback Controller (State Manager)
A React Context or hook (`usePlayback`) that manages the array of states produced by the Algorithm Engine.
* Maintains the `currentIndex` of the visualization.
* Provides functions: `play()`, `pause()`, `next()`, `prev()`, `setSpeed()`.
* Passes the current `State` object down to the UI components.

### 3. Visualizers (UI Engine)
The visualizers are dumb components that receive a `State` object and render it.
* **ArrayVisualizer:** Uses `framer-motion` to render an array of bars. It reads `activeIndices` to highlight bars and smoothly animates changes in the `data` array (e.g., when a swap occurs).
* **GraphVisualizer:** Uses `React Flow` to render nodes and edges. It highlights active nodes and edges based on the `State` object, handling layout and pan/zoom automatically.
