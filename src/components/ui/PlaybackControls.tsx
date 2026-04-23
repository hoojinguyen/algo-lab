'use client';

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  isFinished: boolean;
  isStart: boolean;
}

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  isFinished,
  isStart,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onReset}
        className="p-3 rounded-full text-text-secondary hover:bg-bg-tertiary transition-colors"
        title="Reset"
      >
        <RotateCcw size={20} />
      </button>

      <button
        onClick={onPrev}
        disabled={isStart}
        className={`p-3 rounded-full transition-colors ${
          isStart ? 'text-text-muted opacity-50' : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Step Backward"
      >
        <SkipBack size={24} />
      </button>

      <button
        onClick={onPlayPause}
        className="p-5 rounded-full bg-accent hover:bg-accent/80 text-white transition-all transform hover:scale-105 shadow-lg"
      >
        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
      </button>

      <button
        onClick={onNext}
        disabled={isFinished}
        className={`p-3 rounded-full transition-colors ${
          isFinished ? 'text-text-muted opacity-50' : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Step Forward"
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
}
