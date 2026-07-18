# Desktop visual QA

Target: Figma file `rBxplaFFJ2CaIttgPuSPQm`, node `68:9663`, viewport
1440 × 1077. QA performed on 2026-07-18.

## Reference and comparison method

Fresh calls to authenticated Figma MCP `get_design_context` and
`get_screenshot` were attempted before styling. Both returned the Figma Starter
plan call-limit error. The exact measurements and original assets captured in
Phase 2 remained available in `docs/design-audit.md` and the local asset
directories.

For a real image reference, Figma's public thumbnail endpoint for the same file
was downloaded. Its middle canvas is the desktop frame. The source crop is only
336 × 248 pixels, so it was resized to the measured node size of 1440 × 1077 and
saved as `docs/visual-qa/figma-desktop.png`. This is an authentic but compressed
Figma thumbnail, not a replacement for a full-resolution MCP export.

`scripts/visual-qa.py` creates an absolute RGB per-pixel difference with no
tolerance: black pixels in `diff-desktop.png` are exact matches and non-black
pixels are the raw channel differences. Final result:

- Different pixels: 1,029,631 / 1,550,880 (66.390114%).
- Mean absolute channel error: 14.862977 / 255.
- Comparison threshold: 0; no mismatch tolerance was applied.

The numerical rate is dominated by upscaling/compression in the 336 × 248
reference and by unavailable commercial fonts. It is not presented as a
pixel-match score for the original full-resolution Figma export.

## Pass 1 — overall geometry and columns

Screenshot: `docs/visual-qa/pass1-geometry.png`.

Visible mismatches found:

- The Phase 3 page used a centered fluid width and a 24px column gap.
- The review surface was 399px wide instead of the measured 390px inner panel.
- The expanded camera step and card rows were content-driven and too tall.
- The fifth card was centered but did not have a fixed measured row height.

Changes:

- Fixed the desktop content origin at x=122 and y=49.3601.
- Set columns to 768px and 399px with the exact derived 29px gap.
- Set review content to 390 × 823px.
- Set the expanded camera step to 695px and its product grid to three 160px
  rows with 15px gaps.
- Set two-column cards to 361.5 × 160px and the centered fifth card to
  360 × 160px.

Result: the main columns, blue camera surface, centered fifth card, and review
wrapper aligned to the measured desktop frame.

## Pass 2 — cards, text, images, spacing, and controls

Screenshots: `docs/visual-qa/pass2-cards.png` and
`docs/visual-qa/pass2-cards-fixed.png`.

Visible mismatches found:

- The initial fixed-height card pass caused the first-row steppers and second
  row footer to cross the card boundary with the fallback font metrics.
- Product content used distributed flex spacing, creating inconsistent gaps.
- The title line box was larger than the measured compact card layout.

Changes:

- Replaced distributed card spacing with explicit 4px flex gaps and an
  auto-margin footer.
- Used a 16px line height for 16px product titles and a 3px title-to-copy gap.
- Kept the original local product/variant images with `object-fit: contain`;
  no placeholder or online image was introduced.
- Preserved transparent 2px default borders so selected/unselected cards keep
  identical dimensions, while selected cards use the authored purple border.

Result: all badges, images, variant controls, steppers, and prices remain inside
their measured 160px cards without clipping or hiding overflow.

## Pass 3 — review panel, totals, colors, and polish

Screenshot: `docs/visual-qa/pass3-review-final.png` (also copied to
`docs/visual-qa/app-desktop.png`).

Visible mismatches found:

- The desktop app displayed “Let’s get started!”, but the desktop Figma frame
  does not show that mobile title.
- The review blue background began at the 390 × 823 content block instead of
  behind the REVIEW eyebrow at y≈49.
- The builder's collapsed rows ended a few pixels below the measured 978px
  builder height.
- Grid row stretching made review footer spacing harder to reason about.

Changes:

- Visually hid the desktop-only page title while retaining a semantic `h1`;
  the 390px layout restores the visible mobile title.
- Extended the 390px review surface behind the 32px eyebrow and retained the
  823px content block below it.
- Derived exact accordion header and collapsed-step heights so the builder is
  978.0003px tall.
- Added `align-content: start` to the fixed review grid and retained the exact
  authored colors, dividers, 41px thumbnails, guarantee asset, financing badge,
  totals, Checkout button, and save link.

Result: desktop structure and authored content align closely with the available
Figma thumbnail and exact Phase 2 measurements.

## Remaining visible differences

- Gilroy and TT Norms Pro were not supplied as licensed project/Figma assets.
  System fallbacks produce different glyph widths, weights, kerning, wrapping,
  and antialiasing. A 100% typography match is therefore not claimed.
- The available Figma image reference is a lossy 336 × 248 WebP thumbnail
  enlarged to 1440 × 1077. Its text, SVGs, borders, and product images are
  blurred and compressed, while the application uses the original high-quality
  local assets. The raw pixel diff necessarily marks these quality differences.
- Fine one-pixel antialiasing and exact commercial-font baselines cannot be
  certified until the full-resolution Figma screenshot call becomes available.
- No intentional visible mismatch, placeholder asset, or tolerance adjustment
  is being concealed. A fresh full-resolution Figma export should replace the
  thumbnail reference in the next available QA run.

## Phase 5 — mobile responsive QA

Target: node `74:19845`, viewport 390 × 1252. Fresh authenticated MCP context
and screenshot calls were attempted again and returned the same Starter-plan
call-limit error. The exact Phase 2 geometry and the authentic left mobile frame
from Figma's public file thumbnail were used.

Screenshots:

- `docs/visual-qa/figma-mobile.png`
- `docs/visual-qa/app-mobile.png`
- `docs/visual-qa/diff-mobile.png`
- Narrow-width inspection: `docs/visual-qa/pass5-320.png`

The source mobile crop is only 96 × 288 pixels and is resized to 390 × 1252.
The zero-tolerance raw RGB comparison reports:

- Different pixels: 363,893 / 488,280 (74.525477%).
- Mean absolute channel error: 18.066737 / 255.
- Comparison threshold: 0.

As with desktop, this value is dominated by thumbnail scaling, WebP artifacts,
and unavailable Gilroy/TT Norms Pro fonts; it is not a full-resolution Figma
match score.

### Responsive changes

- The visible mobile title occupies the measured first 86px.
- The four collapsed semantic accordion headings occupy the next 320px, so the
  review begins at y=406 and spans the full phone width.
- Mobile initializes with all four steps collapsed, matching Figma. Opening a
  step changes it to natural content height and pushes later steps/review down;
  no fixed-height content is overlaid or clipped.
- At 1280px the desktop columns fit with fluid outer margins. At 1024px and
  768px the builder and review stack with centered review content. At 560px and
  below, the layout becomes edge-to-edge and phone-specific dimensions apply.
- Product cards become a single column below 760px. At 320px, review rows use a
  two-row arrangement for names, controls, and prices.
- Automated overflow checks cover 390, 375, 320, 768, 1024, and 1280px, plus an
  expanded camera step at 320px.

### Accessibility changes

- Accordion buttons are inside ordered `h2` elements and retain
  `aria-expanded`, `aria-controls`, and labelled regions.
- Variant choices remain native keyboard buttons and now expose a labelled
  group. Global and component `:focus-visible` outlines remain visible.
- Quantity controls have descriptive labels, disabled decrements at their
  minimums, and larger phone targets.
- Checkout traps Tab/Shift+Tab, closes on Escape or backdrop activation, starts
  focus on Cancel, and restores focus to Checkout after closing.
- Save confirmation explicitly uses `aria-live="polite"` and
  `aria-atomic="true"`; failures retain assertive alert semantics.
- `prefers-reduced-motion: reduce` disables effective animations, transitions,
  and smooth scrolling.

### Remaining mobile differences

- Commercial font metrics and antialiasing remain different because the font
  binaries were not legitimately supplied.
- The low-resolution Figma thumbnail is horizontally/vertically compressed;
  fine borders, glyph baselines, image sharpness, and one-pixel spacing cannot
  be certified against it.
- Touch targets are intentionally more usable than the tiny controls visible in
  the compressed thumbnail, while preserving the authored visual colors and
  control glyphs.
