# Phase 4 AI/ML Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the foundation for Phase 4 AI/ML algorithms, introducing the ScatterVisualizer and the Linear Regression algorithm.

**Architecture:** Extend global types with `ScatterAlgorithmState` and `MLGeneratorInput`. Implement a high-performance Canvas-based `ScatterVisualizer` for rendering 2D data points and regression lines. Implement `linearRegressionGenerator` using iterative gradient descent. Update `LessonPage` to support ML hyperparameters and iteration-based playback.

**Tech Stack:** React, TypeScript, Next.js, HTML5 Canvas

---

### Task 1: Add Base Data Models and Category

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/algorithms/categories.ts`

- [ ] **Step 1: Add AI/ML types to `src/lib/types.ts`**

Append the following interfaces to the file before `export type AlgorithmState =`:

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

- [ ] **Step 2: Update union types in `src/lib/types.ts`**

Update `AlgorithmState` to include `ScatterAlgorithmState` and update `VisualizerType` to include `'scatter'`:

```typescript
export type AlgorithmState =
  | ArrayAlgorithmState
  | GraphAlgorithmState
  | TreeAlgorithmState
  | LinkedListAlgorithmState
  | MatrixAlgorithmState
  | ScatterAlgorithmState;

export type VisualizerType = 'array' | 'graph' | 'tree' | 'matrix' | 'scatter' | 'linked-list';
```

- [ ] **Step 3: Register AI/ML category in `src/lib/algorithms/categories.ts`**

Add the `ai-ml` category to the `CATEGORIES` array:

```typescript
  { id: 'ai-ml', name: 'AI / Machine Learning', section: 'intelligence', icon: 'Brain', description: 'Fundamental machine learning algorithms' },
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/algorithms/categories.ts
git commit -m "feat: add Phase 4 AI/ML base data models and category"
```

### Task 2: Implement Linear Regression Generator

**Files:**
- Create: `src/lib/algorithms/ai-ml/linear-regression/index.ts`
- Create: `src/lib/algorithms/ai-ml/linear-regression/index.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/algorithms/ai-ml/linear-regression/index.test.ts`:

```typescript
import { linearRegressionGenerator } from './index';
import { ScatterAlgorithmState } from '@/lib/types';

describe('linearRegressionGenerator', () => {
  it('should converge towards a best fit line', () => {
    const points = [
      { id: '1', x: 1, y: 2 },
      { id: '2', x: 2, y: 4 },
      { id: '3', x: 3, y: 6 }
    ];
    const generator = linearRegressionGenerator({ points, hyperparameters: { learningRate: 0.01, maxIterations: 10 } });
    
    const states: ScatterAlgorithmState[] = [];
    for (let state of generator) {
      states.push(state as ScatterAlgorithmState);
    }
    
    expect(states.length).toBeGreaterThan(0);
    const lastState = states[states.length - 1];
    expect(lastState.iteration).toBe(10);
    expect(lastState.regressionLine).toBeDefined();
    // slope should be positive
    expect(lastState.regressionLine!.slope).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/algorithms/ai-ml/linear-regression/index.test.ts`
Expected: FAIL with "Cannot find module './index'"

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/algorithms/ai-ml/linear-regression/index.ts`:

```typescript
import { AlgorithmEntry, ScatterAlgorithmState, MLGeneratorInput } from '@/lib/types';

export const linearRegressionGenerator = function* (input: MLGeneratorInput): Generator<ScatterAlgorithmState> {
  const { points } = input;
  const learningRate = input.hyperparameters.learningRate || 0.01;
  const maxIterations = input.hyperparameters.maxIterations || 100;
  
  let m = 0; // slope
  let b = 0; // intercept
  const n = points.length;
  const costHistory: number[] = [];
  
  yield {
    step: 0,
    description: "Initialize random weights (slope=0, intercept=0)",
    codeLine: 1,
    points,
    regressionLine: { slope: m, intercept: b },
    iteration: 0,
    totalIterations: maxIterations,
    costHistory: [...costHistory]
  };

  for (let iter = 1; iter <= maxIterations; iter++) {
    let errorSum = 0;
    let mGradient = 0;
    let bGradient = 0;
    
    for (let i = 0; i < n; i++) {
      const x = points[i].x;
      const y = points[i].y;
      const guess = m * x + b;
      const error = guess - y;
      
      errorSum += error * error;
      mGradient += (2 / n) * x * error;
      bGradient += (2 / n) * error;
    }
    
    const cost = errorSum / n;
    costHistory.push(cost);
    
    m = m - (learningRate * mGradient);
    b = b - (learningRate * bGradient);
    
    yield {
      step: iter,
      description: \`Epoch \${iter}: Cost = \${cost.toFixed(4)}. Updated slope=\${m.toFixed(2)}, intercept=\${b.toFixed(2)}\`,
      codeLine: 5,
      points,
      regressionLine: { slope: m, intercept: b },
      iteration: iter,
      totalIterations: maxIterations,
      costHistory: [...costHistory]
    };
  }
};

export const linearRegressionEntry: AlgorithmEntry = {
  id: 'linear-regression',
  name: 'Linear Regression',
  category: 'ai-ml',
  complexity: {
    best: 'O(n)',
    average: 'O(n × iter)',
    worst: 'O(n × iter)',
    space: 'O(1)'
  },
  stable: true,
  visualizerType: 'scatter',
  tags: ['machine-learning', 'regression'],
  theory: 'Linear Regression fits a straight line to a set of data points by minimizing the mean squared error. It uses gradient descent to iteratively update the slope and intercept.',
  code: \`function linearRegression(points, lr, epochs) {
  let m = 0, b = 0;
  let n = points.length;
  for (let epoch = 0; epoch < epochs; epoch++) {
    let mGrad = 0, bGrad = 0;
    for (let i = 0; i < n; i++) {
      let x = points[i].x, y = points[i].y;
      let guess = m * x + b;
      let error = guess - y;
      mGrad += (2/n) * x * error;
      bGrad += (2/n) * error;
    }
    m -= lr * mGrad;
    b -= lr * bGrad;
  }
  return { m, b };
}\`,
  generator: linearRegressionGenerator as any,
  leetcode: []
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/algorithms/ai-ml/linear-regression/index.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/algorithms/ai-ml
git commit -m "feat: implement linear regression generator and entry"
```

### Task 3: Implement ScatterVisualizer Component

**Files:**
- Create: `src/components/visualizers/ScatterVisualizer.tsx`
- Modify: `src/components/visualizers/VisualizerPanel.tsx`

- [ ] **Step 1: Create ScatterVisualizer.tsx**

Create `src/components/visualizers/ScatterVisualizer.tsx`:

```tsx
import React, { useEffect, useRef } from 'react';
import { ScatterAlgorithmState } from '@/lib/types';

interface ScatterVisualizerProps {
  state: ScatterAlgorithmState;
}

export const ScatterVisualizer: React.FC<ScatterVisualizerProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine bounds
    let minX = 0, maxX = 10, minY = 0, maxY = 10;
    if (state.points.length > 0) {
      minX = Math.min(...state.points.map(p => p.x)) - 1;
      maxX = Math.max(...state.points.map(p => p.x)) + 1;
      minY = Math.min(...state.points.map(p => p.y)) - 1;
      maxY = Math.max(...state.points.map(p => p.y)) + 1;
    }

    // Coordinate mapping
    const mapX = (x: number) => ((x - minX) / (maxX - minX)) * canvas.width;
    const mapY = (y: number) => canvas.height - ((y - minY) / (maxY - minY)) * canvas.height;

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = Math.floor(minX); i <= Math.ceil(maxX); i++) {
      ctx.moveTo(mapX(i), 0);
      ctx.lineTo(mapX(i), canvas.height);
    }
    for (let i = Math.floor(minY); i <= Math.ceil(maxY); i++) {
      ctx.moveTo(0, mapY(i));
      ctx.lineTo(canvas.width, mapY(i));
    }
    ctx.stroke();

    // Draw points
    state.points.forEach(p => {
      ctx.beginPath();
      ctx.arc(mapX(p.x), mapY(p.y), 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#60A5FA';
      ctx.fill();
      ctx.strokeStyle = '#2563EB';
      ctx.stroke();
    });

    // Draw regression line
    if (state.regressionLine) {
      const { slope, intercept } = state.regressionLine;
      const x1 = minX;
      const y1 = slope * x1 + intercept;
      const x2 = maxX;
      const y2 = slope * x2 + intercept;
      
      ctx.beginPath();
      ctx.moveTo(mapX(x1), mapY(y1));
      ctx.lineTo(mapX(x2), mapY(y2));
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [state]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="bg-bg-tertiary border border-border rounded-lg shadow-sm"
      />
      {state.costHistory && state.costHistory.length > 0 && (
        <div className="absolute top-8 right-8 bg-bg-primary border border-border p-3 rounded text-xs font-mono shadow-md">
          <p className="text-text-secondary mb-1">Cost (MSE)</p>
          <p className="text-error font-bold">{state.costHistory[state.costHistory.length - 1].toFixed(4)}</p>
          <p className="text-text-muted mt-2">Epoch {state.iteration} / {state.totalIterations}</p>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Register in VisualizerPanel**

Modify `src/components/visualizers/VisualizerPanel.tsx` to include `ScatterVisualizer`:

Add the import:
```tsx
import { ScatterVisualizer } from './ScatterVisualizer';
```

Add the switch case inside `VisualizerPanel`:
```tsx
    case 'scatter':
      return <ScatterVisualizer state={state as any} />;
```

- [ ] **Step 3: Commit**

```bash
git add src/components/visualizers
git commit -m "feat: add ScatterVisualizer component for ML algorithms"
```

### Task 4: Wire up the App Registry and ML Inputs

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Update the registry and mock data**

Modify `src/app/[category]/[algorithm]/page.tsx` to include `linear-regression`:

Add imports:
```tsx
import { linearRegressionEntry } from '@/lib/algorithms/ai-ml/linear-regression';
```

Update registry:
```tsx
const registry: Record<string, any> = {
  'bubble-sort': bubbleSortEntry,
  'linear-regression': linearRegressionEntry
};
```

- [ ] **Step 2: Pass mock data point input for AI algorithms**

In `LessonPage`, add `initialPoints` array:

```tsx
  const initialArray = useMemo(() => [9, 14, 5, 11, 3, 22, 1, 8], []);
  
  const initialPoints = useMemo(() => [
    { id: '1', x: 1, y: 1.5 },
    { id: '2', x: 2, y: 3.8 },
    { id: '3', x: 3, y: 3.2 },
    { id: '4', x: 4, y: 6.5 },
    { id: '5', x: 5, y: 5.9 },
    { id: '6', x: 6, y: 8.1 },
    { id: '7', x: 7, y: 9.5 }
  ], []);
```

Update `states` generation to use `MLGeneratorInput` format if the category is `ai-ml`:

```tsx
  const states = useMemo(() => {
    if (!entry) return [];
    let generator;
    
    if (entry.category === 'ai-ml') {
      generator = entry.generator({ 
        points: initialPoints, 
        hyperparameters: { learningRate: 0.01, maxIterations: 50 } 
      });
    } else {
      generator = entry.generator(initialArray);
    }
    
    const result = [];
    for (let state of generator) {
      result.push(state);
    }
    return result;
  }, [entry, initialArray, initialPoints]);
```

- [ ] **Step 3: Verify the changes**

Run: `npm run dev`
Visit: `http://localhost:3000/ai-ml/linear-regression`
Expected: Linear regression visually plots points and iterates 50 times showing cost function decreasing.

- [ ] **Step 4: Commit**

```bash
git add src/app/[category]/[algorithm]/page.tsx
git commit -m "feat: wire up linear regression to main page"
```
