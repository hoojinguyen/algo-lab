# Light Mode UI & Editorial Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Light Mode visual contrast and introduce a semantic editorial system for the theory section.

**Architecture:** We will define a set of semantic CSS variables in `globals.css` that adapt to both light and dark modes. These tokens will then be used in `TheoryPanel.tsx` to replace hardcoded, dark-mode-leaning colors.

**Tech Stack:** Next.js, Tailwind CSS 4, CSS Variables.

---

### Task 1: Define Semantic Editorial Tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add semantic variables to :root (Light Mode)**

```css
:root {
  /* ... existing vars ... */
  --text-lead: #18181b;     /* Zinc 950 */
  --text-editorial: #3f3f46; /* Zinc 700 */
  --bg-callout: #eff6ff;    /* Blue 50 */
  --border-editorial: #e4e4e7; /* Zinc 200 */
}
```

- [ ] **Step 2: Add semantic variables to [data-theme='dark']**

```css
[data-theme='dark'] {
  /* ... existing vars ... */
  --text-lead: #d4d4d8;      /* Zinc 300 */
  --text-editorial: #a1a1aa;  /* Zinc 400 */
  --bg-callout: rgba(59, 130, 246, 0.05);
  --border-editorial: #27272a; /* Zinc 800 */
}
```

- [ ] **Step 3: Map variables in @theme block**

```css
@theme {
  /* ... existing theme ... */
  --color-text-lead: var(--text-lead);
  --color-text-editorial: var(--text-editorial);
  --color-bg-callout: var(--bg-callout);
  --color-border-editorial: var(--border-editorial);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add semantic editorial tokens to globals.css"
```

---

### Task 2: Refactor TheoryPanel for Theme Support

**Files:**
- Modify: `src/components/ui/TheoryPanel.tsx`

- [ ] **Step 1: Update Title and Category colors**

Replace hardcoded `text-white` with `text-primary`.

```tsx
// Around line 25
<h1 className="text-4xl font-extrabold tracking-tight text-primary mb-8 leading-tight">
  {name}
</h1>
```

- [ ] **Step 2: Update Lead Paragraph and Sections**

Replace `text-zinc-300` and `text-zinc-400` with the new semantic tokens.

```tsx
// Lead paragraph (line 47)
<div className="text-[17px] text-lead leading-relaxed mb-12 font-medium italic opacity-90 border-l-2 border-editorial pl-8">
  {parsed.lead}
</div>

// Section bodies (line 57)
<p className="text-base text-editorial leading-relaxed max-w-2xl">{section.content}</p>
```

- [ ] **Step 3: Update Interview Insight block**

Use `--bg-callout` and improve contrast.

```tsx
// Around line 63
<div className="mt-12 mb-8 border-l-4 border-accent/30 bg-callout py-8 pl-8 pr-6 rounded-r-2xl transition-all hover:bg-accent/10 group">
  {/* ... */}
  <div className="text-[15px] text-lead leading-relaxed font-medium">
    {/* ... */}
  </div>
</div>
```

- [ ] **Step 4: Update ComplexityPill styles**

Refactor the `styles` object to use semantic theme tokens.

```tsx
function ComplexityPill({ ... }) {
  const styles = {
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    error: 'text-error bg-error/10 border-error/20',
    muted: 'text-secondary bg-bg-tertiary border-border-editorial',
  };
  // ...
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/TheoryPanel.tsx
git commit -m "refactor: use semantic editorial tokens in TheoryPanel"
```

---

### Task 3: Verification in Browser

- [ ] **Step 1: Check Light Mode**

Navigate to `http://localhost:3000/sorting/counting-sort` and verify:
- Title is visible (black).
- Lead paragraph is dark gray/black and readable.
- Complexity pills have clearly visible borders and background colors.
- Interview insight has a subtle blue background.

- [ ] **Step 2: Check Dark Mode**

Toggle to Dark Mode and verify no regressions:
- Title is white.
- Text is zinc/gray as before.

- [ ] **Step 3: Final Commit**

```bash
git commit --allow-empty -m "chore: verify light mode UI fix"
```
