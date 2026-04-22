# Python resolver (`did:webvh`)

HTTP service on **`POST /resolve`** and **`GET /resolve?did=`** using the **[did-webvh](https://pypi.org/project/did-webvh/)** package (from [didwebvh-py](https://github.com/decentralized-identity/didwebvh-py)).

## Run (local)

```bash
cd resolvers/didwebvh-py
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uber-resolver-didwebvh-py
# or: uvicorn uber_resolver_py.app:app --host 0.0.0.0 --port 8082
```

Default port **8082** (override with `PORT`).

## Dependency

Bump **`did-webvh`** in `pyproject.toml` to pick up new upstream releases.
