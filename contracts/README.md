# API contracts

Place **OpenAPI** or **JSON Schema** definitions here for:

- `ResolveRequest` — at minimum `{ "did": string, "resolver"?: "rust" | "python" | "ts" | "auto" }` where `did` is a **`did:webvh`** identifier for v1.
- `ResolveResponse` — normalized shape aligned with **W3C DID resolution** (map each library’s output to `didDocument` / `didResolutionMetadata` / `didDocumentMetadata` as needed so the gateway and UI stay agnostic).

Golden test vectors (JSON files) can live under `contracts/fixtures/` for CI — same DID string exercised against all three upstream-backed services.
