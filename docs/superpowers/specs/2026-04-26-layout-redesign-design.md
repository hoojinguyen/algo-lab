# Layout Redesign Spec (Modern Dashboard)

## Overview
The application layout will be transitioned to a "Modern Dashboard" style. This replaces the current Icon Rail + Slide Panel with a global Top Header and a persistent Left Sidebar. This improves the visual hierarchy, makes global actions like Theme Toggling more discoverable, and provides a standard, familiar navigation model.

## Core Components

### 1. `Header.tsx` (New Component)
A top navigation bar spanning the width of the application (or the width of the main content area, next to the Sidebar).
- **Responsibilities:**
  - Global Search (Command Palette trigger)
  - Theme Toggle
  - User Progress / Profile (if applicable)
- **Visuals:** 
  - Height: ~60px
  - Border-bottom for separation
  - Flexbox layout with items pushed to the right.

### 2. `Sidebar.tsx` (Updated/Extracted from AppShell)
A persistent left sidebar combining the previous Icon Rail and Slide Panel concepts.
- **Responsibilities:**
  - Display the App Logo (top)
  - Primary Navigation: Categories (Sorting, Graphs, Trees, etc.)
  - Secondary Navigation: When a category is active, show the algorithms within it directly in the sidebar (accordion/collapsible style or nested lists).
- **Visuals:**
  - Width: ~250px
  - Border-right for separation
  - Scrollable content area

### 3. `AppShell.tsx` (Layout Wrapper)
The root structural layout of the application.
- **Structural Changes:**
  - Switch from a purely horizontal flex layout (`IconRail -> SlidePanel -> Main`) to a structural layout:
    ```
    +--------------------------------+
    | Sidebar | Header               |
    | (250px) +----------------------+
    |         | Main Content         |
    |         |                      |
    +--------------------------------+
    ```
  - Refactor `AppShell` to use CSS Grid or a column-based Flexbox approach to orchestrate the new `Header`, `Sidebar`, and `children` nodes.

## UX Improvements
- **Theme Toggle Location:** Moved from the local algorithm page view to the global Header, making it accessible from anywhere.
- **Search:** The global search is moved to the Header, which is the standard location for global search bars in modern dashboards.
- **Simpler Navigation:** Removes the dual-rail system in favor of a single unified Sidebar, reducing horizontal space usage and cognitive load.

## Implementation Steps
1. Create `Header.tsx` and migrate `ThemeToggle` and `Search` trigger into it.
2. Create/Update `Sidebar.tsx` to handle category and algorithm navigation.
3. Update `AppShell.tsx` to mount the new `Sidebar` and `Header` components, placing the `children` in the main content pane.
4. Clean up any redundant layout code in `app/[category]/[algorithm]/page.tsx` (e.g., removing the local `ThemeToggle`).
