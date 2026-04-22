# TypeScript resolver (`did:webvh`)

HTTP service on **`POST /resolve`** and **`GET /resolve?did=`** using **[didwebvh-ts](https://www.npmjs.com/package/didwebvh-ts)** ([repo](https://github.com/decentralized-identity/didwebvh-ts)).

## Run (local)

Requires **Node ≥ 20**.

```bash
cd resolvers/didwebvh-ts
npm install
npm start
# listens on PORT or 8083
```

## Docker

```bash
docker build -t uber-resolver-didwebvh-ts .
docker run --rm -p 8083:8083 uber-resolver-didwebvh-ts
```

## Dependency

Bump **`didwebvh-ts`** in `package.json` when upgrading.
