# EcomExperts Bundle Builder

Production-ready React and Express monorepo scaffold for the Bundle Builder assignment.
This phase intentionally contains no product interface, product data, or downloaded Figma assets.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Workspace layout

```text
.
├── client/   # React, TypeScript, Vite, CSS Modules, Vitest, RTL, Playwright
├── server/   # Express, TypeScript, Zod, Helmet, CORS
├── docs/     # Architecture and development notes
├── package.json
└── README.md
```

## Setup

```bash
npm install
```

Copy the environment examples only when you need to override their defaults:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

## Development

Run the frontend and backend together from the repository root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health endpoint: http://localhost:3001/api/health

The Vite development server proxies `/api` requests to the backend.

To run either workspace independently:

```bash
npm run dev --workspace client
npm run dev --workspace server
```

## Quality commands

```bash
npm run lint
npm run build
npm run test
npm run test:e2e
```

Playwright browser binaries may be installed when end-to-end tests are first used:

```bash
npx playwright install
```
