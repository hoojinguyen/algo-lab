'use client';

import { useEffect, useRef } from 'react';

interface CodeBlockProps {
  code: string;
  activeLine?: number;
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
    let className = 'text-text-primary';
    if (t.type === 'keyword') className = 'text-accent font-semibold';
    else if (t.type === 'string') className = 'text-warning';
    else if (t.type === 'number') className = 'text-success';
    else if (t.type === 'comment') className = 'text-text-muted italic';
    return (
      <span key={i} className={className}>
        {t.text}
      </span>
    );
  });
}

export function CodeBlock({ code, activeLine }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const lines = code.split('\n');

  useEffect(() => {
    if (activeLine !== undefined && codeRef.current) {
      // Fix: Used string concatenation instead of template literal to avoid parsing errors
      const el = codeRef.current.querySelector("[data-line='" + activeLine + "']");
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine]);

  return (
    <div className="bg-bg-secondary border border-border rounded-md overflow-hidden">
      <div className="flex items-center gap-2 bg-bg-tertiary border-b border-border px-4 py-2">
        <span className="w-3 h-3 rounded-full bg-border" />
        <span className="w-3 h-3 rounded-full bg-border" />
        <span className="w-3 h-3 rounded-full bg-border" />
        <span className="ml-4 text-xs font-bold text-text-muted uppercase tracking-widest">
          Implementation
        </span>
      </div>

      <pre
        ref={codeRef}
        className="overflow-auto max-h-72 p-4 text-sm font-mono leading-relaxed no-scrollbar"
      >
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;
          return (
            <div
              key={idx}
              data-line={lineNumber}
              className={`flex gap-4 rounded-sm transition-all duration-200 ${
                isActive ? 'bg-accent/10 border-l-2 border-accent -mx-4 px-3' : '-mx-0'
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
