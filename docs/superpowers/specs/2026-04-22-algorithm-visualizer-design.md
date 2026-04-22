# Algorithm Visualizer Design Spec

## Project Goal
Build an interactive web application to help users learn and visualize algorithms for interview preparation. The application will feature step-by-step visualizations with explanations and code highlighting.

## Tech Stack
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS + shadcn/ui
* **Animation Engine (Arrays):** Framer Motion
* **Animation Engine (Graphs/Trees):** React Flow
* **Deployment:** Vercel

## UI Layout (IDE Style)
The layout will mimic a code editor/IDE to provide a focused learning environment:
* **Left Panel:** Sidebar menu for selecting algorithms (categorized by type: Sorting, Searching, Graphs, etc.).
* **Center Panel:** The main interactive visualizer canvas and playback controls (Play, Pause, Next Step, Prev Step, Speed Slider).
* **Right Panel:** Split vertically.
  * **Top:** The algorithm code (in JS/Python) with the currently executing line highlighted.
  * **Bottom:** Variable states (e.g., current indices, swap values, active nodes) and step-by-step textual explanations.

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
