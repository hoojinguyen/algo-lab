# Dashboard Enhancements — Design Spec

**Date:** 2026-04-23
**Status:** Pending Approval
**Scope:** Implementing the missing dynamic features of the Dashboard Home

## 1. Vision
Enhance the Dashboard (`/`) to provide a personalized learning experience by tracking user progress, highlighting recently accessed lessons, and suggesting the next logical algorithm to study.

## 2. Data Persistence (User Progress)
Since Phase 1 relies on local storage (no backend), we need a system to persist progress.

**Structure in `localStorage`:**
```typescript
interface UserProgress {
  completedAlgorithms: string[]; // Array of algorithm IDs
  recentlyStudied: string[];     // Array of algorithm IDs, max length 5
}
```

## 3. Component Details

### 3.1 Your Progress
- **Logic:** Calculate completion percentage: `(completedAlgorithms.length / totalAlgorithmsInRegistry) * 100`.
- **UI:** A progress bar that dynamically fills based on the percentage, updating "X of 55 completed".

### 3.2 Recently Studied Section
- **Location:** Displayed above or next to the Category Grid on the Dashboard.
- **Logic:** Read `recentlyStudied` from local storage. Map these IDs back to `AlgorithmEntry` via the registry.
- **UI:** Horizontal scroll or a grid of small cards. Each card displays the algorithm name, category icon, and complexity. Clicking resumes the lesson.

### 3.3 Suggested Next Algorithm
- **Location:** Prominent card at the top of the Dashboard.
- **Logic for Suggestion:**
  1. Find the first category the user has started but not completed.
  2. Find the first algorithm in that category that is NOT in `completedAlgorithms`.
  3. If all started categories are complete, find the first algorithm in the *next* category.
  4. If user is brand new, suggest "Bubble Sort" (or the first algorithm in the first category).
- **UI:** A highlighted "Up Next" card with a "Start Lesson" call-to-action button, featuring the algorithm's name and a brief description.

## 4. Technical Implementation Details
- **Hook:** Create a `useUserProgress` hook to abstract reading/writing to `localStorage`.
  - Methods: `markCompleted(id)`, `addRecentlyStudied(id)`, `getSuggestedNext()`.
- **Hydration:** Since we use Next.js server/client components, `localStorage` must be read inside a `useEffect` to prevent hydration mismatches. The Dashboard will render a skeleton state while loading progress.
