//! HTTP microservice: `POST /resolve` and `GET /resolve?did=` backed by `didwebvh-rs`.

use axum::{
    extract::Query,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use didwebvh_rs::log_entry::LogEntryMethods;
use didwebvh_rs::prelude::*;
use didwebvh_rs::resolve::ResolveOptions;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

#[derive(Deserialize)]
struct ResolveRequest {
    did: String,
}

#[derive(Deserialize)]
struct ResolveQuery {
    did: Option<String>,
}

#[derive(Serialize)]
struct Health {
    status: &'static str,
    engine: &'static str,
}

fn w3c_success(did: &str, document: serde_json::Value, doc_meta: serde_json::Value) -> serde_json::Value {
    json!({
        "@context": "https://w3id.org/did-resolution/v1",
        "didDocument": document,
        "didDocumentMetadata": doc_meta,
        "didResolutionMetadata": {
            "contentType": "application/did+ld+json",
            "did": did,
            "driver": "uber-resolver-didwebvh-rs/didwebvh-rs"
        }
    })
}

fn w3c_error(did: &str, err: &str, code: &str) -> serde_json::Value {
    json!({
        "@context": "https://w3id.org/did-resolution/v1",
        "didDocument": null,
        "didDocumentMetadata": {},
        "didResolutionMetadata": {
            "error": code,
            "did": did,
            "detail": err,
            "driver": "uber-resolver-didwebvh-rs/didwebvh-rs"
        }
    })
}

fn status_for_error(e: &DIDWebVHError) -> StatusCode {
    match e {
        DIDWebVHError::NotFound(_) => StatusCode::NOT_FOUND,
        DIDWebVHError::NetworkError { status_code: Some(404), .. } => StatusCode::NOT_FOUND,
        DIDWebVHError::DeactivatedError(_) => StatusCode::GONE,
        DIDWebVHError::InvalidMethodIdentifier(_) | DIDWebVHError::DIDError(_) => StatusCode::BAD_REQUEST,
        DIDWebVHError::NetworkError { .. } => StatusCode::BAD_GATEWAY,
        _ => StatusCode::BAD_REQUEST,
    }
}

async fn resolve_did(did: &str) -> Result<Response, DIDWebVHError> {
    let mut state = DIDWebVHState::default();
    let options = ResolveOptions::default();
    let (entry, meta) = state.resolve_owned(did, options).await?;
    let document = entry.get_did_document()?;
    let doc_meta = serde_json::to_value(&meta).map_err(|e| DIDWebVHError::DIDError(e.to_string()))?;
    let body = w3c_success(did, document, doc_meta);
    Ok((StatusCode::OK, Json(body)).into_response())
}

async fn resolve_post(Json(payload): Json<ResolveRequest>) -> Response {
    let did = payload.did.trim();
    if did.is_empty() || !did.starts_with("did:webvh:") {
        return (
            StatusCode::BAD_REQUEST,
            Json(w3c_error(
                did,
                "body must include non-empty string field \"did\" starting with did:webvh:",
                "invalidDid",
            )),
        )
            .into_response();
    }
    match resolve_did(did).await {
        Ok(r) => r,
        Err(e) => {
            let status = status_for_error(&e);
            let code = if status == StatusCode::NOT_FOUND {
                "notFound"
            } else {
                "invalidDid"
            };
            (status, Json(w3c_error(did, &e.to_string(), code))).into_response()
        }
    }
}

async fn resolve_get(Query(q): Query<ResolveQuery>) -> Response {
    resolve_post(Json(ResolveRequest {
        did: q.did.unwrap_or_default(),
    }))
    .await
}

async fn health() -> Json<Health> {
    Json(Health {
        status: "ok",
        engine: "didwebvh-rs",
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .init();

    let app = Router::new()
        .route("/health", get(health))
        .route("/resolve", get(resolve_get).post(resolve_post))
        .layer(TraceLayer::new_for_http());

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(8081);
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("uber-resolver-didwebvh-rs listening on http://{addr}");
    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");
    axum::serve(listener, app).await.expect("serve");
}
