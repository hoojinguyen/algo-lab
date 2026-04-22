"use client";

import { useMemo } from 'react';
import { bubbleSortGenerator } from '@/lib/algorithms/bubbleSort';
import { usePlayback } from '@/hooks/usePlayback';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { PlaybackControls } from '@/components/ui/PlaybackControls';

export default function Home() {
  const initialArray = [9, 14, 5, 11, 3];
  
  const states = useMemo(() => {
    const generator = bubbleSortGenerator(initialArray);
    const result = [];
    for (let state of generator) {
      result.push(state);
    }
    return result;
  }, []);

  const {
    currentState,
    currentIndex,
    totalSteps,
    isPlaying,
    setIsPlaying,
    next,
    prev,
    reset
  } = usePlayback(states, 800);

  if (!currentState) return null;

  return (
    <main className="flex h-screen w-full overflow-hidden text-white font-sans">
      
      {/* Left Panel: The Story */}
      <section className="w-1/2 h-full glass-panel border-r border-pewter overflow-y-auto p-12 flex flex-col">
        <h4 className="text-xs font-bold tracking-widest text-pewter uppercase mb-4">Sorting Algorithms</h4>
        <h1 className="text-5xl font-medium mb-6">Bubble Sort</h1>
        
        <p className="text-lg leading-relaxed text-cloud mb-8 opacity-90">
          Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. 
          This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.
        </p>
        
        <div className="bg-carbon border border-pewter rounded-md p-6 mb-12">
          <h3 className="text-sm font-medium mb-4">Time Complexity</h3>
          <div className="flex justify-between border-b border-pewter pb-2 mb-2"><span className="text-cloud">Best Case</span><span className="font-mono">O(n)</span></div>
          <div className="flex justify-between border-b border-pewter pb-2 mb-2"><span className="text-cloud">Average Case</span><span className="font-mono">O(n²)</span></div>
          <div className="flex justify-between"><span className="text-cloud">Worst Case</span><span className="font-mono">O(n²)</span></div>
        </div>

        <h2 className="text-2xl font-medium mb-4">Current Step Action</h2>
        <div className="p-4 border-l-4 border-electric bg-electric/10 rounded-r-md">
          <p className="text-lg">{currentState.description}</p>
        </div>
      </section>

      {/* Right Panel: The Lab */}
      <section className="w-1/2 h-full glass-panel flex flex-col relative">
        <div className="absolute top-8 right-8 text-xs font-bold tracking-widest text-pewter uppercase">The Lab</div>
        
        <div className="flex-1 flex flex-col justify-center items-center">
          <ArrayVisualizer state={currentState} />
        </div>

        <div className="h-32 border-t border-pewter flex flex-col justify-center bg-carbon/50 backdrop-blur-md">
          <PlaybackControls 
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={next}
            onPrev={prev}
            onReset={reset}
            isFinished={currentIndex === totalSteps - 1}
            isStart={currentIndex === 0}
          />
        </div>
      </section>
      
    </main>
  );
}
