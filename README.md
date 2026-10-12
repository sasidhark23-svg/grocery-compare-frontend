# GroceryCompare Frontend

React frontend for GroceryCompare, a grocery catalog and store price comparison demo.

[Backend repository](https://github.com/sasidhark23-svg/grocery-compare-backend) · [Original combined repository](https://github.com/sasidhark23-svg/grocery-compare)

> Catalog entries, prices, availability, and sample history are illustrative demo data, not verified live retailer information.

## Features

- Search products and filter by category and brand.
- View product details, compare store prices, and explore available price history.
- Register, sign in, and manage a profile.
- Save favorite products and stores.
- Create shopping lists, compare list costs, and manage price alerts.
- Access an admin dashboard with role-based frontend routes.

The backend enforces API access rules; frontend route guards alone do not secure data.

## Technology

React 18, Vite 5, Tailwind CSS, Zustand, Axios, React Router, Recharts, Framer Motion, and Lucide icons.

## Local setup

Requires Node.js 20 or later, npm, Git, and the running [backend](https://github.com/sasidhark23-svg/grocery-compare-backend#local-setup).

```sh
git clone https://github.com/sasidhark23-svg/grocery-compare-frontend.git
cd grocery-compare-frontend
npm ci
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173). During development, Vite forwards `/api` requests to `http://127.0.0.1:8080`. Start the backend separately on port 8080.

Use `npm run dev:frontend` for this separate repository. The existing `npm run dev` and `npm run dev:backend` scripts use a launcher that expects a sibling directory named `backend` and an installed `mvn` command. A checkout named `grocery-compare-backend` does not match that path.

## API configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Backend base URL, including the `/api` suffix. |

For a separately hosted API, set the variable before starting Vite or building:

**PowerShell**

```powershell
$env:VITE_API_BASE_URL = "https://api.example.com/api"
npm run build
```

**macOS / Linux**

```sh
VITE_API_BASE_URL=https://api.example.com/api npm run build
```

Replace the example URL with your backend address. Vite embeds this setting into the build; changing a hosting runtime variable after the build does not update an existing bundle. Variables prefixed with `VITE_` are visible to the browser, so do not put secrets in them.

For direct cross-origin API requests, configure the backend's `CORS_ALLOWED_ORIGINS` with the frontend origin, such as `https://frontend.example.com`, without a path or trailing slash.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile. |
| `npm run dev:frontend` | Start the standalone frontend development server. |
| `npm run lint` | Run ESLint with zero allowed warnings. |
| `npm run build` | Build production assets in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run dev` | Start Vite and the legacy sibling-backend launcher. |
| `npm run dev:backend` | Run only the legacy sibling-backend launcher. |

## Deployment

For static hosting, use the repository root as the project directory, `npm ci && npm run build` as the build command, and `dist` as the output directory. Set `VITE_API_BASE_URL` before the build. Configure the host to serve `index.html` for application routes so refreshing a nested route works.

The included Dockerfile builds the app and serves it with Nginx:

```sh
docker build --build-arg VITE_API_BASE_URL=/api -t grocerycompare-frontend .
```

The included `nginx.conf` forwards `/api/` to `http://backend:8080` and provides SPA route fallback. Run the frontend container on a Docker network where the backend is reachable as `backend`, for example through that container name or a network alias. The current Nginx configuration expects that hostname to resolve at startup, even when the app was built with an absolute API URL.

## Project layout

```text
src/
  components/    Shared UI and route guards
  pages/         Catalog, account, shopping, and admin screens
  services/      Axios API client and domain service calls
  store/         Authentication state
  App.jsx        Application routes
  main.jsx       React entry point
scripts/
  start-backend.js  Legacy sibling-backend launcher
Dockerfile
nginx.conf
vite.config.js
```

## Troubleshooting

- **API requests fail locally:** confirm the backend is listening on port 8080 and `http://localhost:8080/api/health` responds.
- **CORS errors with a separate API host:** allow the exact frontend origin through the backend's `CORS_ALLOWED_ORIGINS`.
- **A deployed route returns 404 on refresh:** configure SPA fallback to `index.html`.
- **The backend launcher cannot find Maven or its folder:** start the backend from its own checkout and run `npm run dev:frontend`.
- **Nginx reports that the backend host cannot be found:** attach both containers to the same Docker network with the backend hostname `backend`.
