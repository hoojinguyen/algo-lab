# Phase 1 Sorting Algorithms Design: Basics

## Overview
This design covers the completion of Phase 1 sorting algorithms in `src/lib/algorithms/sorting`. Phase 1 includes **Bubble Sort**, **Selection Sort**, and **Insertion Sort**. The implementation focuses on updating their internal configuration entries (`AlgorithmEntry`) with deep theoretical explanations and carefully selected LeetCode problems that emphasize the underlying mechanics of each sort. 

All generators for these three algorithms are already fully implemented in the codebase, so no new visualization logic needs to be written for this phase.

## Approach
*   **Theory Style:** Practical/Interview focus. Emphasizes when to use the algorithm, real-world analogies, stability, and specific trade-offs (e.g., memory writes vs. time complexity).
*   **LeetCode Style:** Mechanics-based. Selects problems where the core mechanics (bubbling, selecting minimums, shifting/inserting) are actually useful in the optimal or alternative solutions, rather than just simple "sort the array" problems.

---

## 1. Bubble Sort (`src/lib/algorithms/sorting/bubble-sort/index.ts`)

### Theory Enhancements
*   Explain the core mechanic: repeated adjacent swapping.
*   Emphasize $O(n^2)$ time complexity.
*   Highlight the **Early Exit Optimization**: By adding a flag to check if any swaps were made in a pass, the best-case time complexity drops to $O(n)$ for an already sorted array.
*   Explain that it is **Stable** and **In-Place**.

### LeetCode Problems
1.  **Sort an Array (Medium)**
    *   *URL:* `https://leetcode.com/problems/sort-an-array`
    *   *Reasoning:* Classic sandbox. Good for proving that Bubble Sort results in TLE for large datasets.
2.  **Move Zeroes (Easy)**
    *   *URL:* `https://leetcode.com/problems/move-zeroes`
    *   *Reasoning:* Teaches the mechanics of "bubbling" specific elements (zeros) to the end of the array through adjacent swapping/shifting.
3.  **Sort Colors (Medium)**
    *   *URL:* `https://leetcode.com/problems/sort-colors`
    *   *Reasoning:* Often initially approached by beginners using multiple passes or bubble concepts before discovering the optimal 3-pointer solution.

---

## 2. Selection Sort (`src/lib/algorithms/sorting/selection-sort/index.ts`)

### Theory Enhancements
*   Explain the separation of the array into "sorted" and "unsorted" regions.
*   Highlight its defining feature: it makes a maximum of $O(n)$ swaps. This makes it the algorithm of choice when writing to memory is extremely expensive.
*   Discuss its $O(n^2)$ complexity across best, average, and worst cases.
*   Clarify why it is typically **Unstable** (swapping the minimum across identical elements).

### LeetCode Problems
1.  **Kth Largest Element in an Array (Medium)**
    *   *URL:* `https://leetcode.com/problems/kth-largest-element-in-an-array`
    *   *Reasoning:* Selecting the maximum element `k` times is the exact mechanic of Selection Sort.
2.  **Third Maximum Number (Easy)**
    *   *URL:* `https://leetcode.com/problems/third-maximum-number`
    *   *Reasoning:* Requires repeated selection scans to find distinct maximums.
3.  **Minimum Operations to Make Array Equal (Medium)**
    *   *URL:* `https://leetcode.com/problems/minimum-operations-to-make-array-equal`
    *   *Reasoning:* Good practice for analyzing state and finding target minimums/medians.

---

## 3. Insertion Sort (`src/lib/algorithms/sorting/insertion-sort/index.ts`)

### Theory Enhancements
*   Use the "sorting a hand of playing cards" analogy.
*   Emphasize its major strength: $O(n)$ time complexity on **nearly sorted** data or very small arrays.
*   Mention that modern algorithms like Timsort use Insertion Sort under the hood for small subarrays.
*   Confirm it is **Stable** and **In-Place**.

### LeetCode Problems
1.  **Insertion Sort List (Medium)**
    *   *URL:* `https://leetcode.com/problems/insertion-sort-list`
    *   *Reasoning:* The ultimate direct application, requiring pointer manipulation in a linked list using Insertion Sort mechanics.
2.  **Relative Sort Array (Easy)**
    *   *URL:* `https://leetcode.com/problems/relative-sort-array`
    *   *Reasoning:* An excellent application for inserting elements based on a custom relative ordering.
3.  **K Closest Points to Origin (Medium)**
    *   *URL:* `https://leetcode.com/problems/k-closest-points-to-origin`
    *   *Reasoning:* While solvable with a heap, maintaining a small, sorted window using insertion mechanics is a highly valid approach for streams of data.
