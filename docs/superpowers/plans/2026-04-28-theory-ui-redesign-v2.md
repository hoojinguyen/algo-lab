# Modern Theory UI Redesign (v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the algorithm theory UI with an editorial sidebar layout for insights and a cleaner, unified code block component.

**Architecture:** Refactor existing UI components (`TheoryPanel`, `CodeBlock`) to use a shared design language of high-contrast typography, left-accented callouts, and simplified headers.

**Tech Stack:** React, Tailwind CSS, Next.js.

---

### Task 1: Refactor TheoryPanel Typography & Pills

**Files:**
- Modify: `src/components/ui/TheoryPanel.tsx`

- [ ] **Step 1: Update typography and complexity pills styling**
Modify the `TheoryPanel` component and `ComplexityPill` helper to use softer rounding, better font weights, and increased base font sizes.

```tsx
// src/components/ui/TheoryPanel.tsx

// Update ComplexityPill helper
function ComplexityPill({ label, value, type }: { label: string; value: string; type: 'success' | 'warning' | 'error' | 'muted' }) {
  const styles = {
    success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    error: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    muted: 'text-zinc-500 bg-zinc-900 border-zinc-800',
  };

  return (
    <span className={`px-3 py-1.5 text-[11px] font-mono font-semibold border rounded-full flex items-center gap-2 shadow-sm ${styles[type]}`}>
      {value}
      <span className="opacity-50 font-sans font-normal text-[9px] uppercase tracking-tighter">{label}</span>
    </span>
  );
}

// Update main TheoryPanel content typography
// ...
<h1 className="text-4xl font-extrabold tracking-tight text-white mb-8 leading-tight">
  {name}
</h1>
// ...
<div className="text-base text-zinc-300 leading-relaxed mb-10 font-medium italic opacity-90 border-l-2 border-zinc-800 pl-6">
  {parsed.lead}
</div>
// ...
<p className="text-base text-zinc-400 leading-relaxed max-w-xl">{section.content}</p>
```

- [ ] **Step 2: Commit changes**
```bash
git add src/components/ui/TheoryPanel.tsx
git commit -m "style: improve TheoryPanel typography and complexity pills"
```

### Task 2: Implement Sidebar-Style Interview Insight

**Files:**
- Modify: `src/components/ui/TheoryPanel.tsx`

- [ ] **Step 1: Replace boxed card with sidebar callout**
Update the `parsed.interviewInsight` rendering logic to use the new left-accented editorial style.

```tsx
// src/components/ui/TheoryPanel.tsx (around line 62)

{parsed.interviewInsight && (
  <div className="mt-12 mb-8 border-l-4 border-blue-500/50 bg-blue-500/5 py-6 pl-8 pr-6 rounded-r-2xl transition-all hover:bg-blue-500/10 group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
        Interview Insight
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></div>
    </div>
    <div className="text-[15px] text-zinc-300 leading-relaxed font-medium">
      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-200 prose-code:before:content-none prose-code:after:content-none font-sans">
        {parsed.interviewInsight}
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 2: Commit changes**
```bash
git add src/components/ui/TheoryPanel.tsx
git commit -m "style: implement editorial sidebar for interview insights"
```

### Task 3: Simplify CodeBlock Header & Borders

**Files:**
- Modify: `src/components/ui/CodeBlock.tsx`

- [ ] **Step 1: Remove window dots and simplify header**
Update `CodeBlock` to remove the decorative dots and use a cleaner "Label" style that aligns with the theory sections.

```tsx
// src/components/ui/CodeBlock.tsx

// ...
return (
  <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-zinc-700/50">
    <div className="flex items-center justify-between bg-zinc-900/50 border-b border-zinc-800/50 px-6 py-4">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
        Implementation
      </span>
      <div className="flex gap-1.5">
        <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
        <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
        <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
      </div>
    </div>
    
    <pre ref={codeRef} className="overflow-auto max-h-[500px] p-6 text-sm font-mono leading-relaxed no-scrollbar">
// ...
```

- [ ] **Step 2: Commit changes**
```bash
git add src/components/ui/CodeBlock.tsx
git commit -m "style: simplify CodeBlock header and unify borders"
```

### Task 4: Final Spacing & Layout Adjustment

**Files:**
- Modify: `src/app/[category]/[algorithm]/page.tsx`

- [ ] **Step 1: Adjust layout margins for unified flow**
Ensure the transition between `TheoryPanel` and `CodeBlock` feels seamless.

```tsx
// src/app/[category]/[algorithm]/page.tsx

// ...
<div className="p-12 max-w-2xl mx-auto w-full space-y-4">
  <TheoryPanel
    name={currentEntry.name}
    category={currentEntry.category}
    theory={currentEntry.theory}
    complexity={currentEntry.complexity}
    stable={currentEntry.stable}
  />

  <CodeBlock code={currentEntry.code} activeLine={currentState.codeLine} />

  {/* Practice Section */}
// ...
```

- [ ] **Step 2: Verify all algorithms render correctly in the browser**
Check Bubble Sort, Heap Sort, and Linear Search to ensure the new layout works with varying content lengths.

- [ ] **Step 3: Commit changes**
```bash
git add src/app/[category]/[algorithm]/page.tsx
git commit -m "style: adjust layout spacing for unified theory-code flow"
```
