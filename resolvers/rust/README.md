# Rust resolver (`did:webvh`)

Thin HTTP service (e.g. Axum) that uses **[didwebvh-rs](https://github.com/decentralized-identity/didwebvh-rs)** as a library dependency.

Upstream documents a **`resolve`** example: `cargo run --example resolve -- <DID>` — the resolver API here should invoke the same resolution path the example uses, then serialize the result for the gateway.

**Crate:** follow upstream `Cargo.toml` (crate name and features may change with releases; pin a version for reproducible comparisons across the three engines).
