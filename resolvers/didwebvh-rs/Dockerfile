# MSRV follows didwebvh-rs (see upstream Cargo.toml rust-version).
FROM rust:1-bookworm AS builder
WORKDIR /app
COPY Cargo.toml ./
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/uber-resolver-didwebvh-rs /usr/local/bin/uber-resolver-didwebvh-rs
ENV PORT=8081
EXPOSE 8081
USER nobody
CMD ["uber-resolver-didwebvh-rs"]
