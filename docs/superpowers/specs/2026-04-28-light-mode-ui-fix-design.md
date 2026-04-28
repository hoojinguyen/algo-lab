# Design Spec: Light Mode UI & Editorial Contrast Improvement

Improve the visual contrast and reading experience in Light Mode by introducing semantic editorial tokens and refactoring hardcoded dark-mode styles.

## Goals
- Fix invisible or low-contrast text in Light Mode (e.g., `text-white` on white background).
- Introduce a semantic editorial system for scannable, high-quality reading content.
- Ensure all complexity indicators (pills, callouts) are accessible and professional in both themes.

## Style Tokens (`src/app/globals.css`)

We will add the following semantic tokens to handle long-form editorial content:

### 1. New Variables
| Token | Light Mode | Dark Mode | Purpose |
| :--- | :--- | :--- | :--- |
| `--text-lead` | `#18181b` (Zinc 950) | `#d4d4d8` (Zinc 300) | Lead/Intro paragraph |
| `--text-editorial` | `#3f3f46` (Zinc 700) | `#a1a1aa` (Zinc 400) | Section body text |
| `--bg-callout` | `#eff6ff` (Blue 50) | `rgba(59, 130, 246, 0.05)` | Interview insight block |
| `--border-editorial` | `#e4e4e7` (Zinc 200) | `#27272a` (Zinc 800) | Dividers and block borders |

### 2. Tailwind Theme Mapping
Expose these variables in the `@theme` block:
```css
@theme {
  --color-text-lead: var(--text-lead);
  --color-text-editorial: var(--text-editorial);
  --color-bg-callout: var(--bg-callout);
  --color-border-editorial: var(--border-editorial);
}
```

## Component Refactoring

### `TheoryPanel.tsx`
1.  **Title & Category**:
    - Change `text-white` to `text-primary`.
    - Change `text-blue-500 dark:text-blue-400` to use a semantic `--accent` if available, or keep as is if contrast is sufficient.
2.  **Lead Paragraph**:
    - Change `text-zinc-300` to `text-lead`.
    - Change `border-zinc-800` to `border-editorial`.
3.  **Sections**:
    - Change `text-zinc-500` (headings) to `text-secondary`.
    - Change `text-zinc-400` (body) to `text-editorial`.
4.  **Interview Insight**:
    - Change `bg-blue-500/5` to `bg-callout`.
    - Change `border-blue-500/50` to `border-accent/30`.
    - Change `text-zinc-300` to `text-lead`.
5.  **ComplexityPill**:
    - Update `styles` mapping to use semantic variables:
        - `success`: `text-success bg-success/10 border-success/20`.
        - `warning`: `text-warning bg-warning/10 border-warning/20`.
        - `error`: `text-error bg-error/10 border-error/20`.
        - `muted`: `text-secondary bg-bg-tertiary border-border-editorial`.

## Verification Plan
1.  **Manual Review**:
    - Toggle Light/Dark mode on `/sorting/counting-sort`.
    - Verify Title is black in light mode and white in dark mode.
    - Verify Lead paragraph is highly readable in both.
    - Verify Complexity pills have sufficient contrast (emerald/amber/rose variants).
2.  **Accessibility Check**:
    - Use browser dev tools to confirm text contrast ratios meet WCAG AA (4.5:1).
