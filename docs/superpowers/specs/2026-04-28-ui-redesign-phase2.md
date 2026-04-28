# Design Spec: Premium Code & Visualization Redesign

Enhance the visual quality and accessibility of the AlgoLab platform by fixing code visibility issues and implementing a high-end visual style for animations.

## Goals
- Resolve the "invisible code" issue in light mode by making the `CodeBlock` theme-aware.
- Transition the `ArrayVisualizer` from simple bars to a premium glassmorphic aesthetic.
- Ensure all interactive elements feel responsive and "alive" through subtle animations and shadows.

## 1. Theme-Aware Editorial Code Block

### Changes to `CodeBlock.tsx`
- **Container Styling**:
    - Remove hardcoded `bg-zinc-950`.
    - Use `bg-bg-secondary` for the main container and `bg-bg-tertiary` for the header.
    - Add a 1px border using `border-border` that transitions to `border-accent/30` on hover.
- **Syntax Highlighting**:
    - Update `tokenise` function to use semantic text classes:
        - Keywords: `text-accent` (already adaptive).
        - Strings: `text-warning`.
        - Numbers: `text-success`.
        - Comments: `text-muted` (italic).
        - Plain: `text-editorial`.
- **Active Line**:
    - Keep the `bg-accent/10` and `border-accent` highlighting for the current step.

## 2. Glassmorphic Array Visualizer

### Changes to `ArrayVisualizer.tsx`
- **Bar Aesthetics**:
    - **Background**: Use a semi-transparent `bg-bg-tertiary/40` with `backdrop-filter: blur(8px)`.
    - **Gradients**: Apply a subtle linear gradient from top to bottom (e.g., `bg-gradient-to-b from-white/10 to-transparent`).
    - **Borders**: Add a very thin `border border-white/10` for definition.
    - **Corners**: Increase top corner radius to `rounded-t-lg`.
- **Dynamic States**:
    - **Active**: Use a vibrant `bg-accent` with a soft outer glow (`shadow-[0_0_15px_rgba(37,99,235,0.3)]`).
    - **Swapped**: Use `bg-success` with a similar glow effect.
- **Animations**:
    - Maintain existing `duration-300 ease-out` for height changes.
    - Ensure width transitions are smooth when the array size changes.

## Verification Plan
1. **Light Mode Check**: Open any algorithm page in Light Mode and verify implementation code is perfectly readable.
2. **Visualizer Audit**: Run a sorting algorithm and verify:
    - Bars have a "glass" appearance.
    - Active indices have a distinct, premium glow.
    - Swaps are visually clear and satisfying.
