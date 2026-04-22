export type EngineId = 'didwebvh-rs' | 'didwebvh-py' | 'didwebvh-ts'

export const ENGINES: EngineId[] = ['didwebvh-rs', 'didwebvh-py', 'didwebvh-ts']

const PROXY_BASE: Record<EngineId, string> = {
  'didwebvh-rs': '/engine/didwebvh-rs',
  'didwebvh-py': '/engine/didwebvh-py',
  'didwebvh-ts': '/engine/didwebvh-ts',
}

function envBase(engine: EngineId): string | undefined {
  const map: Record<EngineId, string | undefined> = {
    'didwebvh-rs': import.meta.env.VITE_ENGINE_DIDWEBVH_RS,
    'didwebvh-py': import.meta.env.VITE_ENGINE_DIDWEBVH_PY,
    'didwebvh-ts': import.meta.env.VITE_ENGINE_DIDWEBVH_TS,
  }
  const v = map[engine]
  return v && v.length > 0 ? v.replace(/\/$/, '') : undefined
}

/** Base URL for a resolver (no trailing slash). Uses Vite dev proxy when env overrides are unset. */
export function engineBaseUrl(engine: EngineId): string {
  return envBase(engine) ?? PROXY_BASE[engine]
}

export type HealthResponse = {
  status: string
  engine: string
}

export async function fetchHealth(engine: EngineId): Promise<HealthResponse> {
  const res = await fetch(`${engineBaseUrl(engine)}/health`)
  if (!res.ok) {
    throw new Error(`Health check failed (${res.status})`)
  }
  return (await res.json()) as HealthResponse
}

export type ResolvePayload = Record<string, unknown>

export async function fetchResolve(
  engine: EngineId,
  did: string,
): Promise<{ status: number; body: ResolvePayload | string }> {
  const res = await fetch(`${engineBaseUrl(engine)}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ did: did.trim() }),
  })
  const text = await res.text()
  let body: ResolvePayload | string
  try {
    body = JSON.parse(text) as ResolvePayload
  } catch {
    body = text
  }
  return { status: res.status, body }
}
