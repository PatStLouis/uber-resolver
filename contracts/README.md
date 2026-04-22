# API contracts

Place **OpenAPI** or **JSON Schema** definitions here for:

- `ResolveRequest` — at minimum `{ "did": string, "resolver"?: "rust" | "python" | "ts" | "auto" }`
- `ResolveResponse` — normalized DID resolution result (TBD per supported methods)

Golden test vectors (JSON files) can live under `contracts/fixtures/` for CI.
