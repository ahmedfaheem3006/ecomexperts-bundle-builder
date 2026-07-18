# Figma design audit

This audit records values returned by the authenticated Figma MCP server on
2026-07-18. It covers file `rBxplaFFJ2CaIttgPuSPQm`, desktop node `68:9663`, and
mobile node `74:19845`. Values below are direct Figma measurements or literal
text; they are not visual approximations.

## Frame geometry

| Element | Node | Position | Size |
|---|---|---:|---:|
| Desktop frame | `68:9663` | Figma canvas `x=4172`, `y=862` | 1440 × 1077 |
| Desktop builder column | `74:21610` | `x=122`, `y=49.360107421875` inside desktop | 768 × 978.0003051757812 |
| Expanded camera step | `68:9774` | `x=0`, `y=0` inside builder | 768 × 695 |
| Desktop review container | `74:21626` | `x=919`, `y=49.4000244140625` inside desktop | 399 × 855 |
| Desktop review content | `74:21629` | `x=0`, `y=32` inside review container | 390 × 823 |
| Mobile frame | `74:19845` | Figma canvas `x=3618`, `y=862` | 390 × 1252 |
| Mobile steps wrapper | `74:19847` | `x=0`, `y=86` | 390 × 1166 |
| Mobile review wrapper | `74:19917` | `x=0`, `y=320` inside steps wrapper | 390 × 846 |
| Mobile review content | `74:19923` | `x=0`, `y=15` inside review block | 390 × 816 |

Desktop places the builder and review panel side by side. The desktop camera
step is expanded and the other three steps are collapsed. The 390px reference
shows all four step summaries collapsed, followed by the review panel. Figma
defines these two reference sizes but does not define a responsive breakpoint.

## Typography

Figma references these exact font/style names:

- `Gilroy-Bold:☞`
- `Gilroy-SemiBold:☞`
- `Gilroy-Medium:☞`
- `Gilroy-Regular:☞`
- `Gilroy-RegularItalic:☞`
- `TT_Norms_Pro:Bold` for the Checkout label

Observed font sizes are 10, 12, 14, 16, 17, 18, 22, and 24px. The mobile title
is 31.875px. Observed explicit line heights are 16, 20, 24, and 32px, plus unitless
1, 1.1, 1.2, and 1.3. Letter spacing values are `-0.6`, `-0.064`, `-0.056`,
`-0.032`, `-0.03`, `-0.028`, `-0.016`, `0.045`, `0.06`, `0.07`, `0.36`, `0.6`,
and `1.6px`.

No licensed Gilroy or TT Norms Pro font files were supplied by the repository or
returned as Figma assets. No commercial fonts were downloaded. `tokens.css`
names the original families first and provides system fallbacks without claiming
that the original fonts are bundled.

## Colors

| Token purpose | Exact value |
|---|---|
| White / card surface | `#ffffff` |
| Black | `#000000` |
| Primary ink | `#0b0d10` |
| Heading | `#1f1f1f` |
| Secondary heading copy | `rgba(31, 31, 31, 0.75)` |
| Review eyebrow/copy | `#484848` |
| Card price | `#575757` |
| Muted/compare-at | `#6f7882` |
| Section label | `#a8b2bd` |
| Divider | `#ced6de` |
| Light control border | `#e6ebf0` |
| Swatch border | `#cccccc` |
| Builder/review surface | `#edf4ff` |
| Control surface | `#f0f4f7` |
| Disabled control | `#f1f1f2` |
| Brand purple | `#4e2fd2` |
| Selected card border | `rgba(78, 47, 210, 0.7)` |
| Success | `#0aa288` |
| Selected swatch surface | `rgba(29, 240, 187, 0.04)` |
| Transparent white surface | `rgba(255, 255, 255, 0.04)` |
| Compare-at danger red | `#d8392b` |
| Learn More link | `#0000ee` |

## Spacing, borders, and radii

- Explicit gaps: 3, 4, 5, 6, 8, 10, 12, 13, 15, 16, 19, 20, and 46px.
- Explicit padding values: 1, 2, 3, 4, 5, 6, 8, 10, 11, 13, 15, 16, 20, 24,
  and 31px.
- Border widths: 0.5px hairlines, 1px dividers/default borders, and 2px selected
  card/control borders.
- Corner radii: 2, 3, 4, 5, 7, and 10px.
- Desktop product grid gap: 15px.
- Desktop product card padding: 11px.
- Review content horizontal padding: 20px; review row thumbnails are 41 × 41px.

The complete reusable values are recorded in `client/src/styles/tokens.css`.

## Steps and initial selection counts

| Step | Title | Initial selected count | Desktop | Mobile |
|---:|---|---:|---|---|
| 1 | Choose your cameras | 2 | Expanded | Collapsed |
| 2 | Choose your plan | 1 | Collapsed | Collapsed |
| 3 | Choose your sensors | 2 | Collapsed | Collapsed |
| 4 | Add extra protection | 1 | Collapsed | Collapsed |

## Camera cards

| Product | Variants | Initial active variant | Initial quantities | Card price | Compare at | Discount |
|---|---|---|---|---:|---:|---:|
| Wyze Cam v4 | White, Grey, Black | White | White 1; Grey 0; Black 0 | $27.98 | $35.98 | Save 22% |
| Wyze Cam Pan v3 | White, Black | White | White 2; Black 0 | $34.98 | $39.98 | Save 12% |
| Wyze Cam Floodlight v2 | White, Black | None shown | White 0; Black 0 | $69.98 | $89.98 | Save 22% |
| Wyze Duo Cam Doorbell | No variants | N/A | Default 0 | $69.98 | — | — |
| Wyze Battery Cam Pro | White, Black | None shown | White 0; Black 0 | $89.98 | — | — |

Descriptions are preserved verbatim in `bundle.json`. The review panel displays
Wyze Cam Pan v3 at quantity 2 with `$57.98` compare-at and `$47.98` current,
which differs from its card values of `$39.98` and `$34.98`. Both authored Figma
states are stored separately; no unit-price calculation was invented.

## Complete initial quantities

| Quantity key | Value |
|---|---:|
| `wyze-cam-v4:white` | 1 |
| `wyze-cam-v4:grey` | 0 |
| `wyze-cam-v4:black` | 0 |
| `wyze-cam-pan-v3:white` | 2 |
| `wyze-cam-pan-v3:black` | 0 |
| `wyze-cam-floodlight-v2:white` | 0 |
| `wyze-cam-floodlight-v2:black` | 0 |
| `wyze-duo-cam-doorbell:default` | 0 |
| `wyze-battery-cam-pro:white` | 0 |
| `wyze-battery-cam-pro:black` | 0 |
| `cam-unlimited:default` | 1 |
| `wyze-sense-motion-sensor:default` | 2 |
| `wyze-sense-hub:default` | 1 |
| `wyze-microsd-card-256gb:default` | 2 |

## Review-panel initial contents

Review heading: **Your security system**

Review description: “Review your personalized protection system designed to keep
what matters most safe.”

| Section | Item | Quantity | Compare at | Current |
|---|---|---:|---:|---:|
| Cameras | Wyze Cam v4 | 1 | $35.98 | $27.98 |
| Cameras | Wyze Cam Pan v3 | 2 | $57.98 | $47.98 |
| Sensors | Wyze Sense Motion Sensor | 2 | — | $59.98 |
| Sensors | Wyze Sense Hub (Required) | 1 | $29.92 | FREE |
| Accessories | Wyze MicroSD Card (256GB) | 2 | — | $41.96 |
| Plan / Home monitoring plan | Cam Unlimited | 1 | $12.99/mo | $9.99/mo |
| Shipping | Fast Shipping | Not displayed | $5.99 | FREE |

- Financing: `as low as $19.19/mo`.
- Compare-at total: `$238.81`.
- Current total: `$187.89`.
- Savings: `$50.92`.
- Message: `Congrats! You’re saving $50.92 on your security bundle!`
- Guarantee: `100% Wyze satisfaction guarantee`; `Try worry-free for 30 days`.
- Primary action: `Checkout`.
- Secondary action: `Save my system for later`.
