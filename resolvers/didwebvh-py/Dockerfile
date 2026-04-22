FROM python:3.12-slim-bookworm
WORKDIR /app
COPY pyproject.toml ./
COPY src ./src
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir .
ENV PORT=8082
EXPOSE 8082
USER nobody
CMD ["uber-resolver-didwebvh-py"]
