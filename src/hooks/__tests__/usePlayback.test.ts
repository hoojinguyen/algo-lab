import { renderHook, act } from '@testing-library/react';
import { usePlayback } from '../usePlayback';
import { AlgorithmState } from '@/lib/types';

const mockStates: AlgorithmState[] = [
  { step: 1, description: 'Step 1', activeIndices: [], swapped: false, data: [1] },
  { step: 2, description: 'Step 2', activeIndices: [], swapped: false, data: [2] },
];

describe('usePlayback', () => {
  it('manages state navigation', () => {
    const { result } = renderHook(() => usePlayback(mockStates));
    
    expect(result.current.currentState?.step).toBe(1);
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.next();
    });

    expect(result.current.currentState?.step).toBe(2);
  });
});
