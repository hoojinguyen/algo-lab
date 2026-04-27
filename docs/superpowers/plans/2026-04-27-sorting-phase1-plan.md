# Sorting Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the `AlgorithmEntry` definitions for Bubble Sort, Selection Sort, and Insertion Sort with rich theory content and 3 mechanics-based LeetCode problems each.

**Architecture:** Each sorting algorithm lives in its own folder under `src/lib/algorithms/sorting/<name>/index.ts` and exports an `AlgorithmEntry` object. The `generator` functions are already fully implemented. This plan only modifies the `theory` string and `leetcode` array fields on each entry. No new files are created.

**Tech Stack:** TypeScript, Next.js. No tests required. Commit directly to `main`.

---

### Task 1: Update Bubble Sort Entry

**Files:**
- Modify: `src/lib/algorithms/sorting/bubble-sort/index.ts`

- [ ] **Step 1: Replace `theory` string with rich content**

  Open `src/lib/algorithms/sorting/bubble-sort/index.ts`.
  Find the `bubbleSortEntry` object and replace the `theory` field value with:

  ```ts
  theory: `Bubble Sort works by making repeated passes through the array, comparing each pair of adjacent elements and swapping them if they are in the wrong order. After each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.

**Time Complexity:** O(n²) average and worst case — every element may need to be compared against every other element. However, with an early-exit optimization (a flag to detect if any swaps occurred in a pass), the best case drops to O(n) when the input is already sorted.

**Space Complexity:** O(1) — sorting happens in-place with no auxiliary data structures.

**Stability:** Stable — equal elements are never swapped past each other, preserving their original relative order.

**When to use:** Bubble Sort is rarely used in production due to its quadratic time complexity. It is useful for teaching, and its early-exit variant can be practical when data is known to be nearly sorted and the dataset is very small (< 10 elements). Its in-place nature makes it usable in extremely memory-constrained environments.

**Key Interview Insight:** The early-exit optimization transforms this from a naive algorithm into one that can detect a sorted array in O(n) time. Interviewers sometimes ask you to implement this optimized version.`,
  ```

- [ ] **Step 2: Replace `leetcode` array with 3 mechanics-based problems**

  In the same file, replace `leetcode: []` with:

  ```ts
  leetcode: [
    {
      title: 'Sort an Array',
      url: 'https://leetcode.com/problems/sort-an-array',
      difficulty: 'medium',
    },
    {
      title: 'Move Zeroes',
      url: 'https://leetcode.com/problems/move-zeroes',
      difficulty: 'easy',
    },
    {
      title: 'Sort Colors',
      url: 'https://leetcode.com/problems/sort-colors',
      difficulty: 'medium',
    },
  ],
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/algorithms/sorting/bubble-sort/index.ts
  git commit -m "feat(sorting): enrich bubble sort theory and leetcode problems"
  ```

---

### Task 2: Update Selection Sort Entry

**Files:**
- Modify: `src/lib/algorithms/sorting/selection-sort/index.ts`

- [ ] **Step 1: Replace `theory` string with rich content**

  Open `src/lib/algorithms/sorting/selection-sort/index.ts`.
  Find the `selectionSortEntry` object and replace the `theory` field value with:

  ```ts
  theory: `Selection Sort divides the array into two conceptual regions: a sorted region on the left and an unsorted region on the right. On each pass, it scans the entire unsorted region to find the minimum element, then swaps it into the next position of the sorted region.

**Time Complexity:** O(n²) for best, average, and worst cases — the inner scan must always traverse the full unsorted region regardless of the data's initial order.

**Space Complexity:** O(1) — sorting is done in-place.

**Stability:** Unstable — the swap operation can change the relative order of equal elements. For example, in [5a, 5b, 1], the 1 swaps with 5a, moving 5b before 5a.

**Selection Sort's unique advantage:** It makes at most O(n) write operations (swaps). This is its defining trait. In systems where writing to memory is significantly more expensive than reading (e.g., flash memory or EEPROM), Selection Sort can outperform algorithms with better time complexity.

**When to use:** Prefer Selection Sort over Bubble Sort for memory-constrained hardware where minimizing writes matters. In most software contexts, it is outperformed by Insertion Sort for small arrays and O(n log n) algorithms for large ones.

**Key Interview Insight:** The "scan to find minimum and swap" pattern is the kernel of many problems. When a problem asks for "the k-th smallest/largest element" through repeated selection, that's Selection Sort logic.`,
  ```

- [ ] **Step 2: Replace `leetcode` array with 3 mechanics-based problems**

  In the same file, replace the existing `leetcode` array (which has one entry) with:

  ```ts
  leetcode: [
    {
      title: 'Kth Largest Element in an Array',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array',
      difficulty: 'medium',
    },
    {
      title: 'Third Maximum Number',
      url: 'https://leetcode.com/problems/third-maximum-number',
      difficulty: 'easy',
    },
    {
      title: 'Minimum Operations to Make Array Equal',
      url: 'https://leetcode.com/problems/minimum-operations-to-make-array-equal',
      difficulty: 'medium',
    },
  ],
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/algorithms/sorting/selection-sort/index.ts
  git commit -m "feat(sorting): enrich selection sort theory and leetcode problems"
  ```

---

### Task 3: Update Insertion Sort Entry

**Files:**
- Modify: `src/lib/algorithms/sorting/insertion-sort/index.ts`

- [ ] **Step 1: Replace `theory` string with rich content**

  Open `src/lib/algorithms/sorting/insertion-sort/index.ts`.
  Find the `insertionSortEntry` object and replace the `theory` field value with:

  ```ts
  theory: `Imagine sorting a hand of playing cards. You pick up one card at a time from the table and slide it into the correct position among the cards already in your hand. That is exactly how Insertion Sort works — it builds a sorted sub-array one element at a time, shifting larger elements to the right to make room for the current element.

**Time Complexity:** O(n²) worst case (reverse-sorted input requires maximum shifting). O(n) best case — if the input is already sorted, each element is compared once and immediately placed, making a single O(n) pass.

**Space Complexity:** O(1) — in-place algorithm.

**Stability:** Stable — elements are only shifted past the current key if they are strictly greater, preserving the relative order of equal elements.

**Insertion Sort's defining strength:** It is adaptive. Its performance scales with how close the input is to being sorted. This makes it the algorithm of choice for small datasets (< 16–32 elements) and nearly sorted data.

**Real-world usage:** Python's Timsort and Java's Arrays.sort use Insertion Sort as a sub-routine for partitions smaller than a threshold (typically 32–64 elements). This is because for tiny arrays, the low overhead and cache-friendliness of Insertion Sort outperform the O(n log n) algorithms.

**Key Interview Insight:** The "shift and insert" pattern appears in problems involving maintaining a sorted window or inserting into a sorted position. Recognizing this pattern is key to solving linked-list sorting problems elegantly.`,
  ```

- [ ] **Step 2: Replace `leetcode` array with 3 mechanics-based problems**

  In the same file, replace the existing `leetcode` array (which has one entry) with:

  ```ts
  leetcode: [
    {
      title: 'Insertion Sort List',
      url: 'https://leetcode.com/problems/insertion-sort-list',
      difficulty: 'medium',
    },
    {
      title: 'Relative Sort Array',
      url: 'https://leetcode.com/problems/relative-sort-array',
      difficulty: 'easy',
    },
    {
      title: 'K Closest Points to Origin',
      url: 'https://leetcode.com/problems/k-closest-points-to-origin',
      difficulty: 'medium',
    },
  ],
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/algorithms/sorting/insertion-sort/index.ts
  git commit -m "feat(sorting): enrich insertion sort theory and leetcode problems"
  ```

---

### Task 4: Verify Build Passes

- [ ] **Step 1: Run the dev build type-check**

  ```bash
  yarn tsc --noEmit
  ```

  Expected: No TypeScript errors.

- [ ] **Step 2: Confirm app is running**

  Open `http://localhost:3000` and navigate to each of the three sorting algorithm pages. Verify the Theory panel displays the new rich content and the LeetCode section shows 3 problems.
