'use client';

import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface CodeBlockProps {
  code: string;
  activeLine?: number;
  compact?: boolean;
}

function tokenise(line: string): React.ReactNode {
  const tokens: { text: string; type: string }[] = [];
  const re =
    /(".*?"|'.*?'|`.*?`|\/\/.*$|\b(function|return|let|const|var|if|else|for|while|of|new|this)\b|\b\d+\b)/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push({ text: line.slice(cursor, match.index), type: 'plain' });
    }
    const val = match[0];
    if (/^["'`]/.test(val)) {
      tokens.push({ text: val, type: 'string' });
    } else if (/^\/\//.test(val)) {
      tokens.push({ text: val, type: 'comment' });
    } else if (/^\d+$/.test(val)) {
      tokens.push({ text: val, type: 'number' });
    } else {
      tokens.push({ text: val, type: 'keyword' });
    }
    cursor = match.index + val.length;
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), type: 'plain' });
  }

  return tokens.map((t, i) => {
    let className = 'text-editorial'; // Standard readable text
    if (t.type === 'keyword') className = 'text-accent font-semibold';
    else if (t.type === 'string') className = 'text-warning';
    else if (t.type === 'number') className = 'text-success font-mono';
    else if (t.type === 'comment') className = 'text-muted italic';
    return (
      <span key={i} className={className}>
        {t.text}
      </span>
    );
  });
}

export function CodeBlock({ code, activeLine, compact = false }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const lines = code.split('\n');

  useEffect(() => {
    if (activeLine !== undefined && codeRef.current) {
      // Fix: Used string concatenation instead of template literal to avoid parsing errors
      const el = codeRef.current.querySelector("[data-line='" + activeLine + "']");
      if (el) {
        // Use block: 'nearest' to minimize jumping if already in view
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLine]);

  return (
    <div
      className={clsx(
        'bg-bg-secondary border border-border rounded-2xl overflow-hidden shadow-sm transition-all',
        !compact && 'hover:border-accent/30 group/code'
      )}
    >
      {!compact && (
        <div className="flex items-center justify-between bg-bg-tertiary border-b border-border px-6 py-4">
          <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
            Implementation
          </span>
          <div className="flex gap-1.5 opacity-30 group-hover/code:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
          </div>
        </div>
      )}

      <pre
        ref={codeRef}
        className={clsx(
          'overflow-auto leading-relaxed no-scrollbar',
          compact ? 'max-h-[500px] p-4 text-[13px]' : 'max-h-[600px] p-6 text-[14px]'
        )}
      >
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;
          return (
            <div
              key={idx}
              data-line={lineNumber}
              className={`flex gap-4 rounded-sm transition-all duration-300 ${
                isActive
                  ? 'bg-accent/5 border-l-2 border-accent -mx-4 px-3'
                  : '-mx-0 opacity-80 hover:opacity-100'
              }`}
            >
              <span
                className={`select-none shrink-0 w-6 text-right text-xs leading-relaxed ${
                  isActive ? 'text-accent font-bold' : 'text-text-muted'
                }`}
              >
                {lineNumber}
              </span>
              <span className="flex-1">{line ? tokenise(line) : <span>&nbsp;</span>}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
