"use client";

import { use, useMemo, useState } from 'react';
import { bubbleSortEntry } from '@/lib/algorithms/sorting/bubble-sort';
import { usePlayback } from '@/hooks/usePlayback';
import { VisualizerPanel } from '@/components/visualizers/VisualizerPanel';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { CodeBlock } from '@/components/ui/CodeBlock';

// Temporary map until registry is built with all algorithms
const registry: Record<string, any> = {
  'bubble-sort': bubbleSortEntry
};

export default function LessonPage({ params }: { params: Promise<{ category: string, algorithm: string }> }) {
  const resolvedParams = use(params);
  const entry = registry[resolvedParams.algorithm];

  const initialArray = useMemo(() => [9, 14, 5, 11, 3, 22, 1, 8], []);
  
  const states = useMemo(() => {
    if (!entry) return [];
    const generator = entry.generator(initialArray);
    const result = [];
    for (let state of generator) {
      result.push(state);
    }
    return result;
  }, [entry, initialArray]);

  const {
    currentState,
    currentIndex,
    totalSteps,
    isPlaying,
    setIsPlaying,
    next,
    prev,
    reset
  } = usePlayback(states, 500);

  if (!entry || !currentState) {
    return <div className="p-12 text-text-muted">Algorithm not found</div>;
  }

  return (
    <div className="flex h-full w-full">
      {/* Left Column: Theory & Code */}
      <section className="w-[55%] h-full border-r border-border overflow-y-auto no-scrollbar p-12 bg-bg-primary">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 mb-6">
            <span className="px-2 py-1 text-xs font-mono bg-success/10 text-success border border-success/20 rounded">
              Best: {entry.complexity.best}
            </span>
            <span className="px-2 py-1 text-xs font-mono bg-warning/10 text-warning border border-warning/20 rounded">
              Avg: {entry.complexity.average}
            </span>
            <span className="px-2 py-1 text-xs font-mono bg-error/10 text-error border border-error/20 rounded">
              Worst: {entry.complexity.worst}
            </span>
          </div>

          <h1 className="text-4xl font-medium mb-6">{entry.name}</h1>
          
          <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-12">
            <p>{entry.theory}</p>
          </div>

          <div className="mb-12">
            <CodeBlock
              code={entry.code}
              activeLine={currentState.codeLine}
            />
          </div>
        </div>
      </section>

      {/* Right Column: Visualizer */}
      <section className="flex-1 h-full flex flex-col relative bg-bg-secondary">
        <div className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold tracking-widest text-text-muted uppercase border border-border rounded-full bg-bg-primary">
          Lab
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="mb-8 p-4 bg-bg-tertiary border border-border rounded-lg text-text-primary text-center min-h-[60px] min-w-[300px] flex items-center justify-center font-medium shadow-sm">
            {currentState.description}
          </div>
          <VisualizerPanel type={entry.visualizerType} state={currentState} />
        </div>

        <div className="h-28 border-t border-border flex flex-col justify-center bg-bg-primary z-10">
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
    </div>
  );
}
