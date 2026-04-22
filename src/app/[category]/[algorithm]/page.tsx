"use client";

import { use, useMemo, useState } from 'react';
import { ALGORITHM_REGISTRY } from '@/lib/algorithms/registry';
import { usePlayback } from '@/hooks/usePlayback';
import { VisualizerPanel } from '@/components/visualizers/VisualizerPanel';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function LessonPage({ params }: { params: Promise<{ category: string, algorithm: string }> }) {
  const resolvedParams = use(params);
  const entry = ALGORITHM_REGISTRY[resolvedParams.algorithm];

  // Validation: Ensure algorithm belongs to the category in the URL
  const isValid = entry && entry.category === resolvedParams.category;
  const currentEntry = isValid ? entry : null;

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

  const states = useMemo(() => {
    if (!currentEntry) return [];
    
    let generator;
    if (currentEntry.category === 'ai-ml') {
      generator = currentEntry.generator({ 
        points: initialPoints, 
        hyperparameters: { learningRate: 0.01, maxIterations: 50 } 
      });
    } else {
      generator = currentEntry.generator(initialArray);
    }
    
    const result = [];
    for (let state of generator) {
      result.push(state);
    }
    return result;
  }, [currentEntry, initialArray, initialPoints]);

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

  if (!currentEntry || !currentState) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <h2 className="text-2xl font-semibold mb-2">Algorithm Not Found</h2>
        <p className="text-text-muted mb-8">The algorithm you're looking for doesn't exist or isn't in this category.</p>
        <Link href="/" className="px-6 py-2 bg-text-primary text-bg-primary rounded-lg font-medium hover:opacity-90 transition-opacity">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      {/* Left Column: Theory & Code */}
      <section className="w-[55%] h-full border-r border-border overflow-y-auto no-scrollbar p-12 bg-bg-primary">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 mb-6">
            <span className="px-2 py-1 text-xs font-mono bg-success/10 text-success border border-success/20 rounded">
              Best: {currentEntry.complexity.best}
            </span>
            <span className="px-2 py-1 text-xs font-mono bg-warning/10 text-warning border border-warning/20 rounded">
              Avg: {currentEntry.complexity.average}
            </span>
            <span className="px-2 py-1 text-xs font-mono bg-error/10 text-error border border-error/20 rounded">
              Worst: {currentEntry.complexity.worst}
            </span>
          </div>

          <h1 className="text-4xl font-medium mb-6">{currentEntry.name}</h1>
          
          <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-12">
            <p>{currentEntry.theory}</p>
          </div>

          <div className="mb-12">
            <CodeBlock
              code={currentEntry.code}
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
          <VisualizerPanel type={currentEntry.visualizerType} state={currentState} />
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
