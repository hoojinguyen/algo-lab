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
    for (const state of generator) {
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
