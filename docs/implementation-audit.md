# Design & Code Audit

This document records the architectural assessment and initial visual audit of the EcomExperts Frontend Take-Home codebase.

## 1. Project Context & Workspace Path
- **Workspace Path**: `a:\work\Full_Stack\React Job\ecomexperts-bundle-builder`
- **Operating System**: Windows (Powershell)

---

## 2. Technical Stack Identification

### Frontend
- **Framework**: React v19.1.1
- **TypeScript**: v5.9.2
- **Build Tool / Bundler**: Vite v7.1.3
- **Styling System**: CSS Modules (with a shared `tokens.css` for custom properties and design variables, and `global.css` for app-wide resets).
- **State Management**: Centralized custom reducer context in `client/src/context/BundleContext.tsx` via `useReducer` and `bundleReducer.ts`.
- **Product Data Source**: Remote API fetch from the local Express server.
- **API Endpoints**:
  - `GET http://localhost:3001/api/health` - health check
  - `GET http://localhost:3001/api/bundle` - validated product bundle payload
- **LocalStorage Implementation**: Done in `client/src/state/persistence.ts`. Supports:
  - Versioned key `bundle-builder:configuration` (version 1).
  - Validation of stored quantities, active variants, and open steps.
  - Safe fallback to initial Figma state if storage is invalid/deprecated.
- **Test Setup**:
  - **Unit / Integration Tests**: Vitest + React Testing Library (run via `npm run test` or `npx vitest`).
  - **End-to-End Tests**: Playwright (run via `npm run test:e2e`).

### Backend
- **Framework**: Express v5.1.0 on Node.js (TypeScript compiled dynamically in development using `tsx watch`).
- **Data Validation**: Zod schema validation (`server/src/schemas/bundle.schema.ts`) on server boot using data from `server/src/data/bundle.json`.

---

## 3. Existing Assets & Tokens

### Design Tokens (`client/src/styles/tokens.css`)
- **Grid / Layout Constants**:
  - Desktop size: `1440 × 1077`
  - Columns: Builder `768px`, Review `399px` (content `390px`), gap `29px`.
  - Step heights: Camera step `695px`, Collapsed steps `81.33px`, Header `66.33px`.
- **Colors**: Sleek brand-purple theme (`#4e2fd2`), subtle blue backgrounds (`#edf4ff`), muted grays, success greens, and red warning badges.
- **Fonts**: Named `Gilroy` and `TT Norms Pro` with default fallback to sans-serif. No commercial binaries are bundled in the repository, so fallback fonts are used.

### Local Image Assets
- Product thumbnails and color variants are located under `client/src/assets/products` and `client/src/assets/variants/`.
- Badges and UI icons are located under `client/src/assets/badges/` and `client/src/assets/icons/`.

---

## 4. Current Defects & Visual-QA Baseline Observations

We captured baseline screenshots across the requested viewports (saved in `docs/visual-qa/baseline-*`). The following defects were identified:

### A. Dynamic Step Heights Mismatch (Critical layout issue)
- **Problem**: In `client/src/components/BundleBuilder/BundleBuilder.module.css`, step heights are locked using `:first-child` and `:not(:first-child)`.
- **Impact**: 
  - If Step 1 (Cameras) is collapsed, its DOM wrapper still takes up `695px` height, leaving a massive blank space in the builder column.
  - If Step 2, 3, or 4 is expanded, they are forced to `81.33px` height, causing their content to overlap, clip, or overflow illegibly.
- **Fix**: Apply `.expanded` and `.collapsed` height styles to the step section dynamically, matching the actual `isOpen` state, and ensure auto-height on responsive stacked viewports.

### B. Tablet & Intermediate Breakpoint Compressed Layout
- **Problem**: Between `768px` and `1227px`, the builder column and review panels are forced to stack, but the steps inside the builder retain their rigid desktop heights (e.g. min-height `978px` on `.steps` and fixed height on children).
- **Impact**: Cards are compressed or stretched, whitespace is distributed awkwardly, and the layout looks cramped.
- **Fix**: Remove fixed height constraints on `.steps` and steps children in the media query `@media (max-width: 1227px)`.

### C. Review Panel Layout in Stacked Layouts
- **Problem**: In stacked layouts (tablet and wide mobile), the review content has excessive unused space on the right, and the pricing summary / checkout items do not align well with the responsive Figma guidelines.
- **Impact**: Aesthetic flow is compromised; elements appear disconnected.
- **Fix**: Refine responsive rules in `ReviewPanel.module.css` for a wide stacked presentation when the layout columns collapse.

### D. Next Button Text & Behavior
- **Problem**: In `BundleBuilder.tsx`, the next button label is static relative to the next index, but if step heights are not updated or focus changes, the screen layout can become misaligned.
- **Fix**: Ensure correct step transitions and focus shifting, while maintaining clean accessibility labels.
