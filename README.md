# uber-resolver

One API surface, multiple DID resolver implementations (Rust, Python, TypeScript) behind a small gateway. The frontend talks only to the gateway; the gateway delegates to a selected engine (or runs comparison / fallback policies).

## Layout (planned)

| Path | Role |
|------|------|
| `gateway/` | HTTP BFF: routes `POST /v1/resolve` to the chosen resolver service; normalizes responses. |
| `resolvers/rust/` | Rust resolver HTTP service. |
| `resolvers/python/` | Python resolver HTTP service. |
| `resolvers/typescript/` | TypeScript (Node) resolver HTTP service. |
| `contracts/` | Shared request/response schema (e.g. OpenAPI or JSON Schema) + golden test vectors. |

## Principles

- **Same contract** for every implementation (input DID, output DID document / resolution metadata).
- **Separate processes** (containers), not one polyglot binary.
- **Delegation** via gateway: `resolver` field or header (`rust` \| `python` \| `ts` \| `auto`).

## Status

Repository scaffold only — implementations and CI to follow.

## License

MIT — see [LICENSE](LICENSE).
