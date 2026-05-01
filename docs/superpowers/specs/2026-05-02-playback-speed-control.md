# Design Spec: Algorithm Playback Speed Control

Adding discrete speed presets to the algorithm visualization lab to allow users to adjust the learning pace.

## 1. User Experience

- **Control Type**: Discrete button presets (0.5x, 1x, 2x).
- **Placement**: Integrated into the right side of the `PlaybackControls` bar.
- **Visual Feedback**: The active speed multiplier is highlighted with the system accent color and a subtle glow.
- **Responsiveness**: Smoothly transitions between speeds without interrupting active playback.

## 2. Technical Architecture

### Speed Mapping
- **0.5x**: 1000ms delay per step.
- **1x**: 500ms delay per step (Default).
- **2x**: 250ms delay per step.

### Component Updates
1.  **`usePlayback` Hook**:
    - Add a `speedMultiplier` state (0.5, 1, or 2).
    - Ensure the internal `speedMs` calculation updates when the multiplier changes.
2.  **`PlaybackControls` Component**:
    - New Prop: `speedMultiplier: number`
    - New Prop: `onSpeedChange: (speed: number) => void`
    - Add a `ButtonGroup` with three options.
    - Implement glassmorphic styling for the buttons.
3.  **`LessonPage` Component**:
    - Wire the state from `usePlayback` into `PlaybackControls`.

## 3. Visual Design (Option A)

The controls will be separated from the primary playback buttons by a vertical divider to maintain visual hierarchy.

```tsx
// Example structure
<div className="flex items-center gap-6">
  {/* Playback Buttons (Reset, Prev, Play, Next) */}
  <div className="w-px h-8 bg-border mx-2" />
  <div className="flex bg-bg-tertiary/50 p-1 rounded-lg border border-border/50">
    {speeds.map(s => (
      <button key={s} className={s === current ? 'bg-accent shadow-sm' : ''}>
        {s}x
      </button>
    ))}
  </div>
</div>
```

## 4. Success Criteria

- Users can switch speeds during playback.
- The UI clearly indicates the currently selected speed.
- Reaching the end of the algorithm or resetting it maintains the selected speed.
