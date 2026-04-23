# Code Quality Tools Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Prettier for consistent formatting and Husky/lint-staged for automated pre-commit quality checks.

**Architecture:** Integrate Prettier with ESLint using `eslint-config-prettier` to avoid conflicts, and use Husky to trigger `lint-staged` on git commits.

**Tech Stack:** Prettier, Husky, lint-staged, ESLint, TypeScript.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Prettier and linting integration**

Run: `yarn add -D prettier eslint-config-prettier`
Expected: `package.json` updated with new devDependencies.

- [ ] **Step 2: Install Husky and lint-staged**

Run: `yarn add -D husky lint-staged`
Expected: `package.json` updated with new devDependencies.

- [ ] **Step 3: Commit dependencies**

```bash
git add package.json yarn.lock
git commit -m "chore: install prettier, husky, and lint-staged"
```

### Task 2: Configure Prettier

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`

- [ ] **Step 1: Create .prettierrc**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

- [ ] **Step 2: Create .prettierignore**

```text
node_modules
.next
out
public
dist
.agents
*.md
```

- [ ] **Step 3: Commit configuration**

```bash
git add .prettierrc .prettierignore
git commit -m "chore: configure prettier"
```

### Task 3: Integrate Prettier with ESLint

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Update ESLint configuration**

Modify `eslint.config.mjs` to include `eslint-config-prettier` at the end to override conflicting rules.

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/.agents/**",
      "**/eslint.config.mjs",
      "**/next.config.mjs",
      "**/tailwind.config.mjs",
      "**/postcss.config.mjs"
    ],
  },
  prettierConfig, // Add this at the end
];

export default eslintConfig;
```

- [ ] **Step 2: Verify linting still passes**

Run: `yarn lint`
Expected: PASS (with no conflicts)

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore: integrate prettier with eslint"
```

### Task 4: Configure Automation (Husky & lint-staged)

**Files:**
- Modify: `package.json`
- Create: `.husky/pre-commit` (via husky command)

- [ ] **Step 1: Initialize Husky**

Run: `npx husky init`
Expected: `.husky/` directory created and `prepare` script added to `package.json`.

- [ ] **Step 2: Configure lint-staged in package.json**

Add the following to `package.json`:

```json
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
```

- [ ] **Step 3: Update Husky pre-commit hook**

Replace content of `.husky/pre-commit`:

```bash
npx lint-staged
```

- [ ] **Step 4: Commit automation config**

```bash
git add package.json .husky/pre-commit
git commit -m "chore: setup husky and lint-staged"
```

### Task 5: Final Verification

- [ ] **Step 1: Run prettier on the whole codebase**

Run: `npx prettier --write .`
Expected: Files formatted correctly.

- [ ] **Step 2: Verify build still passes**

Run: `yarn build`
Expected: PASS

- [ ] **Step 3: Test pre-commit hook**

Modify a file, stage it, and try to commit.
Run: `git commit -m "test: verify husky"`
Expected: `lint-staged` runs automatically.

- [ ] **Step 4: Commit formatting changes**

```bash
git add .
git commit -m "style: format entire codebase with prettier"
```
