# Design Spec: Floating Code Companion

Improve the "Visualize" action UX by moving the implementation code to a stable, isolated floating panel during execution, resolving screen-jumping and flicker issues.

## 1. Problem Statement
The current implementation code is part of the main scrolling layout. When the algorithm runs, `scrollIntoView` triggers on the active line, causing the entire left column (and sometimes the whole page) to jump. This is disorienting and creates a poor UX.

## 2. Proposed Solution
Introduce a **Floating Code Companion** panel that overlays the visualizer area. This panel is isolated from the main page scroll and contains its own scrollable `CodeBlock`.

## 3. Features
- **Auto-Show**: Automatically appears when `isPlaying` is true.
- **Draggable**: Users can move the panel anywhere within the "Lab" (right column) area using `framer-motion`.
- **Minimizable**: A collapse button to shrink the code view while keeping the visualizer fully visible.
- **Stable UX**: `scrollIntoView` is confined to the floating panel's scroll container.
- **Premium Design**: Glassmorphic styling with backdrop blur and subtle shadows.

## 4. Technical Architecture

### New Components
- `FloatingCodePanel.tsx`: The main container for the floating UI.
  - Uses `framer-motion`'s `drag` feature.
  - Manages `isMinimized` state.
  - Renders a compact version of `CodeBlock`.

### Changes to Existing Components
- `CodeBlock.tsx`: 
  - Ensure `scrollIntoView` behavior is "safe" (e.g., handles cases where the container might not be the window).
  - Possibly add a `compact` prop to hide the header or reduce padding when in a floating context.
- `LessonPage.tsx`:
  - Integrate `FloatingCodePanel` into the right section.
  - Pass `isPlaying`, `activeLine`, and `code` to the panel.

## 5. User Interaction Flow
1. User enters an algorithm lesson.
2. User clicks "Start" in `PlaybackControls`.
3. `FloatingCodePanel` fades in at the bottom-left of the visualizer area.
4. As the algorithm steps through, the code inside the panel scrolls to the active line.
5. User can drag the panel if it's obstructing the visualizer.
6. When the algorithm finishes or is reset, the panel fades out.

## 6. Implementation Stages
1. **Foundation**: Create `FloatingCodePanel` with basic layout and glassmorphism.
2. **Mobility**: Add `framer-motion` drag and minimize logic.
3. **Integration**: Wire the panel into `LessonPage` and connect it to the playback state.
4. **Polish**: Refine animations and ensure scrolling is perfectly stable.
