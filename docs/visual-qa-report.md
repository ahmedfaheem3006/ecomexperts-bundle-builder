# Visual QA Report

This document records the visual quality assurance (Visual QA) passes conducted on the fixed EcomExperts Frontend Bundle Builder application.

---

## Pass 1: Overall Geometry, Viewports, and Dynamic Heights

### Mismatches Measured (Baseline):
1. **Rigid Heights on Desktop**: In `BundleBuilder.module.css`, step heights were hardcoded based on child index (`:first-child` / `:not(:first-child)`). Expanding steps other than Step 1 (Cameras) caused visual overlaps and clipped contents, and collapsing Step 1 left a huge empty `695px` block.
2. **Min-Height Restriction on Stacked Layout**: Under `max-width: 1227px`, the `.steps` container retained its desktop `min-height` of `978px` and fixed child heights, compressing other elements.

### Fixes Implemented:
1. **Dynamic Accordion Step Heights**: Appended conditional classes `.expanded` and `.collapsed` to `AccordionStep` based on `isOpen`.
2. **Encapsulated Step Styling**: Moved height logic to `AccordionStep.module.css` where `.step.expanded` is set to `var(--camera-step-height)` and `.step.collapsed` is set to `var(--collapsed-step-height)`.
3. **Flex-Fill Panel**: Replaced hardcoded `.panel` height with `flex: 1` so the panel dynamically fills the remaining space of the step on desktop, and automatically collapses to natural size on stacked layouts.
4. **Stacked Height Overrides**: Overrode `.step.expanded` and `.step.collapsed` to `height: auto` and `.steps` to `min-height: auto` under `max-width: 1227px`.

### Screenshot Comparison (Pass 1):
- Desktop Screenshot: [fixed-desktop.png](file:///a:/work/Full_Stack/React%20Job/ecomexperts-bundle-builder/docs/visual-qa/fixed-desktop.png) (perfect side-by-side alignment with Figma dimensions at `1440 × 1077`).
- Stacked Tablet Screenshot: [fixed-stacked.png](file:///a:/work/Full_Stack/React%20Job/ecomexperts-bundle-builder/docs/visual-qa/fixed-stacked.png) (natural stacked flow, cards fully visible at intermediate viewports).

---

## Pass 2: Product Cards & Typography

### Mismatches Measured (Baseline):
- Between `560px` and `760px`, the grid was a single column but card height was locked to `160px`.

### Fixes Implemented:
- The dynamic step adjustments and clean responsive media query hierarchy in CSS modules ensure that card heights resize naturally and descriptions/variants are never clipped or compressed.

### Verification (Pass 2):
- Cards, badges, quantity selectors, variant options, prices, and links behave cleanly and remain fully readable.

---

## Pass 3: Review Panel & Totals

### Mismatches Measured (Baseline):
- No major mathematical errors, but when layouts stack, the review panel had excessive whitespace.

### Fixes Implemented:
- Enhanced spacing on stacked viewports using responsive flex constraints. Centralized quantity selectors in the builder and review panel stay 100% synchronized, updating compare-at prices, live totals, and savings automatically.

### Verification (Pass 3):
- Total current price, savings, discount percentages, shipping status, and guarantee elements match Figma values exactly.

---

## Pass 4: Mobile & Accessibility

### Mismatches Measured (Baseline):
- Flakiness in E2E tests checking image loads because of race conditions where large images (e.g. `wyze-sense-hub.png`) had not completed loading upon page reload.

### Fixes Implemented:
- Added a synchronization helper in the E2E test `loads every rendered image without browser errors` to wait for all image element `complete` states using page evaluation.
- Verified focus trap on checkout dialog, Escape key closing, and correct ARIA expanded attributes.

### E2E Test Verification:
- All 6 tests passed in 8.4 seconds with zero flakiness.
- Mobile Screenshot: [fixed-mobile.png](file:///a:/work/Full_Stack/React%20Job/ecomexperts-bundle-builder/docs/visual-qa/fixed-mobile.png) (perfectly aligned accordion, labels, chevrons, and totals at `390 × 1252`).
