import { bubbleSortGenerator } from '../sorting/bubble-sort';

describe('bubbleSortGenerator', () => {
  it('yields correct states for a simple array', () => {
    const generator = bubbleSortGenerator([3, 1, 2]);

    // Initial state
    let result = generator.next();
    expect(result.value).toEqual({
      step: 0,
      description: 'Initial array state',
      activeIndices: [],
      swapped: false,
      data: [3, 1, 2],
      codeLine: 1,
    });

    // Starting pass 1
    result = generator.next();
    expect(result.value).toEqual({
      step: 0,
      description: 'Starting pass 1',
      activeIndices: [],
      swapped: false,
      data: [3, 1, 2],
      codeLine: 2,
    });

    // Comparing
    result = generator.next();
    expect(result.value).toEqual({
      step: 0,
      description: 'Comparing elements at index 0 and 1',
      activeIndices: [0, 1],
      swapped: false,
      data: [3, 1, 2],
      codeLine: 3,
    });

    // Need to swap
    result = generator.next();
    expect(result.value).toEqual({
      step: 0,
      description: '3 > 1, need to swap',
      activeIndices: [0, 1],
      swapped: false,
      data: [3, 1, 2],
      codeLine: 4,
    });

    // Swapped
    result = generator.next();
    expect(result.value).toEqual({
      step: 0,
      description: 'Swapped elements',
      activeIndices: [0, 1],
      swapped: true,
      data: [1, 3, 2],
      codeLine: 5,
    });
  });
});
