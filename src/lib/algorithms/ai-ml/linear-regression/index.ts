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
      description: `Epoch ${iter}: Cost = ${cost.toFixed(4)}. Updated slope=${m.toFixed(2)}, intercept=${b.toFixed(2)}`,
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
  code: `function linearRegression(points, lr, epochs) {
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
}`,
  generator: linearRegressionGenerator as any,
  leetcode: []
};
