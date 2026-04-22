# Python resolver (`did:webvh`)

Thin HTTP service (e.g. FastAPI) that uses **[didwebvh-py](https://github.com/decentralized-identity/didwebvh-py)**.

Upstream documents CLI resolution:

```bash
python3 -m did_webvh.resolver "did:webvh:…"
```

The HTTP adapter should call the same library entry points the resolver module uses (avoid parsing CLI output in production). Install via **Poetry** as in upstream `pyproject.toml`.
