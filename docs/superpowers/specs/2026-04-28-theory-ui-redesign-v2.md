# Design Specification: Modern Theory UI Redesign (v2)

Modernizing the algorithm theory UI by focusing on cohesive layouts, high-contrast typography, and a professional "Modern Sidebar" aesthetic for interview insights and code blocks.

## 1. Objectives

*   **Cohesive Flow**: Eliminate the "boxed" and disconnected feeling between theory sections, interview insights, and implementation code.
*   **Modern Professionalism**: Achieve a "clean and friendly" look without icons or emojis.
*   **Enhanced Readability**: Increase font sizes and contrast to ensure a premium reading experience.
*   **Unified Styling**: Align the `TheoryPanel` and `CodeBlock` components into a single visual language.

## 2. Component Refinements

### 2.1 TheoryPanel (`src/components/ui/TheoryPanel.tsx`)
*   **Typography**:
    *   Increase base content font size to `text-base` (16px) or `text-[15px]`.
    *   Increase line height for better breathing room.
*   **Interview Insight**:
    *   **Old**: Dark card with gray border and pulse dot.
    *   **New**: "Editorial Sidebar" style. Use `border-l-4 border-blue-500` with a very subtle background tint (`bg-blue-500/5`).
    *   **Label**: Use a clean, bold label (`INTERVIEW INSIGHT`) in blue uppercase text.
    *   **Placement**: Ensure it leads naturally into the implementation block.

### 2.2 Complexity Pills
*   **Shape**: Change to fully rounded or soft-rounded (`rounded-full` or `rounded-lg`).
*   **Colors**: Use softer, more sophisticated background colors (e.g., `emerald-500/10` instead of sharp `bg-emerald-400/10`).
*   **Typography**: Use `font-semibold` instead of `font-bold` for a cleaner look.

### 2.3 CodeBlock (`src/components/ui/CodeBlock.tsx`)
*   **Header**: 
    *   Remove the three-dot macOS window decorations.
    *   Simplify the header to a clean title (`IMPLEMENTATION`) that matches the `TheoryPanel` section headings.
*   **Borders**: 
    *   Use a more subtle border (`zinc-800/50`) to avoid "double-border" effects when stacked near other components.
*   **Active Line**: Retain the current active line highlighting but ensure the contrast works with the new color palette.

## 3. Layout Strategy

*   **Left Column (`page.tsx`)**:
    *   Reduce the padding between `TheoryPanel` and `CodeBlock` to create a unified "Learning Card" feel.
    *   The `Interview Insight` will act as the bridge between the theory sections and the code.
*   **Color Palette**:
    *   Primary: `Blue-500` (Accents)
    *   Background: `Zinc-950` (Main), `Zinc-900` (Secondary)
    *   Text: `Zinc-100` (Headings), `Zinc-300` (Lead), `Zinc-400` (Content)

## 4. Technical Implementation

*   Modify `src/components/ui/TheoryPanel.tsx` to implement the new "Sidebar Note" style.
*   Modify `src/components/ui/CodeBlock.tsx` to simplify the header and borders.
*   Adjust `src/app/[category]/[algorithm]/page.tsx` margins if necessary to ensure perfect vertical rhythm.

## 5. Success Criteria

*   The user "wows" at the new cohesive look.
*   No icons or emojis are used.
*   The UI feels "light" and "airy" despite being in dark mode.
*   "Interview Insight" feels like a premium tip, not a bulky distraction.
