# Design Spec: Algorithm Theory UI Improvement (B3 Premium)

Improve the readability and visual hierarchy of the algorithm theory section by implementing a structured, modern editorial design (B3).

## Goals
- Transition from a "wall of text" to a structured, scannable editorial layout.
- Eliminate raw markdown characters (like `**`) in the UI.
- Standardize the presentation of complexity, stability, and interview insights.
- Ensure the design is applied consistently across all algorithm lessons.

## Architecture & Components

### 1. Data Structure Enhancement
While we want to reuse the existing `theory` string where possible, we will create a `TheoryParser` utility to extract structured components from the current string format:
- **Lead Paragraph**: The first paragraph describing the algorithm.
- **Sections**: Labeled blocks (e.g., "Time Complexity", "Space Complexity").
- **Interview Insight**: The "Key Interview Insight" block usually found at the end.

### 2. New Components
- **`TheoryPanel`**: The main container in `LessonPage` (refactoring the left column).
- **`ComplexityPills`**: Renders the complexity badges (Best, Avg, Worst, Space, Stability).
- **`TheorySection`**: Renders a labeled section (Heading + Body).
- **`InterviewCallout`**: A clean, bordered block for the interview insight.

## Visual Design (B3)
- **Typography**: Large bold titles (`text-3xl` or `text-4xl`), monospace complexity values.
- **Color Palette**: 
  - `success`: Green for Best case / Stable.
  - `warning`: Yellow for Average case.
  - `error`: Red for Worst case.
  - `text-muted`: For space complexity and secondary labels.
- **Layout**: 
  - Kicker (Category) above the title.
  - Horizontal pill row for complexity.
  - Lead paragraph with increased line height.
  - Labeled sections with clear visual separation.
  - Bordered "Interview Insight" block at the bottom.

## Implementation Details
1. **Utility**: `src/lib/utils/theory-parser.ts` to split the `theory` string based on `\n\n` and identify sections via `**Header:**` patterns.
2. **Refactor**: Update `src/app/[category]/[algorithm]/page.tsx` to use the new components instead of the raw `<p>{currentEntry.theory}</p>`.
3. **Styling**: Use the project's CSS variables (`--bg-secondary`, `--text-primary`, etc.) to ensure theme support (Dark/Light mode).

## Testing & Verification
- Verify all sorting algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap) render correctly.
- Ensure responsiveness on different screen widths.
- Confirm Dark/Light mode consistency.
