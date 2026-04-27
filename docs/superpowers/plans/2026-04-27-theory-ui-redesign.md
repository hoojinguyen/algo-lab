# Algorithm Theory UI Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the algorithm theory section into a structured, modern editorial design (B3) with clear headings, complexity pills, and interview insights.

**Architecture:** Create a `TheoryParser` utility to extract structured data from the existing theory strings and a `TheoryPanel` component to render the B3 design. Update the main lesson page to use this new component.

**Tech Stack:** React, Tailwind CSS, Lucide React (for icons if needed, but per user request, we minimize them).

---

### Task 1: Create Theory Parser Utility

**Files:**
- Create: `src/lib/utils/theory-parser.ts`
- Test: `src/lib/utils/theory-parser.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { parseTheory } from './theory-parser';

describe('parseTheory', () => {
  it('should split theory into lead, sections, and interview insight', () => {
    const rawTheory = `This is the lead paragraph.\n\n**Time Complexity:** O(n^2) description.\n\n**Space Complexity:** O(1) description.\n\n**Key Interview Insight:** Focus on this.`;
    const result = parseTheory(rawTheory);
    expect(result.lead).toBe('This is the lead paragraph.');
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].title).toBe('Time Complexity');
    expect(result.interviewInsight).toBe('Focus on this.');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test src/lib/utils/theory-parser.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement parseTheory**

```typescript
export interface TheorySection {
  title: string;
  content: string;
}

export interface ParsedTheory {
  lead: string;
  sections: TheorySection[];
  interviewInsight?: string;
}

export function parseTheory(theory: string): ParsedTheory {
  const parts = theory.split('\n\n').filter(Boolean);
  const lead = parts[0];
  const remaining = parts.slice(1);

  const sections: TheorySection[] = [];
  let interviewInsight: string | undefined;

  remaining.forEach(part => {
    const match = part.match(/^\*\*(.*?):\*\*\s*(.*)/s);
    if (match) {
      const title = match[1];
      const content = match[2];
      if (title.toLowerCase().includes('interview insight')) {
        interviewInsight = content;
      } else {
        sections.push({ title, content });
      }
    }
  });

  return { lead, sections, interviewInsight };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test src/lib/utils/theory-parser.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/theory-parser.ts src/lib/utils/theory-parser.test.ts
git commit -m "feat: add theory parser utility"
```

---

### Task 2: Create TheoryPanel Component

**Files:**
- Create: `src/components/ui/TheoryPanel.tsx`

- [ ] **Step 1: Write the TheoryPanel component**

```tsx
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
    <div className="flex flex-col">
      <div className="mb-2">
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-accent">
          {category.replace('-', ' ')}
        </span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-4 leading-tight">
        {name}
      </h1>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <ComplexityPill label="best" value={complexity.best} type="success" />
        <ComplexityPill label="avg" value={complexity.average} type="warning" />
        <ComplexityPill label="worst" value={complexity.worst} type="error" />
        <ComplexityPill label="space" value={complexity.space} type="muted" />
        {stable !== undefined && (
          <span className="px-2 py-1 text-[10px] font-bold text-success bg-success/10 border border-success/20 rounded uppercase tracking-wider">
            {stable ? 'Stable' : 'Unstable'}
          </span>
        )}
      </div>

      <div className="text-sm text-text-secondary leading-relaxed mb-8 font-medium italic opacity-90 border-l-2 border-border pl-4">
        {parsed.lead}
      </div>

      <div className="space-y-6 mb-10">
        {parsed.sections.map((section, i) => (
          <div key={i}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-primary mb-2">
              {section.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {parsed.interviewInsight && (
        <div className="mt-4 border border-border rounded-xl overflow-hidden bg-bg-secondary shadow-sm">
          <div className="px-4 py-2 bg-bg-tertiary border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-primary">
            Interview Insight
          </div>
          <div className="px-4 py-4 text-sm text-text-secondary leading-relaxed prose-code:bg-bg-tertiary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-text-primary prose-code:font-mono">
            {parsed.interviewInsight}
          </div>
        </div>
      )}
    </div>
  );
}

function ComplexityPill({ label, value, type }: { label: string; value: string; type: 'success' | 'warning' | 'error' | 'muted' }) {
  const colors = {
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    error: 'text-error bg-error/10 border-error/20',
    muted: 'text-text-muted bg-bg-tertiary border-border',
  };

  return (
    <span className={`px-2 py-1 text-[11px] font-mono font-bold border rounded flex items-center gap-1.5 ${colors[type]}`}>
      {value} <span className="opacity-60 font-sans font-normal text-[9px] uppercase">{label}</span>
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/TheoryPanel.tsx
git commit -m "feat: add TheoryPanel component with B3 design"
```

---

### Task 3: Integrate TheoryPanel into LessonPage

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Replace raw theory rendering with TheoryPanel**

```tsx
// In src/app/[category]/[algorithm]/page.tsx

// Import
import { TheoryPanel } from '@/components/ui/TheoryPanel';

// Replace (around line 128-145)
<div className="p-12 max-w-2xl mx-auto w-full">
  {/* Remove the old complexity spans and h1 */}
  <TheoryPanel 
    name={currentEntry.name}
    category={currentEntry.category}
    theory={currentEntry.theory}
    complexity={currentEntry.complexity}
    stable={currentEntry.stable}
  />

  {/* Keep the CodeBlock and Practice section below */}
  <div className="mb-12 mt-12">
    <CodeBlock code={currentEntry.code} activeLine={currentState.codeLine} />
  </div>
  ...
</div>
```

- [ ] **Step 2: Verify in browser**

Go to `http://localhost:3000/sorting/bubble-sort` (or whatever the dev port is) and verify the design looks like the B3 mockup.

- [ ] **Step 3: Commit**

```bash
git add src/app/[category]/[algorithm]/page.tsx
git commit -m "feat: integrate TheoryPanel into lesson page"
```

---

### Task 4: Final Cleanup and Verification

- [ ] **Step 1: Check multiple algorithms**
Verify Bubble Sort, Heap Sort, and others to ensure the parser handles different theory strings correctly.

- [ ] **Step 2: Remove old styles if necessary**
Check if there are any unused styles in `globals.css` or the page that can be cleaned up.

- [ ] **Step 3: Final Commit**

```bash
git commit --allow-empty -m "chore: finalize theory UI improvements"
```
