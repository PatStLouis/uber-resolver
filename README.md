# uber-resolver

One API surface, multiple **`did:webvh`** resolver implementations (Rust, Python, TypeScript) behind a small gateway. The frontend talks only to the gateway; the gateway delegates to a selected engine (or runs comparison / fallback policies).

Each resolver is a thin HTTP service wrapping the corresponding **decentralized-identity** library:

- TypeScript: [didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts)
- Rust: [didwebvh-rs](https://github.com/decentralized-identity/didwebvh-rs)
- Python: [didwebvh-py](https://github.com/decentralized-identity/didwebvh-py)

Canonical source repository: [github.com/OpSecId/uber-resolver](https://github.com/OpSecId/uber-resolver).

See [docs/REFERENCE_IMPLEMENTATIONS.md](docs/REFERENCE_IMPLEMENTATIONS.md) for integration notes and version alignment.

## Layout (planned)

| Path | Role |
|------|------|
| `gateway/` | HTTP BFF: routes `POST /v1/resolve` to the chosen resolver service; normalizes responses. |
| `resolvers/didwebvh-rs/` | Rust resolver HTTP service (didwebvh-rs). |
| `resolvers/didwebvh-py/` | Python resolver HTTP service (didwebvh-py). |
| `resolvers/didwebvh-ts/` | TypeScript (Node) resolver HTTP service (didwebvh-ts). |
| `contracts/` | Shared request/response schema (e.g. OpenAPI or JSON Schema) + golden test vectors. |
| `frontend/` | React + shadcn playground for `did:webvh` resolution (proxies to the three engines in dev). |

## Principles

- **Same contract** for every implementation (input DID, output DID document / resolution metadata).
- **Separate processes** (containers), not one polyglot binary.
- **Delegation** via gateway: `resolver` field or header (`didwebvh-rs` \| `didwebvh-py` \| `didwebvh-ts` \| `auto`).

## Run the three resolvers (local)

| Service | Port | Command |
|---------|------|---------|
| didwebvh-rs | `8081` | `cd resolvers/didwebvh-rs && cargo run` |
| didwebvh-py | `8082` | `cd resolvers/didwebvh-py && python3 -m venv .venv && . .venv/bin/activate && pip install -e . && uber-resolver-didwebvh-py` |
| didwebvh-ts | `8083` | `cd resolvers/didwebvh-ts && npm install && npm start` |

**API (each service):**

- `GET /health` — `{ "status": "ok", "engine": "didwebvh-rs" \| "didwebvh-py" \| "didwebvh-ts" }`
- `POST /resolve` — JSON body `{ "did": "did:webvh:…" }`
- `GET /resolve?did=did:webvh:…` — convenience alias

Response shape follows W3C DID Resolution where applicable; see [`contracts/openapi.yaml`](contracts/openapi.yaml).

**Docker Compose** (builds all three):

```bash
docker compose up --build
```

**Web playground** (optional): from `frontend/`, run `npm install && npm run dev` while resolvers listen on **8081–8083** (or set `VITE_ENGINE_*` in `.env`). See [`frontend/README.md`](frontend/README.md).

## Status

Resolver microservices implemented; gateway and golden-vector CI still optional follow-ups.

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
