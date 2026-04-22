# Architecture

```text
 Client (browser / CLI)
        |
        v
   [ gateway ]  ---------->  [ resolver-rust ]
        |        ---------->  [ resolver-python ]
        |        ---------->  [ resolver-ts ]
        v
   Normalized JSON response
```

1. **Gateway** owns CORS, auth, timeouts, logging, and `resolver` routing.
2. **Resolver services** each expose the same internal endpoint (e.g. `POST /internal/resolve`) and implement method-specific logic.
3. **Contracts** live in `contracts/`; CI runs golden vectors against all three.

## Routing examples

- **Explicit:** `{ "did": "did:...", "resolver": "rust" }`
- **Auto:** try ordered list or parallel with first success / merged errors (policy TBD per product need).

## DID notes

- Normalize output shape at the gateway so clients stay dumb.
- Add conformance tests: same input → compare structured output across implementations (allow documented differences for optional fields).
