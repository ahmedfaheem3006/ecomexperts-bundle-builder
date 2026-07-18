# Workspace architecture

## Client

The `client` workspace is a Vite-powered React application using strict TypeScript.
Component-scoped styles use CSS Modules, while shared values are exposed through CSS
custom properties. Vitest and React Testing Library cover component behavior, and
Playwright is configured for browser-level tests.

The development server proxies requests beginning with `/api` to the Express server.
The proxy target defaults to `http://localhost:3001` and can be changed with
`VITE_API_PROXY_TARGET`.

## Server

The `server` workspace separates Express application construction from process startup.
This keeps middleware and routes directly testable. Helmet adds security headers, CORS
restricts browser access to the configured frontend origin, and Zod validates runtime
configuration.

The server defaults to port `3001`. `GET /api/health` returns a small JSON readiness
response and does not depend on product-domain data.

## Root orchestration

The root package uses npm workspaces. `npm run dev` starts both workspaces concurrently;
the remaining root scripts delegate building, linting, and testing to each workspace.
