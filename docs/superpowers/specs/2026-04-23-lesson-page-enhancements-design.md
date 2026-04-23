# Lesson Page & Navigation Enhancements — Design Spec

**Date:** 2026-04-23
**Status:** Pending Approval
**Scope:** Implementing missing features from the Lesson Page and fixing the dynamic behavior of the Slide Panel.

## 1. Vision
Bring the Lesson Page up to the full spec by adding the TopBar (with Theme Toggle), adding the Practice Section for LeetCode integrations, and making the AppShell's Slide Panel dynamically reflect the registry and user progress.

## 2. Dynamic Slide Panel & Progress
Currently, the `SlidePanel` in `AppShell` hardcodes the algorithm list.

### 2.1 Dynamic Algorithm List
- **Logic:** When `activeCategory` is set, fetch algorithms from the registry: `getAlgorithmsByCategory(activeCategory)`.
- **UI:** Map over the results to render the links.

### 2.2 Completion Indicators
- **Logic:** Use the `useUserProgress` hook (from the Dashboard spec) to check if an algorithm ID is in `completedAlgorithms`.
- **UI:** Render a green checkmark icon (`CheckCircle`) next to the algorithm name in the list if completed.

### 2.3 Category Progress Bar
- **Location:** Fixed at the bottom of the Slide Panel.
- **Logic:** Calculate `(completedInCategory / totalInCategory) * 100`.
- **UI:** A mini progress bar showing the completion status of the currently active category.

## 3. Lesson Page: TopBar
- **Location:** At the very top of the left column (ContentColumn).
- **Features:**
  - **Breadcrumbs:** `Home / Sorting / Bubble Sort`. Clickable links to navigate back.
  - **Theme Toggle:** A button right-aligned in the TopBar. Toggles between Light/Dark/System by interacting with the `next-themes` provider.
  - **Mark as Complete:** A button to mark the current algorithm as finished, updating the local storage.

## 4. Lesson Page: Practice Section (LeetCode)
- **Location:** At the bottom of the left column, below the Code Block.
- **Data Source:** Pull from the `leetcode` array in the `AlgorithmEntry`.
- **UI Design:**
  - Section Title: "Practice on LeetCode".
  - Cards: If `leetcode` array has items, render a grid of minimal cards.
  - Card Content: Problem Title, external link icon (`ExternalLink`), and a Difficulty Badge.
  - Difficulty Badge Colors:
    - Easy: `--success` background/text.
    - Medium: `--warning` background/text.
    - Hard: `--error` background/text.
- **Empty State:** If the `leetcode` array is empty, display a subtle message: "No specific practice problems mapped yet."
