'use client';

import { parseTheory } from '@/lib/utils/theory-parser';
import { AlgorithmComplexity } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TheoryPanelProps {
  name: string;
  category: string;
  theory: string;
  complexity: AlgorithmComplexity;
  stable?: boolean;
}

export function TheoryPanel({ name, category, theory, complexity, stable }: TheoryPanelProps) {
  const parsed = parseTheory(theory);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-2">
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-blue-500 dark:text-blue-400">
          {category.replace(/-/g, ' ')}
        </span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        {name}
      </h1>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <ComplexityPill label="best" value={complexity.best} type="success" />
        <ComplexityPill label="avg" value={complexity.average} type="warning" />
        <ComplexityPill label="worst" value={complexity.worst} type="error" />
        <ComplexityPill label="space" value={complexity.space} type="muted" />
        {stable !== undefined && (
          <span
            className={cn(
              'px-2 py-1 text-[10px] font-bold border rounded uppercase tracking-wider',
              stable
                ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
            )}
          >
            {stable ? 'Stable' : 'Unstable'}
          </span>
        )}
      </div>

      <div className="text-lg text-zinc-400 leading-relaxed mb-10 font-medium italic opacity-90 border-l-2 border-zinc-800 pl-6">
        {parsed.lead}
      </div>

      <div className="space-y-10 mb-12">
        {parsed.sections.map((section, i) => (
          <div key={i} className="group">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3 group-hover:text-zinc-300 transition-colors">
              {section.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">{section.content}</p>
          </div>
        ))}
      </div>

      {parsed.interviewInsight && (
        <div className="mt-6 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm shadow-xl">
          <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Interview Insight
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          <div className="px-6 py-6 text-sm text-zinc-400 leading-relaxed">
            {/* Split by code blocks or just render with better styling */}
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-200 prose-code:before:content-none prose-code:after:content-none font-sans">
              {parsed.interviewInsight}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplexityPill({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: 'success' | 'warning' | 'error' | 'muted';
}) {
  const styles = {
    success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    error: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    muted: 'text-zinc-500 bg-zinc-900 border-zinc-800',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-1 text-[11px] font-mono font-bold border rounded-md flex items-center gap-2 shadow-sm',
        styles[type]
      )}
    >
      {value}
      <span className="opacity-50 font-sans font-normal text-[9px] uppercase tracking-tighter">
        {label}
      </span>
    </span>
  );
}
