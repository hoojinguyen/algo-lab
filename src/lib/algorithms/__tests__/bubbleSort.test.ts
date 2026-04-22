import { bubbleSortGenerator } from '../sorting/bubble-sort';

describe('bubbleSortGenerator', () => {
  it('yields correct states for a simple array', () => {
    const generator = bubbleSortGenerator([3, 1, 2]);
    
    // Initial comparison
    let result = generator.next();
    expect(result.value).toEqual({
      step: 1,
      description: "Comparing 3 and 1",
      activeIndices: [0, 1],
      swapped: false,
      data: [3, 1, 2]
    });

    // Swap
    result = generator.next();
    expect(result.value).toEqual({
      step: 2,
      description: "Swapping 1 and 3",
      activeIndices: [0, 1],
      swapped: true,
      data: [1, 3, 2]
    });
  });
});
