# EcomExperts Bundle Builder

A responsive full-stack security system configurator implemented based on Figma design specifications. It allows users to dynamically customize a security system bundle (cameras, monitoring plans, sensors, and accessories), view live selections, track real-time pricing and savings, persist system configurations, place orders, and review past order histories.

The project is structured as a monorepo consisting of:
- **Frontend (Client)**: Built with React, TypeScript, Vite, and CSS Modules.
- **Backend (Server)**: A Node.js/Express API with TSX, TypeScript, Zod validation, and local JSON persistence.

## Features

- **Four-Step Bundle Builder Accordion**: Smooth and responsive vertical layout with active step tracking and visual states.
- **Data-Driven Products**: Products, variants, plans, accessories, and pricing parameters are served dynamically from the backend API.
- **Independent Quantities per Variant**: Multiple color variants (e.g. White, Black) can be selected independently for a single product without resetting other variants' choices.
- **Synchronized Controls**: Changes in product card quantities are immediately reflected in the sidebar review panel, and vice versa, through unified state management.
- **Live Totals and Savings**: Calculation of real-time prices, original values, total savings, and shipping costs.
- **Save Configuration for Later**: Browser-local storage persistence to save and restore configurations across page visits.
- **Order Placement & Persistence**: Clicking "Confirm checkout" saves the completed configuration (ordered items, total price, total savings) to a backend JSON database file.
- **Orders History Modal**: An accessible past orders drawer showing all previously placed orders, loaded directly from the database.
- **Interactive "Learn More" Product Modal**: Opens a beautiful product sheet in the center of the screen with a blurred glass backdrop effect, listing high-fidelity features and key technical specifications.
- **Responsive Layouts**: Designed to scale across desktop (`1540px` and `1440px`), tablet (`1024px` and `768px`), and mobile viewports (`390px` and `320px`) without any horizontal overflow.
- **Theme Switcher**: Floating theme toggle supporting Light Mode and a custom grey-blue Dark Mode.
- **Accessibility (a11y)**: Accessible controls, `aria-*` tags, keyboard focus trapping, visible `:focus-visible` outlines, and respect for `prefers-reduced-motion`.

## Tech Stack

### Frontend
- **Framework**: React (v19)
- **Tooling**: TypeScript, Vite
- **Styling**: Vanilla CSS Modules (with CSS variables/custom properties)
- **Tests**: Vitest, React Testing Library, Playwright (E2E)

### Backend
- **Framework**: Node.js, Express (v5)
- **Tooling**: TypeScript, TSX, Zod (runtime validation)
- **Security**: Helmet, CORS

## Project Structure

```text
.
├── api/                    Vercel serverless function entry point
├── client/                 React Frontend application
│   ├── src/api/            API client
│   ├── src/assets/         Local product images, variants, and icons
│   ├── src/components/     Reusable UI components (Accordion, ReviewPanel, etc.)
│   ├── src/context/        State Context provider
│   ├── src/state/          Reducer, selectors, and localStorage persistence
│   ├── src/styles/         Global variables, theme tokens, and resets
│   └── tests/e2e/          Playwright end-to-end and layout geometry tests
├── server/                 Express Backend application
│   └── src/
│       ├── data/           Authoritative bundle and orders JSON files
│       ├── schemas/        Zod schemas for schema validation
│       └── app.ts          Express app definitions and endpoints
└── vercel.json             Vercel monorepo configuration
```

## Getting Started

To clone the repository and start both frontend and backend development servers:

```bash
# Clone the repository
git clone https://github.com/ahmedfaheem3006/ecomexperts-bundle-builder.git

# Navigate into the project root
cd ecomexperts-bundle-builder

# Install dependencies across all monorepo workspaces
npm install

# Start frontend (Vite) and backend (Express) concurrently
npm run dev
```

The application will be accessible at:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3001`

## Available Scripts

Run these scripts from the repository root:

- `npm run dev`: Starts both frontend and backend development servers concurrently.
- `npm run build`: Compiles, type-checks, and builds production bundles for both client and server.
- `npm run lint`: Runs ESLint checks on client and server workspaces.
- `npm run test`: Runs the Vitest test suites (unit and integration tests).
- `npm run test:e2e`: Runs the Playwright E2E browser tests.

## API Endpoints

- `GET /api/health`: Health status endpoint.
- `GET /api/bundle`: Returns Figma-validated bundle steps, products, categories, pricing, financing, and shipping data.
- `GET /api/orders`: Retrieves past orders list from the database.
- `POST /api/orders`: Saves a new checked out order configuration to the database.

## State and Variant Model

- **Single Source of Truth**: Active configuration states (active variants, quantities) are managed through a single centralized reducer.
- **Independent Variant Quantities**: Quantity states are tracked independently using keys in the form `productId:variantId`. Selecting or changing a variant does not reset choices or quantities for other variants.
- **Synchronized UI Elements**: Product cards and review panels consume the exact same state context, eliminating synchronization lag.
- **Selected Counts**: "N selected" displays represent distinct products in the step that have a quantity greater than zero.

## Persistence

- The "Save my system for later" feature packages the active configuration state and writes a versioned payload to `localStorage`.
- On page load, the initializer validates schema versions, step IDs, quantity-key matching, integer checks, and active variants. Malformed storage states fallback safely to initial defaults.

## Design Decisions

- **Dynamic Styling**: Handled via CSS Custom Properties (`tokens.css`) and modular CSS Modules, allowing clean overrides for the Dark Theme.
- **Responsive Layout Grids**: Implemented using pure CSS Grid and Flexbox for fluid layouts, adapting gracefully to tablet and mobile stacks without absolute positioning.
- **Local Assets**: All images and product SVGs are bundled locally to prevent broken images.

## Tradeoffs and Known Limitations

- **Checkout Flow**: Confirms and logs orders via API into a backend JSON file. Payment gateway integration is simulated.
- **Database Engine**: Uses a local filesystem JSON file (`orders.json`) for data persistence. This matches the project requirements without needing an external database setup.
- **Commercial Fonts**: System fallbacks are configured in CSS in place of Gilroy and TT Norms Pro.

## Testing

- **Vitest & RTL**: Cover reducer logic, local storage restoration, checkout, variant boundaries, and component-level rendering.
- **Playwright**: Automate viewport geometry checking, accessibility compliance, keyboard navigations, focus trapping, horizontal overflows, and error detection.
