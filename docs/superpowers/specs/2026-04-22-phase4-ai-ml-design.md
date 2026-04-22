# AlgoLab Phase 4 — AI / Machine Learning

**Date:** 2026-04-22
**Status:** Designed (not yet planned for implementation)
**Depends on:** Phase 3 complete
**Scope:** 7 algorithms, 1 category, 1 new visualizer type

## 1. Overview

Phase 4 introduces fundamental AI/ML algorithms — the most visually distinctive category. These algorithms operate on 2D data points rather than arrays or graphs, requiring the ScatterVisualizer for coordinate-plane rendering. The learning experience shifts from "step through code" to "watch the model learn" — iterations over data rather than single-pass algorithms.

## 2. Algorithms

| Algorithm | Visualizer | Training Complexity | Key Concept |
|-----------|-----------|-------------------|-------------|
| Linear Regression | scatter | O(n × iterations) | Gradient descent fitting a line to data points |
| K-Nearest Neighbors | scatter | O(1) train / O(n) predict | Distance-based classification by neighbor voting |
| K-Means Clustering | scatter | O(n × k × iterations) | Iterative centroid repositioning to form clusters |
| Decision Tree | tree + scatter | O(n × features × depth) | Recursive feature splitting for classification |
| Gradient Descent | scatter | O(iterations) | Visualize the "ball rolling downhill" on cost surface |
| Naive Bayes | scatter | O(n × features) | Probabilistic classification using Bayes' theorem |
| Perceptron | scatter | O(n × iterations) | Single neuron learning a linear decision boundary |

## 3. New Visualizer Type

### 3.1 ScatterVisualizer

**Purpose:** Render 2D coordinate planes with data points, decision boundaries, centroids, and regression lines.

**Visual design:**
- Coordinate plane with axis labels and grid lines (subtle, muted)
- Data points: circles (8px) colored by class/cluster
- Decision boundaries: lines or curves separating regions
- Regression line: solid accent line through data points
- Centroids (K-Means): larger circles with crosshair, pulsing during update
- Voronoi regions (KNN): semi-transparent colored regions showing classification zones
- Cost function surface (Gradient Descent): contour plot or 3D wireframe simplified to 2D contours

**Data model extension:**
```typescript
interface ScatterAlgorithmState extends BaseAlgorithmState {
  points: DataPoint[];
  boundaries?: BoundaryLine[];
  centroids?: Centroid[];
  regressionLine?: { slope: number; intercept: number };
  costHistory?: number[];          // for gradient descent cost over iterations
  iteration: number;
  totalIterations: number;
  weights?: number[];              // for perceptron/linear regression
  highlightedPoints?: string[];    // IDs of points being considered
}

interface DataPoint {
  id: string;
  x: number;
  y: number;
  label?: number;              // class label (0, 1, 2...)
  predictedLabel?: number;     // what the model predicts
  isCorrect?: boolean;         // prediction matches label
}

interface Centroid {
  id: string;
  x: number;
  y: number;
  clusterId: number;
  previousX?: number;          // for animating centroid movement
  previousY?: number;
}

interface BoundaryLine {
  type: 'linear' | 'curve';
  points: { x: number; y: number }[];
  color: string;
}
```

**Key rendering features:**
- **Animated transitions:** points smoothly change color when reclassified, centroids glide to new positions, regression line rotates as weights update
- **Iteration counter:** "Epoch 5 / 100" — ML algorithms iterate, so playback shows iterations rather than single steps
- **Cost function plot:** small inset chart showing cost decreasing over iterations (for gradient descent, perceptron)
- **Confidence visualization:** for Naive Bayes, show probability heat map behind data points

**Input controls:**
- Preset datasets: linearly separable, circular clusters, moon-shaped, random
- Number of data points slider (20-200)
- Number of clusters/classes (for KNN, K-Means)
- Learning rate slider (for gradient descent, perceptron)
- K value selector (for KNN, K-Means)
- "Add point" — click on the plane to add a data point with a class label

## 4. Algorithm-Specific Visualization Details

### Linear Regression
- Show data points scattered on plane
- Each iteration: line rotates/shifts toward best fit
- Show residuals (vertical lines from points to regression line) that shrink over iterations
- Inset: cost function value decreasing

### K-Nearest Neighbors
- All training points displayed with class colors
- User clicks to place a "query point"
- Animate: draw circles expanding from query point until K neighbors are captured
- Highlight the K nearest neighbors, show majority vote result
- Optional: show Voronoi diagram of full classification regions

### K-Means Clustering
- Random initial centroids appear
- Each iteration: (1) assign points to nearest centroid (points change color), (2) move centroids to cluster mean (animated glide)
- Repeat until convergence
- Show cluster boundaries as Voronoi regions

### Decision Tree
- Split view: scatter plot on left, growing decision tree on right (reuses TreeVisualizer)
- Each split: a line appears on the scatter plot dividing a region, corresponding tree node appears
- Show how regions get progressively divided
- Leaf nodes colored by majority class

### Gradient Descent
- 2D contour plot of cost function (like a topographic map)
- A "ball" (marker) starts at random position
- Each iteration: ball moves in direction of steepest descent
- Path traced behind the ball showing its journey
- Side panel: cost value + learning rate + current weights

### Naive Bayes
- Training points with two classes
- Show Gaussian distributions (bell curves) fitted to each feature per class
- New point classified: show probability calculations as overlaid text
- Decision boundary appears as the line where P(class1) = P(class2)

### Perceptron
- 2D linearly separable data
- Decision boundary line starts at random orientation
- Each misclassified point: boundary rotates toward correct classification
- Animate weight updates as line pivots
- Show convergence (all points correctly classified)

## 5. Generator Differences from Other Phases

ML generators differ from sorting/graph generators in key ways:

1. **Iteration-based:** Instead of single-step operations, ML algorithms run for multiple epochs/iterations. Each "step" in playback is one full iteration.
2. **Continuous data:** Points have float coordinates, not integer array values.
3. **Convergence:** Algorithms stop when a convergence criterion is met, not when data is "sorted." Generators yield a final "converged" state.
4. **Randomness:** Initial weights, centroids, and point positions have random components. Generators accept a `seed` parameter for reproducibility.

```typescript
// ML generators accept different input than array-based algorithms
interface MLGeneratorInput {
  points: DataPoint[];
  hyperparameters: {
    learningRate?: number;
    k?: number;              // for KNN, K-Means
    maxIterations?: number;
    seed?: number;
  };
}
```

## 6. LeetCode Problems

ML algorithms don't map directly to LeetCode problems (LeetCode is DSA-focused). Instead, the Practice section for Phase 4 algorithms will include:

| Algorithm | Practice Resources |
|-----------|-------------------|
| Linear Regression | Kaggle: House Prices, Boston Housing (link to notebook) |
| KNN | LeetCode: K Closest Points to Origin, Top K Frequent Elements (conceptual) |
| K-Means | Kaggle: Customer Segmentation (link to notebook) |
| Decision Tree | LeetCode: Guess Number Higher or Lower II (conceptual) |
| Gradient Descent | Interactive: TensorFlow Playground (external link) |
| Naive Bayes | Kaggle: Spam Classification (link to notebook) |
| Perceptron | LeetCode: Implement a simple classifier (conceptual) |

**Note:** The Practice section for ML algorithms should include a mix of:
- LeetCode problems that use the underlying concept (e.g., distance calculations for KNN)
- Links to Kaggle notebooks for hands-on ML practice
- External interactive tools (TensorFlow Playground, etc.)

## 7. Category Definition

```typescript
{ id: 'ai-ml', name: 'AI / Machine Learning', section: 'intelligence', icon: 'Brain' },
```

## 8. UI Changes from Phase 3

- ScatterVisualizer component added to visualizer factory
- Input controls panel for ML-specific hyperparameters (learning rate, K value, etc.)
- "Add data point" click-to-add interaction on the scatter plot
- Iteration-based playback: speed control changes "iterations per second" instead of "steps per second"
- Cost function inset chart (small line chart in corner of visualizer)
- Practice section supports external links (Kaggle, TensorFlow Playground) in addition to LeetCode

## 9. Design Considerations

### Performance
- K-Means with 200 points × 100 iterations = 20,000 state snapshots. Generator should use lazy evaluation, not pre-compute all states.
- ScatterVisualizer should use Canvas (not SVG) for >100 data points for performance.
- Consider web workers for expensive computations (gradient descent, decision tree building).

### Accessibility
- Color-coded classes need shape differentiation (circle, square, triangle) for colorblind users.
- Decision boundaries should use both color and pattern (dashed vs solid) for distinction.

### Educational Value
- Each ML algorithm should explain the "why" more heavily in theory — these are less intuitive than sorting.
- The cost function visualization is critical for gradient descent understanding — don't skip it.
- Show the math: display equations in the theory section (simple inline math, no LaTeX dependency — use Unicode math symbols).
