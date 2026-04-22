# Gateway (BFF)

Planned stack: lightweight HTTP server that proxies to resolver services and enforces a single public API.

Responsibilities:

- Route by `resolver` (or default).
- Uniform error envelope and timeouts.
- Optional: parallel “compare all” mode for development.
