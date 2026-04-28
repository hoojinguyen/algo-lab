'use client';

import { parseTheory } from '@/lib/utils/theory-parser';
import { AlgorithmComplexity } from '@/lib/types';

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
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-500 dark:text-blue-400">
          {category.replace(/-/g, ' ')}
        </span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-8 leading-tight">
        {name}
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-10">
        <ComplexityPill label="best" value={complexity.best} type="success" />
        <ComplexityPill label="avg" value={complexity.average} type="warning" />
        <ComplexityPill label="worst" value={complexity.worst} type="error" />
        <ComplexityPill label="space" value={complexity.space} type="muted" />
        {stable !== undefined && (
          <span
            className={`px-3 py-1.5 text-[10px] font-bold border rounded-full uppercase tracking-widest ${
              stable
                ? 'text-success bg-success/10 border-success/20'
                : 'text-warning bg-warning/10 border-warning/20'
            }`}
          >
            {stable ? 'Stable' : 'Unstable'}
          </span>
        )}
      </div>

      <div className="text-[17px] text-lead leading-relaxed mb-12 font-medium italic opacity-90 border-l-2 border-border-editorial pl-8">
        {parsed.lead}
      </div>

      <div className="space-y-12 mb-16">
        {parsed.sections.map((section, i) => (
          <div key={i} className="group">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4 group-hover:text-secondary transition-colors">
              {section.title}
            </h3>
            <p className="text-base text-editorial leading-relaxed max-w-2xl">{section.content}</p>
          </div>
        ))}
      </div>

      {parsed.interviewInsight && (
        <div className="mt-12 mb-8 border-l-4 border-accent/30 bg-callout py-8 pl-8 pr-6 rounded-r-2xl transition-all hover:bg-accent/10 group">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Interview Insight
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors"></div>
          </div>
          <div className="text-[15px] text-lead leading-relaxed font-medium">
            <div className="prose prose-sm max-w-none prose-p:leading-relaxed dark:prose-invert prose-code:bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none font-sans">
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
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    error: 'text-error bg-error/10 border-error/20',
    muted: 'text-secondary bg-tertiary border-border-editorial',
  };

  return (
    <span
      className={`px-3 py-1.5 text-[11px] font-mono font-semibold border rounded-full flex items-center gap-2 shadow-sm ${styles[type]}`}
    >
      {value}
      <span className="opacity-50 font-sans font-normal text-[9px] uppercase tracking-tighter">
        {label}
      </span>
    </span>
  );
}
