"use client";

import { useMemo, useState } from 'react';
import { bubbleSortGenerator } from '@/lib/algorithms/bubbleSort';
import { mergeSortGenerator } from '@/lib/algorithms/mergeSort';
import { quickSortGenerator } from '@/lib/algorithms/quickSort';
import { usePlayback } from '@/hooks/usePlayback';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { PlaybackControls } from '@/components/ui/PlaybackControls';

type AlgorithmType = 'bubble' | 'merge' | 'quick';

const ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    generator: bubbleSortGenerator,
    description: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`
  },
  merge: {
    name: 'Merge Sort',
    generator: mergeSortGenerator,
    description: 'Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. The merge() function is used for merging two halves.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`
  },
  quick: {
    name: 'Quick Sort',
    generator: quickSortGenerator,
    description: 'QuickSort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot. There are many different versions of quickSort that pick pivot in different ways.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    code: `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  }
};

export default function Home() {
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmType>('bubble');
  const initialArray = useMemo(() => [9, 14, 5, 11, 3, 22, 1, 8], []); // Slightly larger array to show off Merge/Quick
  
  const states = useMemo(() => {
    const generator = ALGORITHMS[activeAlgo].generator(initialArray);
    const result = [];
    for (let state of generator) {
      result.push(state);
    }
    return result;
  }, [activeAlgo, initialArray]);

  const {
    currentState,
    currentIndex,
    totalSteps,
    isPlaying,
    setIsPlaying,
    next,
    prev,
    reset
  } = usePlayback(states, 500); // slightly faster default speed

  if (!currentState) return null;

  const currentAlgoDetails = ALGORITHMS[activeAlgo];

  return (
    <main className="flex h-screen w-full overflow-hidden text-white font-sans bg-carbon">
      
      {/* Navigation Sidebar */}
      <aside className="w-64 glass-panel border-r border-pewter p-6 flex flex-col gap-2 z-10 relative">
         <h2 className="text-xs font-bold tracking-widest text-pewter uppercase mb-4 mt-4">Sorting</h2>
         {(Object.keys(ALGORITHMS) as AlgorithmType[]).map((key) => (
           <button
             key={key}
             onClick={() => {
               setActiveAlgo(key);
               reset();
             }}
             className={`text-left px-4 py-2 rounded-md text-sm font-medium transition-all ${
               activeAlgo === key ? 'bg-electric text-white' : 'text-cloud hover:bg-carbon/50'
             }`}
           >
             {ALGORITHMS[key].name}
           </button>
         ))}
      </aside>

      {/* Left Panel: The Story */}
      <section className="flex-1 h-full glass-panel border-r border-pewter overflow-y-auto p-12 flex flex-col z-0">
        <h4 className="text-xs font-bold tracking-widest text-pewter uppercase mb-4">Sorting Algorithms</h4>
        <h1 className="text-5xl font-medium mb-6">{currentAlgoDetails.name}</h1>
        
        <p className="text-lg leading-relaxed text-cloud mb-8 opacity-90">
          {currentAlgoDetails.description}
        </p>
        
        <div className="bg-carbon border border-pewter rounded-md p-6 mb-12">
          <h3 className="text-sm font-medium mb-4">Time Complexity</h3>
          <div className="flex justify-between border-b border-pewter pb-2 mb-2"><span className="text-cloud">Best Case</span><span className="font-mono">{currentAlgoDetails.best}</span></div>
          <div className="flex justify-between border-b border-pewter pb-2 mb-2"><span className="text-cloud">Average Case</span><span className="font-mono">{currentAlgoDetails.average}</span></div>
          <div className="flex justify-between"><span className="text-cloud">Worst Case</span><span className="font-mono">{currentAlgoDetails.worst}</span></div>
        </div>

        <h2 className="text-2xl font-medium mb-4">Current Step Action</h2>
        <div className="p-4 border-l-4 border-electric bg-electric/10 rounded-r-md min-h-[80px] flex items-center mb-12">
          <p className="text-lg">{currentState.description}</p>
        </div>

        <h2 className="text-2xl font-medium mb-4">Implementation</h2>
        <div className="bg-carbon border border-pewter rounded-md p-6 overflow-x-auto">
          <pre className="font-mono text-sm text-cloud leading-relaxed">
            <code>{currentAlgoDetails.code}</code>
          </pre>
        </div>
      </section>

      {/* Right Panel: The Lab */}
      <section className="flex-1 h-full glass-panel flex flex-col relative z-0">
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
