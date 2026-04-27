# Phase 3 Sorting Algorithms Design: Non-Comparison Sorts

## Overview

Phase 3 completes Counting Sort, Radix Sort, and Bucket Sort. All three are currently placeholder stubs. Non-comparison sorts achieve sub-O(n log n) performance by exploiting constraints on the input data (integer ranges, digit structure, uniform distribution) rather than comparing elements directly.

Each file needs: full `theory`, `code`, step-by-step `generator`, and 3 mechanics-based LeetCode problems.

---

## 1. Counting Sort (`src/lib/algorithms/sorting/counting-sort/index.ts`)

### Theory
Focus on the counting array as the core data structure. Explain that it only works on non-negative integers within a known range `[0, k]`. Complexity O(n + k) — when k is much larger than n, Counting Sort degrades. Explain why it is stable (backward iteration of the output phase). Key insight: it is the foundation Radix Sort builds on.

### Generator Strategy
Three explicit phases with yields at each:
- **Phase 1 — Count:** Yield on each element read, showing the count array building up (visualized as the main data array showing current element being read)
- **Phase 2 — Prefix Sum:** Yield on each accumulation step in the count array
- **Phase 3 — Reconstruct:** Yield on each element being placed into the output array at its computed position, showing `activeIndices` at the target position

Since visualizer only shows one `data` array, we'll show the input array with `activeIndices` during counting, and the output array filling up during reconstruction.

### LeetCode Problems
1. Sort Colors (Medium) — `https://leetcode.com/problems/sort-colors` (3-bucket counting)
2. Relative Sort Array (Easy) — `https://leetcode.com/problems/relative-sort-array`
3. Maximum Gap (Hard) — `https://leetcode.com/problems/maximum-gap` (pigeonhole principle, same idea as counting)

---

## 2. Radix Sort (`src/lib/algorithms/sorting/radix-sort/index.ts`)

### Theory
Explain LSD (Least Significant Digit) Radix Sort — sort by ones digit, then tens, then hundreds, etc. Each pass uses a stable counting sort. Complexity O(n·k) where k is the number of digits. Stable because each digit-sort sub-pass is stable. Key insight: preserving stability across digit passes is what makes the algorithm correct.

### Generator Strategy
For each digit position (ones, tens, hundreds…):
- Yield: "Processing digit position: ones/tens/hundreds…"
- Yield on each element being placed into its digit bucket (show `activeIndices` on element being bucketed)
- Yield: show array reconstructed from buckets after this digit pass
- Repeat for next digit position

### LeetCode Problems
1. Maximum Gap (Hard) — `https://leetcode.com/problems/maximum-gap`
2. Sort an Array (Medium) — `https://leetcode.com/problems/sort-an-array`
3. Largest Number (Medium) — `https://leetcode.com/problems/largest-number` (digit-ordering insight)

---

## 3. Bucket Sort (`src/lib/algorithms/sorting/bucket-sort/index.ts`)

### Theory
Explain that Bucket Sort distributes elements into a fixed number of buckets based on value ranges, sorts each bucket (typically with Insertion Sort for small buckets), then concatenates. O(n + k) average when data is uniformly distributed. Worst case O(n²) if all elements fall into one bucket. Key insight: works best with floating-point data uniformly distributed over [0, 1).

### Generator Strategy
Three phases:
- **Phase 1 — Distribute:** Yield on each element being assigned to a bucket (show `activeIndices` on the element, describe which bucket it goes to)
- **Phase 2 — Sort Buckets:** Yield on each insertion-sort comparison/swap within a bucket
- **Phase 3 — Concatenate:** Yield as each bucket's sorted elements are written back to the array

### LeetCode Problems
1. Top K Frequent Elements (Medium) — `https://leetcode.com/problems/top-k-frequent-elements` (bucket by frequency)
2. Sort Characters By Frequency (Medium) — `https://leetcode.com/problems/sort-characters-by-frequency`
3. Maximum Gap (Hard) — `https://leetcode.com/problems/maximum-gap` (uses bucket/pigeonhole to find max gap in O(n))
