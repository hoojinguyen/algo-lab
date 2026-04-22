# Algorithm Visualizer Design Spec

## Project Goal
Build an interactive web application to help users learn and visualize algorithms for interview preparation. The application will feature step-by-step visualizations with explanations and code highlighting.

## Tech Stack
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS + shadcn/ui
* **Animation Engine (Arrays):** Framer Motion
* **Animation Engine (Graphs/Trees):** React Flow
* **Deployment:** Vercel

## Visual Theme & Design System (Tesla-Inspired Glassmorphism)
The application adheres to the strict Tesla design system, enhanced for a learning environment:
* **Dark Mode & Glassmorphism:** To inject life without violating the "no CSS gradients/no shadows" rule, the background will feature abstract, cinematic, dark-themed imagery or pure Carbon Dark (`#171A20`). UI panels will float above this using "Frost" level glassmorphism (`rgba(23,26,32,0.75)` with `backdrop-filter: blur`), providing depth through photography and translucency rather than CSS drop shadows.
* **Colors:** Carbon Dark (`#171A20`) surfaces, Pure White (`#FFFFFF`) for primary text. Electric Blue (`#3E6AE1`) is used *exclusively* for primary CTAs and active interactive states (like the play button or highlighting the current sorting bar).
* **Typography:** Universal Sans (or Inter). Display variant for headings (up to 40px, weight 500), and Text variant for UI (14px, weight 400/500).
* **Styling Rules:** ZERO shadows, ZERO CSS gradients, ZERO decorative borders. All interactive elements use a sharp 4px border-radius.
* **Transitions:** Universal 0.33s cubic-bezier transitions for all interactive state changes.

## UI Layout (The Split Brain)
The layout splits the screen strictly in half to intertwine theory and practice:
* **Left Panel ("The Story"):** A scrollable, premium article format. Explains the algorithm (introduction, time complexity, real-world examples). Contains inline action buttons (e.g., `[Simulate First Pass]`) that trigger the visualizer on the right. Ends with the raw implementation code.
* **Right Panel ("The Lab"):** A fixed, non-scrolling massive visualizer canvas. Contains the array/graph visualizer, playback controls (Play, Pause, Speed), and a Sandbox Input to plug in custom arrays/nodes.
* **Glassmorphic Execution:** The entire page sits over the cinematic dark background. The left and right panels are semi-transparent Frosted Glass panes separated by a delicate 1px `Pewter` (`#5C5E62`) line.

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
