# Premium UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix implementation code visibility in light mode and upgrade the array visualizer to a premium glassmorphic aesthetic.

**Architecture:** Refactor UI components to use semantic theme tokens instead of hardcoded dark-mode values, and apply modern CSS effects (backdrop-blur, gradients, glows) to visualizer elements.

**Tech Stack:** React, Tailwind CSS, Lucide (icons), CSS View Transitions.

---

### Task 1: Theme-Aware CodeBlock Refactor

**Files:**
- Modify: `src/components/ui/CodeBlock.tsx`

- [ ] **Step 1: Update CodeBlock container and header styles**

```tsx
// src/components/ui/CodeBlock.tsx
// Replace line 68-78 with:
    <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden shadow-sm transition-all hover:border-accent/30 group/code">
      <div className="flex items-center justify-between bg-bg-tertiary border-b border-border px-6 py-4">
        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
          Implementation
        </span>
        <div className="flex gap-1.5 opacity-30 group-hover/code:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
        </div>
      </div>
```

- [ ] **Step 2: Update tokenise function for adaptive syntax highlighting**

```tsx
// src/components/ui/CodeBlock.tsx
// Update lines 40-50:
  return tokens.map((t, i) => {
    let className = 'text-editorial'; // Standard readable text
    if (t.type === 'keyword') className = 'text-accent font-semibold';
    else if (t.type === 'string') className = 'text-warning';
    else if (t.type === 'number') className = 'text-success font-mono';
    else if (t.type === 'comment') className = 'text-muted italic';
    return (
      <span key={i} className={className}>
        {t.text}
      </span>
    );
  });
```

- [ ] **Step 3: Update Line Highlighting**

```tsx
// src/components/ui/CodeBlock.tsx
// Update lines 91-93:
              className={`flex gap-4 rounded-sm transition-all duration-300 ${
                isActive ? 'bg-accent/5 border-l-2 border-accent -mx-4 px-3' : '-mx-0 opacity-80 hover:opacity-100'
              }`}
```

- [ ] **Step 4: Commit CodeBlock changes**

```bash
git add src/components/ui/CodeBlock.tsx
git commit -m "feat: make CodeBlock theme-aware for light mode visibility"
```

### Task 2: Glassmorphic ArrayVisualizer

**Files:**
- Modify: `src/components/visualizers/ArrayVisualizer.tsx`

- [ ] **Step 1: Implement glassmorphic bars and premium effects**

```tsx
// src/components/visualizers/ArrayVisualizer.tsx
// Update the map loop (lines 11-30):
      {state.data.map((value, idx) => {
        const isActive = state.activeIndices.includes(idx);
        const height = `${(value / maxValue) * 100}%`;

        let barStyles = 'bg-bg-tertiary/40 backdrop-blur-sm border border-border/50';
        let glowStyles = '';
        
        if (isActive) {
          if (state.swapped) {
            barStyles = 'bg-success shadow-[0_0_15px_rgba(34,197,94,0.4)] border-success/50';
          } else {
            barStyles = 'bg-accent shadow-[0_0_15px_rgba(37,99,235,0.4)] border-accent/50';
          }
        }

        return (
          <div key={idx} className="flex flex-col items-center justify-end h-full flex-1 group relative">
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted text-[10px] font-mono font-bold tracking-tighter">
              {value}
            </div>
            <div
              className={`w-full rounded-t-lg transition-all duration-300 ease-out relative overflow-hidden ${barStyles}`}
              style={{ height }}
            >
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
            </div>
          </div>
        );
      })}
```

- [ ] **Step 2: Commit ArrayVisualizer changes**

```bash
git add src/components/visualizers/ArrayVisualizer.tsx
git commit -m "feat: enhance ArrayVisualizer with glassmorphic aesthetics"
```

### Task 3: Verification

- [ ] **Step 1: Verify Light Mode visibility**
    - Open `http://localhost:3000/sorting/bubble-sort`
    - Switch to Light Mode
    - Confirm "Implementation" block has light background and readable text.
- [ ] **Step 2: Verify Visualizer Premium Look**
    - Run the sorting algorithm.
    - Confirm bars have gradients and glass effects.
    - Confirm active elements have a soft glow.
