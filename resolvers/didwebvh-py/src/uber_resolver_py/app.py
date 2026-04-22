"""HTTP microservice: POST/GET `/resolve` backed by did-webvh."""

from __future__ import annotations

import os

from did_webvh.resolver import resolve as resolve_did_url
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI(title="uber-resolver-didwebvh-py", version="0.1.0")
ENGINE = "didwebvh-py"


class ResolveBody(BaseModel):
    did: str = Field(..., min_length=1, description="did:webvh identifier")


def _status_for_payload(data: dict) -> int:
    meta = data.get("didResolutionMetadata") or {}
    err = meta.get("error")
    if not err:
        return 200
    if err == "notFound":
        return 404
    return 400


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "engine": ENGINE}


async def _resolve(did: str) -> JSONResponse:
    trimmed = did.strip()
    if not trimmed.startswith("did:webvh:"):
        raise HTTPException(
            status_code=400,
            detail='Invalid "did": expected non-empty did:webvh identifier',
        )
    data = await resolve_did_url(trimmed)
    return JSONResponse(content=data, status_code=_status_for_payload(data))


@app.post("/resolve")
async def resolve_post(body: ResolveBody) -> JSONResponse:
    return await _resolve(body.did)


@app.get("/resolve")
async def resolve_get(did: str | None = None) -> JSONResponse:
    if not did:
        raise HTTPException(status_code=400, detail='Missing required query parameter "did"')
    return await _resolve(did)


def run() -> None:
    import uvicorn

    port = int(os.environ.get("PORT", "8082"))
    uvicorn.run(
        "uber_resolver_py.app:app",
        host="0.0.0.0",
        port=port,
        factory=False,
    )


if __name__ == "__main__":
    run()
