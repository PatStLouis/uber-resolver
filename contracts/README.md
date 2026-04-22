# API contracts

See **[openapi.yaml](openapi.yaml)** for the shared **`/health`** and **`/resolve`** contract used by all three microservices.

Place additional **JSON Schema** definitions or golden vectors here for:

- `ResolveRequest` — at minimum `{ "did": string, "resolver"?: "didwebvh-rs" | "didwebvh-py" | "didwebvh-ts" | "auto" }` where `did` is a **`did:webvh`** identifier for v1.
- `ResolveResponse` — normalized shape aligned with **W3C DID resolution** (map each library’s output to `didDocument` / `didResolutionMetadata` / `didDocumentMetadata` as needed so the gateway and UI stay agnostic).

Golden test vectors (JSON files) can live under `contracts/fixtures/` for CI — same DID string exercised against all three upstream-backed services.
