# Architecture

Scope: **`did:webvh`** resolution only. Each language worker delegates to **[didwebvh-rs](https://github.com/decentralized-identity/didwebvh-rs)**, **[didwebvh-py](https://github.com/decentralized-identity/didwebvh-py)**, or **[didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts)** (see [REFERENCE_IMPLEMENTATIONS.md](REFERENCE_IMPLEMENTATIONS.md)).

```text
 Client (browser / CLI)
        |
        v
   [ gateway ]  ---------->  [ resolver-rust ]   --> didwebvh-rs
        |        ---------->  [ resolver-python ] --> didwebvh-py
        |        ---------->  [ resolver-ts ]     --> didwebvh-ts
        v
   Normalized JSON response
```

1. **Gateway** owns CORS, auth, timeouts, logging, and `resolver` routing.
2. **Resolver services** each expose the same internal endpoint (e.g. `POST /internal/resolve`) and call the upstream library’s resolution API (no duplicate crypto/spec logic in uber-resolver).
3. **Contracts** live in `contracts/`; CI runs golden vectors against all three.

## Routing examples

- **Explicit:** `{ "did": "did:...", "resolver": "rust" }`
- **Auto:** try ordered list or parallel with first success / merged errors (policy TBD per product need).

## DID notes

- Normalize output shape at the gateway so clients stay dumb.
- Add conformance tests: same input → compare structured output across implementations (allow documented differences for optional fields).
