# Algorithm Playback Speed Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a discrete speed control (0.5x, 1x, 2x) to the algorithm visualization playback bar.

**Architecture:** Use a `speedMultiplier` state in the `usePlayback` hook to derive the millisecond delay, and expose this state to a new button group in `PlaybackControls`.

**Tech Stack:** React (Next.js), Tailwind CSS (Vanilla CSS variants), Lucide React.

---

### Task 1: Update `usePlayback` Hook

**Files:**
- Modify: `src/hooks/usePlayback.ts`

- [ ] **Step 1: Add speedMultiplier state and derivation logic**

Update the hook to track a multiplier and derive `speedMs`.

```typescript
// src/hooks/usePlayback.ts
export function usePlayback(states: AlgorithmState[], initialSpeedMs = 500) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Derive milliseconds from multiplier
  // 1x = initialSpeedMs (500ms)
  // 0.5x = 1000ms
  // 2x = 250ms
  const speedMs = useMemo(() => initialSpeedMs / speedMultiplier, [initialSpeedMs, speedMultiplier]);
  
  // ... rest of the hook using speedMs in the interval
  
  return {
    // ...
    speedMultiplier,
    setSpeedMultiplier,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/usePlayback.ts
git commit -m "feat: add speedMultiplier to usePlayback hook"
```

---

### Task 2: Update `PlaybackControls` Component

**Files:**
- Modify: `src/components/ui/PlaybackControls.tsx`

- [ ] **Step 1: Update props and add Speed Preset UI**

Add `speedMultiplier` and `onSpeedChange` to props. Implement the button group on the right side.

```tsx
// src/components/ui/PlaybackControls.tsx
interface PlaybackControlsProps {
  // ... existing props
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  // ... existing props
  speedMultiplier,
  onSpeedChange,
}: PlaybackControlsProps) {
  const speeds = [0.5, 1, 2];

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="flex items-center gap-6">
        {/* Existing Reset, Prev, Play, Next buttons */}
      </div>

      <div className="flex items-center">
        <div className="w-px h-8 bg-border/50 mx-4" />
        <div className="flex bg-bg-tertiary/40 p-1 rounded-xl border border-border/40 backdrop-blur-sm">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                speedMultiplier === s
                  ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-secondary'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/PlaybackControls.tsx
git commit -m "feat: add speed preset buttons to PlaybackControls"
```

---

### Task 3: Integration in `LessonPage`

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Connect hook state to component**

Pass the `speedMultiplier` and its setter from `usePlayback` to `PlaybackControls`.

```tsx
// src/app/[category]/[algorithm]/page.tsx
const { 
  currentState, 
  currentIndex, 
  totalSteps, 
  isPlaying, 
  setIsPlaying, 
  next, 
  prev, 
  reset,
  speedMultiplier,
  setSpeedMultiplier 
} = usePlayback(states, 500);

// ... in the JSX
<PlaybackControls
  // ... existing props
  speedMultiplier={speedMultiplier}
  onSpeedChange={setSpeedMultiplier}
/>
```

- [ ] **Step 2: Visual Verification**

1. Run `yarn dev`
2. Navigate to an algorithm (e.g., Bubble Sort).
3. Test 0.5x (slow), 1x (normal), and 2x (fast).
4. Verify the active button is highlighted.

- [ ] **Step 3: Commit**

```bash
git add src/app/[category]/[algorithm]/page.tsx
git commit -m "feat: integrate speed control in LessonPage"
```
