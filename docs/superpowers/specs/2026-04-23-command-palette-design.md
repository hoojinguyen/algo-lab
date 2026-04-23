# Global Search (Command Palette) — Design Spec

**Date:** 2026-04-23
**Status:** Pending Approval
**Scope:** Global Command Palette for algorithm search

## 1. Vision
Implement a fast, keyboard-accessible command palette overlay (⌘K / Ctrl+K) that allows users to search across all algorithms and categories without navigating away from their current page.

## 2. Trigger Mechanisms
- **Keyboard Shortcut:** `Cmd+K` on Mac, `Ctrl+K` on Windows/Linux.
- **UI Trigger:** Search icon button in the `IconRail`.
- Both mechanisms will set a global state (e.g., using a Context or Zustand store) to toggle the visibility of the search modal.

## 3. UI/UX Design

### The Modal
- **Overlay:** Black backdrop with 40% opacity and subtle backdrop blur.
- **Container:** Centered, max-width of `600px`, using `--bg-secondary` with a `--border` outline and subtle drop shadow.
- **Header:** Large search input without visible borders, featuring a prominent search icon and a clear placeholder ("Search algorithms, tags...").

### The Results
- **Grouping:** Results are grouped by Category (e.g., "Sorting", "Searching").
- **Items:** Each item displays:
  - Algorithm Name
  - Relevant Tags (e.g., `divide-and-conquer`, `O(n log n)`)
  - Icon corresponding to its category
- **States:** 
  - `Hover/Focus`: Highlights with `--bg-tertiary` and a left border accent (`--accent`).
  - `Empty State`: "No algorithms found."

## 4. Search Logic
- **Data Source:** Pulls all algorithms from `ALGORITHM_REGISTRY` (defined in the registry spec).
- **Matching:** Fuzzy text matching against:
  - Algorithm `name`
  - Algorithm `tags`
  - Category `name`
- **Navigation:** 
  - `ArrowUp` / `ArrowDown` to navigate the list.
  - `Enter` to navigate to the selected algorithm's lesson page (`/[category]/[id]`).
  - `Escape` to close the modal.

## 5. Technical Implementation Details
- Component: `src/components/ui/CommandPalette.tsx`
- Hooks: `useSearch` to handle the filtering logic, `useKeyPress` to handle the keyboard shortcut.
- Integration: Rendered at the root level within the `AppShell` or `RootLayout` so it is accessible from anywhere.
