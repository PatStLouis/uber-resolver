# Reference libraries (`did:webvh`)

Each small resolver service in this repo is a thin **HTTP adapter** around the matching official implementation from **decentralized-identity**. All three target the same method: **`did:webvh`** (did:web + verified history).

| Language | Upstream repo | Role in uber-resolver |
|----------|---------------|------------------------|
| TypeScript | [decentralized-identity/didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts) | `resolvers/didwebvh-ts/` — e.g. call `resolveDID()` from the published package (see upstream Express/Elysia examples). |
| Rust | [decentralized-identity/didwebvh-rs](https://github.com/decentralized-identity/didwebvh-rs) | `resolvers/didwebvh-rs/` — depend on the `didwebvh` crate (see upstream `resolve` example: `cargo run --example resolve -- <DID>`). |
| Python | [decentralized-identity/didwebvh-py](https://github.com/decentralized-identity/didwebvh-py) | `resolvers/didwebvh-py/` — e.g. shell out to or import from `did_webvh` (upstream documents `python3 -m did_webvh.resolver "<did>"`). |

## Version alignment

The three codebases evolve independently. For **comparable** behavior across uber-resolver engines:

- Pin **released versions** (or known SHAs) per service.
- Run **shared golden vectors** in CI (`contracts/fixtures/`) and assert on a **normalized** JSON shape at the gateway (not on byte-identical library output).

## Licensing note

This repository is **Apache-2.0**, consistent with **[didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts)**, **[didwebvh-rs](https://github.com/decentralized-identity/didwebvh-rs)**, and **[didwebvh-py](https://github.com/decentralized-identity/didwebvh-py)** (confirm current SPDX on each upstream repo when upgrading pins). Normal **dependency** use (crates.io / npm / PyPI) does not require vendoring; if you copy substantial upstream source into this tree, preserve their copyright and license headers as required.
