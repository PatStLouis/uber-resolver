# Reference libraries (`did:webvh`)

Each small resolver service in this repo is a thin **HTTP adapter** around the matching official implementation from **decentralized-identity**. All three target the same method: **`did:webvh`** (did:web + verified history).

| Language | Upstream repo | Role in uber-resolver |
|----------|---------------|------------------------|
| TypeScript | [decentralized-identity/didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts) | `resolvers/typescript/` — e.g. call `resolveDID()` from the published package (see upstream Express/Elysia examples). |
| Rust | [decentralized-identity/didwebvh-rs](https://github.com/decentralized-identity/didwebvh-rs) | `resolvers/rust/` — depend on the `didwebvh` crate (see upstream `resolve` example: `cargo run --example resolve -- <DID>`). |
| Python | [decentralized-identity/didwebvh-py](https://github.com/decentralized-identity/didwebvh-py) | `resolvers/python/` — e.g. shell out to or import from `did_webvh` (upstream documents `python3 -m did_webvh.resolver "<did>"`). |

## Version alignment

The three codebases evolve independently. For **comparable** behavior across uber-resolver engines:

- Pin **released versions** (or known SHAs) per service.
- Run **shared golden vectors** in CI (`contracts/fixtures/`) and assert on a **normalized** JSON shape at the gateway (not on byte-identical library output).

## Licensing note

Upstream repos use **Apache-2.0** (verify on each repo). This umbrella repo currently uses **MIT**; if you vendor or redistribute large portions of upstream code, reconcile licenses (e.g. move uber-resolver to Apache-2.0 to match, or keep MIT and only depend on crates/packages as normal dependencies).
