# WebVH playground (React + shadcn)

Single-page UI to call the three **`did:webvh`** resolver microservices (`POST /resolve`, `GET /health`), similar in spirit to the [Universal Resolver dev UI](https://dev.uniresolver.io/) but scoped to WebVH engines in this repo.

## Run

1. Start one or more resolvers (e.g. `docker compose up` from repo root, or run each service on **8081–8083**).
2. From this directory:

```bash
npm install
npm run dev
```

The Vite dev server proxies:

| Path prefix              | Target (default)   |
|-------------------------|--------------------|
| `/engine/didwebvh-rs/*` | `http://127.0.0.1:8081` |
| `/engine/didwebvh-py/*` | `http://127.0.0.1:8082` |
| `/engine/didwebvh-ts/*` | `http://127.0.0.1:8083` |

Override bases with `VITE_ENGINE_DIDWEBVH_RS` (and `_PY` / `_TS`) — see `.env.example`.

## Build

```bash
npm run build
npm run preview
```
