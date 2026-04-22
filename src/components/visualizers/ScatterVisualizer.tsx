import React, { useEffect, useRef } from 'react';
import { ScatterAlgorithmState } from '@/lib/types';

interface ScatterVisualizerProps {
  state: ScatterAlgorithmState;
}

export const ScatterVisualizer: React.FC<ScatterVisualizerProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine bounds
    let minX = 0, maxX = 10, minY = 0, maxY = 10;
    if (state.points.length > 0) {
      minX = Math.min(...state.points.map(p => p.x)) - 1;
      maxX = Math.max(...state.points.map(p => p.x)) + 1;
      minY = Math.min(...state.points.map(p => p.y)) - 1;
      maxY = Math.max(...state.points.map(p => p.y)) + 1;
    }

    // Coordinate mapping
    const mapX = (x: number) => ((x - minX) / (maxX - minX)) * canvas.width;
    const mapY = (y: number) => canvas.height - ((y - minY) / (maxY - minY)) * canvas.height;

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = Math.floor(minX); i <= Math.ceil(maxX); i++) {
      ctx.moveTo(mapX(i), 0);
      ctx.lineTo(mapX(i), canvas.height);
    }
    for (let i = Math.floor(minY); i <= Math.ceil(maxY); i++) {
      ctx.moveTo(0, mapY(i));
      ctx.lineTo(canvas.width, mapY(i));
    }
    ctx.stroke();

    // Draw points
    state.points.forEach(p => {
      ctx.beginPath();
      ctx.arc(mapX(p.x), mapY(p.y), 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#60A5FA';
      ctx.fill();
      ctx.strokeStyle = '#2563EB';
      ctx.stroke();
    });

    // Draw regression line
    if (state.regressionLine) {
      const { slope, intercept } = state.regressionLine;
      const x1 = minX;
      const y1 = slope * x1 + intercept;
      const x2 = maxX;
      const y2 = slope * x2 + intercept;
      
      ctx.beginPath();
      ctx.moveTo(mapX(x1), mapY(y1));
      ctx.lineTo(mapX(x2), mapY(y2));
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [state]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="bg-bg-tertiary border border-border rounded-lg shadow-sm"
      />
      {state.costHistory && state.costHistory.length > 0 && (
        <div className="absolute top-8 right-8 bg-bg-primary border border-border p-3 rounded text-xs font-mono shadow-md">
          <p className="text-text-secondary mb-1">Cost (MSE)</p>
          <p className="text-error font-bold">{state.costHistory[state.costHistory.length - 1].toFixed(4)}</p>
          <p className="text-text-muted mt-2">Epoch {state.iteration} / {state.totalIterations}</p>
        </div>
      )}
    </div>
  );
};
