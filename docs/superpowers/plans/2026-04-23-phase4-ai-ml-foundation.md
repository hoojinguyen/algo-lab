# Phase 4: AI/ML Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the type system, ScatterVisualizer component, and category registration needed for AI/ML algorithms.

**Architecture:** Extend the discriminated union in `types.ts` with `ScatterAlgorithmState`. Build a Canvas-based `ScatterVisualizer` component. Register the `ai-ml` category. Wire into `VisualizerPanel` factory.

**Tech Stack:** Next.js 16, React 19, TypeScript, Canvas API, Framer Motion

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/lib/types.ts` | Add `DataPoint`, `Centroid`, `BoundaryLine`, `ScatterAlgorithmState`, `MLGeneratorInput`, update union |
| `src/components/visualizers/ScatterVisualizer.tsx` | Canvas-based 2D scatter plot renderer |
| `src/components/visualizers/VisualizerPanel.tsx` | Add `scatter` case to factory switch |
| `src/lib/algorithms/categories.ts` | Register `ai-ml` category |
| `src/lib/algorithms/__tests__/scatterTypes.test.ts` | Type and shape validation tests |
| `src/components/visualizers/__tests__/ScatterVisualizer.test.tsx` | Component render tests |

---

### Task 1: Add Scatter Types to Type System

**Files:**
- Modify: `src/lib/types.ts`
- Create: `src/lib/algorithms/__tests__/scatterTypes.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/algorithms/__tests__/scatterTypes.test.ts`:

```typescript
import {
  DataPoint,
  Centroid,
  BoundaryLine,
  ScatterAlgorithmState,
  AlgorithmState,
} from '@/lib/types';

describe('ScatterAlgorithmState', () => {
  it('satisfies the AlgorithmState union', () => {
    const state: ScatterAlgorithmState = {
      step: 0,
      description: 'Initial state',
      points: [
        { id: 'p1', x: 1.5, y: 2.3, label: 0 },
        { id: 'p2', x: 3.1, y: 4.7, label: 1 },
      ],
      iteration: 0,
      totalIterations: 100,
    };

    const unionState: AlgorithmState = state;
    expect(unionState.step).toBe(0);
    expect(state.points).toHaveLength(2);
    expect(state.points[0].x).toBe(1.5);
  });

  it('supports optional fields', () => {
    const state: ScatterAlgorithmState = {
      step: 5,
      description: 'With optionals',
      points: [{ id: 'p1', x: 0, y: 0 }],
      iteration: 5,
      totalIterations: 50,
      centroids: [{ id: 'c1', x: 2, y: 3, clusterId: 0 }],
      regressionLine: { slope: 1.5, intercept: 0.3 },
      boundaries: [{ type: 'linear', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }], color: '#ff0000' }],
      weights: [0.5, -0.3],
      costHistory: [10, 8, 5, 3],
      highlightedPoints: ['p1'],
    };

    expect(state.centroids).toHaveLength(1);
    expect(state.regressionLine?.slope).toBe(1.5);
    expect(state.boundaries?.[0].type).toBe('linear');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/algorithms/__tests__/scatterTypes.test.ts --no-cache`
Expected: FAIL — `DataPoint`, `Centroid`, `BoundaryLine`, `ScatterAlgorithmState` not exported from `@/lib/types`

- [ ] **Step 3: Add types to types.ts**

Add the following interfaces to `src/lib/types.ts`, **before** the existing `AlgorithmState` union type (before line 120):

```typescript
export interface DataPoint {
  id: string;
  x: number;
  y: number;
  label?: number;
  predictedLabel?: number;
  isCorrect?: boolean;
}

export interface Centroid {
  id: string;
  x: number;
  y: number;
  clusterId: number;
  previousX?: number;
  previousY?: number;
}

export interface BoundaryLine {
  type: 'linear' | 'curve';
  points: { x: number; y: number }[];
  color: string;
}

export interface ScatterAlgorithmState extends BaseAlgorithmState {
  points: DataPoint[];
  boundaries?: BoundaryLine[];
  centroids?: Centroid[];
  regressionLine?: { slope: number; intercept: number };
  costHistory?: number[];
  iteration: number;
  totalIterations: number;
  weights?: number[];
  highlightedPoints?: string[];
}
```

Then update the `AlgorithmState` union to include `ScatterAlgorithmState`:

```typescript
export type AlgorithmState =
  | ArrayAlgorithmState
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState
  | MatrixAlgorithmState
  | ScatterAlgorithmState;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/algorithms/__tests__/scatterTypes.test.ts --no-cache`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/algorithms/__tests__/scatterTypes.test.ts
git commit -m "feat(types): add ScatterAlgorithmState and related interfaces"
```

---

### Task 2: Register AI/ML Category

**Files:**
- Modify: `src/lib/algorithms/categories.ts`

- [ ] **Step 1: Add the ai-ml category**

Add to the end of the `CATEGORIES` array in `src/lib/algorithms/categories.ts` (before the closing `];`):

```typescript
  { id: 'ai-ml', name: 'AI / Machine Learning', section: 'intelligence', icon: 'Brain', description: 'Fundamental machine learning algorithms visualized as iterative learning processes' },
```

- [ ] **Step 2: Verify the app still builds**

Run: `npx jest --no-cache`
Expected: All existing tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/algorithms/categories.ts
git commit -m "feat(registry): add ai-ml category"
```

---

### Task 3: Build ScatterVisualizer Component

**Files:**
- Create: `src/components/visualizers/ScatterVisualizer.tsx`
- Create: `src/components/visualizers/__tests__/ScatterVisualizer.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/visualizers/__tests__/ScatterVisualizer.test.tsx`:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScatterVisualizer } from '../ScatterVisualizer';
import { ScatterAlgorithmState } from '@/lib/types';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    setLineDash: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
    save: jest.fn(),
    restore: jest.fn(),
    closePath: jest.fn(),
    set fillStyle(_v: string) {},
    set strokeStyle(_v: string) {},
    set lineWidth(_v: number) {},
    set font(_v: string) {},
    set globalAlpha(_v: number) {},
    set textAlign(_v: string) {},
    set textBaseline(_v: string) {},
  })) as any;
});

describe('ScatterVisualizer', () => {
  const baseState: ScatterAlgorithmState = {
    step: 0,
    description: 'Test state',
    points: [
      { id: 'p1', x: 1, y: 2, label: 0 },
      { id: 'p2', x: 3, y: 4, label: 1 },
    ],
    iteration: 0,
    totalIterations: 10,
  };

  it('renders a canvas element', () => {
    const { container } = render(<ScatterVisualizer state={baseState} />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('displays iteration counter', () => {
    render(<ScatterVisualizer state={baseState} />);
    expect(screen.getByText(/Epoch 0 \/ 10/)).toBeTruthy();
  });

  it('renders with regression line data', () => {
    const stateWithLine: ScatterAlgorithmState = {
      ...baseState,
      regressionLine: { slope: 1.5, intercept: 0.5 },
    };
    const { container } = render(<ScatterVisualizer state={stateWithLine} />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('renders with centroids', () => {
    const stateWithCentroids: ScatterAlgorithmState = {
      ...baseState,
      centroids: [{ id: 'c1', x: 2, y: 3, clusterId: 0 }],
    };
    const { container } = render(<ScatterVisualizer state={stateWithCentroids} />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/visualizers/__tests__/ScatterVisualizer.test.tsx --no-cache`
Expected: FAIL — `ScatterVisualizer` module not found

- [ ] **Step 3: Implement ScatterVisualizer**

Create `src/components/visualizers/ScatterVisualizer.tsx`:

```tsx
'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { ScatterAlgorithmState } from '@/lib/types';

interface ScatterVisualizerProps {
  state: ScatterAlgorithmState;
}

const CLASS_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#ec4899'];
const PADDING = 50;

export const ScatterVisualizer: React.FC<ScatterVisualizerProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bounds = useMemo(() => {
    if (state.points.length === 0) return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    const xs = state.points.map(p => p.x);
    const ys = state.points.map(p => p.y);
    const pad = 1;
    return {
      minX: Math.min(...xs) - pad,
      maxX: Math.max(...xs) + pad,
      minY: Math.min(...ys) - pad,
      maxY: Math.max(...ys) + pad,
    };
  }, [state.points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const plotW = w - PADDING * 2;
    const plotH = h - PADDING * 2;

    const toCanvasX = (x: number) => PADDING + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * plotW;
    const toCanvasY = (y: number) => h - PADDING - ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * plotH;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const gx = PADDING + (plotW / 5) * i;
      const gy = PADDING + (plotH / 5) * i;
      ctx.beginPath(); ctx.moveTo(gx, PADDING); ctx.lineTo(gx, h - PADDING); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PADDING, gy); ctx.lineTo(w - PADDING, gy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PADDING, h - PADDING); ctx.lineTo(w - PADDING, h - PADDING); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PADDING, PADDING); ctx.lineTo(PADDING, h - PADDING); ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const valX = bounds.minX + ((bounds.maxX - bounds.minX) / 5) * i;
      ctx.fillText(valX.toFixed(1), PADDING + (plotW / 5) * i, h - PADDING + 18);
      const valY = bounds.minY + ((bounds.maxY - bounds.minY) / 5) * i;
      ctx.textAlign = 'right';
      ctx.fillText(valY.toFixed(1), PADDING - 8, h - PADDING - (plotH / 5) * i + 4);
      ctx.textAlign = 'center';
    }

    // Boundaries
    if (state.boundaries) {
      for (const boundary of state.boundaries) {
        ctx.strokeStyle = boundary.color;
        ctx.lineWidth = 2;
        ctx.setLineDash(boundary.type === 'curve' ? [6, 4] : []);
        ctx.beginPath();
        boundary.points.forEach((pt, i) => {
          const cx = toCanvasX(pt.x);
          const cy = toCanvasY(pt.y);
          if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Regression line
    if (state.regressionLine) {
      const { slope, intercept } = state.regressionLine;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(bounds.minX), toCanvasY(slope * bounds.minX + intercept));
      ctx.lineTo(toCanvasX(bounds.maxX), toCanvasY(slope * bounds.maxX + intercept));
      ctx.stroke();
    }

    // Data points
    const highlighted = new Set(state.highlightedPoints ?? []);
    for (const point of state.points) {
      const cx = toCanvasX(point.x);
      const cy = toCanvasY(point.y);
      const color = CLASS_COLORS[point.label ?? 0] ?? CLASS_COLORS[0];
      const radius = highlighted.has(point.id) ? 10 : 6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = highlighted.has(point.id) ? 1 : 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (point.isCorrect === false) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Centroids
    if (state.centroids) {
      for (const centroid of state.centroids) {
        const cx = toCanvasX(centroid.x);
        const cy = toCanvasY(centroid.y);
        const color = CLASS_COLORS[centroid.clusterId] ?? '#ffffff';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8); ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    // Cost history inset
    if (state.costHistory && state.costHistory.length > 1) {
      const insetW = 120;
      const insetH = 60;
      const insetX = w - PADDING - insetW;
      const insetY = PADDING;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(insetX, insetY, insetW, insetH);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Cost', insetX + 4, insetY + 10);
      const maxCost = Math.max(...state.costHistory);
      const minCost = Math.min(...state.costHistory);
      const range = maxCost - minCost || 1;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      state.costHistory.forEach((cost, i) => {
        const px = insetX + 4 + ((insetW - 8) / (state.costHistory!.length - 1)) * i;
        const py = insetY + 14 + (insetH - 18) * (1 - (cost - minCost) / range);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }, [state, bounds]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-bg-tertiary border border-border rounded text-xs font-mono text-text-muted">
        Epoch {state.iteration} / {state.totalIterations}
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/components/visualizers/__tests__/ScatterVisualizer.test.tsx --no-cache`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/visualizers/ScatterVisualizer.tsx src/components/visualizers/__tests__/ScatterVisualizer.test.tsx
git commit -m "feat(visualizer): add Canvas-based ScatterVisualizer component"
```

---

### Task 4: Wire ScatterVisualizer into VisualizerPanel

**Files:**
- Modify: `src/components/visualizers/VisualizerPanel.tsx`

- [ ] **Step 1: Update VisualizerPanel**

Replace the entire contents of `src/components/visualizers/VisualizerPanel.tsx` with:

```typescript
import { AlgorithmState, VisualizerType, ArrayAlgorithmState, GraphAlgorithmState, TreeAlgorithmState, LinkedListAlgorithmState, MatrixAlgorithmState, ScatterAlgorithmState } from '@/lib/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { ScatterVisualizer } from './ScatterVisualizer';

interface VisualizerPanelProps {
  type: VisualizerType;
  state: AlgorithmState;
}

export function VisualizerPanel({ type, state }: VisualizerPanelProps) {
  switch (type) {
    case 'array':
      return <ArrayVisualizer state={state as ArrayAlgorithmState} />;
    case 'graph':
      return <GraphVisualizer state={state as GraphAlgorithmState} />;
    case 'tree':
      return <TreeVisualizer state={state as TreeAlgorithmState} />;
    case 'linked-list':
      return <LinkedListVisualizer state={state as LinkedListAlgorithmState} />;
    case 'matrix':
      return <MatrixVisualizer state={state as MatrixAlgorithmState} />;
    case 'scatter':
      return <ScatterVisualizer state={state as ScatterAlgorithmState} />;
    default:
      return <div className="text-text-muted">Unsupported visualizer type: {type}</div>;
  }
}
```

- [ ] **Step 2: Run all tests**

Run: `npx jest --no-cache`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/visualizers/VisualizerPanel.tsx
git commit -m "feat(visualizer): wire ScatterVisualizer into VisualizerPanel factory"
```

---

### Task 5: Add MLGeneratorInput Type

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add MLGeneratorInput**

Add at the end of `src/lib/types.ts`:

```typescript
export interface MLGeneratorInput {
  points: DataPoint[];
  hyperparameters: {
    learningRate?: number;
    k?: number;
    maxIterations?: number;
    seed?: number;
  };
}
```

- [ ] **Step 2: Run all tests**

Run: `npx jest --no-cache`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(types): add MLGeneratorInput interface for ML algorithm generators"
```

---

## Follow-Up Plans

After this foundation, individual algorithms need separate plans:

1. **Plan B — Linear Regression + Gradient Descent** (share cost visualization)
2. **Plan C — KNN + K-Means** (share distance/centroid logic)
3. **Plan D — Perceptron + Naive Bayes + Decision Tree** (classification)
