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
  isStart
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 p-4">
      <button 
        onClick={onReset}
        className="p-2 text-cloud hover:text-white transition-colors"
        title="Reset"
      >
        <RotateCcw size={20} />
      </button>
      
      <button 
        onClick={onPrev}
        disabled={isStart}
        className="p-2 text-cloud hover:text-white disabled:opacity-30 transition-colors"
        title="Previous Step"
      >
        <SkipBack size={20} />
      </button>

      <button 
        onClick={onPlayPause}
        className="bg-electric text-white rounded-md px-8 py-3 font-medium transition-transform hover:scale-105"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <button 
        onClick={onNext}
        disabled={isFinished}
        className="p-2 text-cloud hover:text-white disabled:opacity-30 transition-colors"
        title="Next Step"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
}
