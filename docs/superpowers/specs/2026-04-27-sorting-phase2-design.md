# Phase 2 Sorting Algorithms Design: Divide & Conquer / Heap

## Overview

Phase 2 completes Merge Sort, Quick Sort, and Heap Sort. Unlike Phase 1, all three generators are placeholder stubs (they call `.sort()` directly). This phase requires:

1. Full `theory` string (practical/interview focus)
2. Full `code` string (readable TypeScript)
3. Complete step-by-step `generator` with meaningful `AlgorithmState` yields
4. 3 mechanics-based LeetCode problems each

---

## 1. Merge Sort (`src/lib/algorithms/sorting/merge-sort/index.ts`)

### Theory
Practical focus on divide-and-conquer recursion, guaranteed O(n log n), external sort usage, and stability.

### Generator Strategy
Iterative top-down approach with explicit merge steps:
- Yields initial state
- For each recursive merge of left/right halves: yields with `activeIndices` set to all indices in the current merge window so the two sub-arrays are visually distinct
- During the merge phase: yields on each element placement into the merged result, showing which element was picked from left or right
- Yields final sorted state

### Code String
Full TypeScript recursive merge sort with a helper `merge()` function.

### LeetCode Problems
1. Merge Sorted Array (Easy) — `https://leetcode.com/problems/merge-sorted-array`
2. Sort List (Medium) — `https://leetcode.com/problems/sort-list`
3. Count of Smaller Numbers After Self (Hard) — `https://leetcode.com/problems/count-of-smaller-numbers-after-self`

---

## 2. Quick Sort (`src/lib/algorithms/sorting/quick-sort/index.ts`)

### Theory
Practical focus on Lomuto vs Hoare partitioning, pivot selection, worst-case O(n²) with sorted input, and average O(n log n) performance. Highlight quickselect variant.

### Generator Strategy
Lomuto partition scheme:
- Yields when a pivot is selected (last element of partition), highlighting it
- Yields on each comparison of element against pivot
- Yields on each swap during partitioning
- Yields when pivot is placed in its final sorted position
- Recursively processes left and right sub-arrays

### Code String
Full TypeScript quicksort with `partition()` helper using Lomuto scheme.

### LeetCode Problems
1. Sort an Array (Medium) — `https://leetcode.com/problems/sort-an-array`
2. Kth Largest Element in an Array (Medium) — `https://leetcode.com/problems/kth-largest-element-in-an-array`
3. Partition Array Around Pivot (Medium) — `https://leetcode.com/problems/partition-array-around-pivot`

---

## 3. Heap Sort (`src/lib/algorithms/sorting/heap-sort/index.ts`)

### Theory
Practical focus on the max-heap property, heapify operation, two-phase sort (build heap then extract), and guaranteed O(n log n) with O(1) space.

### Generator Strategy
Two explicit phases:
- **Phase 1 — Build Max-Heap:** For each internal node (n/2 down to 0), call siftDown. Yields on each comparison and swap during sift-down, with `activeIndices` marking the current node and its children.
- **Phase 2 — Extract:** Swap root (max) with last unsorted element, yield the swap, reduce heap boundary, sift-down the new root. Repeat until sorted.

### Code String
Full TypeScript heap sort with `heapify()` and `siftDown()` helpers.

### LeetCode Problems
1. Last Stone Weight (Easy) — `https://leetcode.com/problems/last-stone-weight`
2. Kth Largest Element in a Stream (Medium) — `https://leetcode.com/problems/kth-largest-element-in-a-stream`
3. Find Median from Data Stream (Hard) — `https://leetcode.com/problems/find-median-from-data-stream`
