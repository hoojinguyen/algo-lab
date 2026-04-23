## 🚨 CRITICAL RULES & WORKFLOW

1.  **PREREQUISITE (First Action Only):** 
    Before *anything else*, you must execute the `using-superpowers` skill to learn your current capabilities.
2.  **NO DUPLICATION:** 
    *Never* generate code, explanations, or UI elements that already exist in the project. 
    *First*, **search** (`find-files`, `search-code`) to see if the pattern exists. *Then*, implement only the missing piece.
3.  **STRICT FILE NAMING:**
    * **Components:** `PascalCase.tsx` (e.g., `AlgorithmVisualizer.tsx`).
    * **Hooks:** `useSomething.ts` (e.g., `useSortingState.ts`).
    * **Apps:** `kebab-case.tsx` (e.g., `sorting.tsx`).
4.  **HYDRATION PROTECTION:**
    * Use the `"use client"` directive for *all* components that access React hooks (`useState`, `useEffect`, etc.).
    * **Never** import Client Components into Server Components. Always import Server Components (like layout, page) into Client Components.