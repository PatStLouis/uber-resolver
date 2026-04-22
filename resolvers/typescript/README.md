# TypeScript resolver (`did:webvh`)

Thin HTTP service that calls **[didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts)**.

Upstream exposes `resolveDID(did, options?)` and example HTTP servers (Express / Elysia) under `examples/` — this repo should follow the same pattern: one route, map errors to HTTP status, return JSON suitable for gateway normalization.

**Dependency:** add the upstream package **`didwebvh-ts`** from npm (see [didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts) `package.json` / install instructions).
