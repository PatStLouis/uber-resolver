import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, GitBranch, Loader2, Sparkles } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  ENGINES,
  type EngineId,
  type HealthResponse,
  type ResolvePayload,
  fetchHealth,
  fetchResolve,
} from '@/lib/resolver-api'

type Mode = 'single' | 'compare'

type EngineHealth = { engine: EngineId; ok: boolean; detail?: string; health?: HealthResponse }

async function probeEngines(): Promise<EngineHealth[]> {
  const next: EngineHealth[] = []
  for (const e of ENGINES) {
    try {
      const h = await fetchHealth(e)
      next.push({ engine: e, ok: true, health: h })
    } catch (err) {
      next.push({
        engine: e,
        ok: false,
        detail: err instanceof Error ? err.message : 'Unreachable',
      })
    }
  }
  return next
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function extractDocParts(payload: ResolvePayload | string | null) {
  if (!payload || typeof payload === 'string') {
    return { doc: null, resMeta: null, docMeta: null, raw: payload }
  }
  const doc = (payload as { didDocument?: unknown }).didDocument
  const resMeta = (payload as { didResolutionMetadata?: unknown }).didResolutionMetadata
  const docMeta = (payload as { didDocumentMetadata?: unknown }).didDocumentMetadata
  return { doc, resMeta, docMeta, raw: payload }
}

export function WebVhResolver() {
  const [mode, setMode] = useState<Mode>('single')
  const [engine, setEngine] = useState<EngineId>('didwebvh-rs')
  const [did, setDid] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [health, setHealth] = useState<EngineHealth[]>(() =>
    ENGINES.map((e) => ({ engine: e, ok: false })),
  )

  const [singleResult, setSingleResult] = useState<{
    status: number
    body: ResolvePayload | string
  } | null>(null)

  const [compareResults, setCompareResults] = useState<
    Partial<
      Record<
        EngineId,
        { status: number; body: ResolvePayload | string; ms: number } | { error: string }
      >
    >
  >({})

  const refreshHealth = useCallback(async () => {
    setHealth(await probeEngines())
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const next = await probeEngines()
      if (!cancelled) {
        setHealth(next)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const canResolve = useMemo(() => did.trim().length > 0 && !loading, [did, loading])

  const onResolve = async () => {
    setError(null)
    setLoading(true)
    setSingleResult(null)
    setCompareResults({})
    try {
      if (mode === 'single') {
        const { status, body } = await fetchResolve(engine, did)
        setSingleResult({ status, body })
      } else {
        const out: Partial<
          Record<
            EngineId,
            { status: number; body: ResolvePayload | string; ms: number } | { error: string }
          >
        > = {}
        await Promise.all(
          ENGINES.map(async (e) => {
            const t0 = performance.now()
            try {
              const { status, body } = await fetchResolve(e, did)
              out[e] = { status, body, ms: Math.round(performance.now() - t0) }
            } catch (err) {
              out[e] = { error: err instanceof Error ? err.message : 'Request failed' }
            }
          }),
        )
        setCompareResults(out)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resolve failed')
    } finally {
      setLoading(false)
    }
  }

  const renderResultTabs = (status: number, body: ResolvePayload | string) => {
    const { doc, resMeta, docMeta, raw } = extractDocParts(body)
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status >= 400 ? 'destructive' : 'secondary'}>HTTP {status}</Badge>
        </div>
        <Tabs defaultValue="document">
          <TabsList className="flex w-full flex-wrap h-auto gap-1">
            <TabsTrigger value="document">DID document</TabsTrigger>
            <TabsTrigger value="resolution">Resolution metadata</TabsTrigger>
            <TabsTrigger value="documentmeta">Document metadata</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="document">
            <pre className="max-h-[480px] overflow-auto rounded-md border bg-muted/40 p-3 text-left text-xs font-mono leading-relaxed">
              {doc !== null && doc !== undefined ? formatJson(doc) : '—'}
            </pre>
          </TabsContent>
          <TabsContent value="resolution">
            <pre className="max-h-[480px] overflow-auto rounded-md border bg-muted/40 p-3 text-left text-xs font-mono leading-relaxed">
              {resMeta !== null && resMeta !== undefined ? formatJson(resMeta) : '—'}
            </pre>
          </TabsContent>
          <TabsContent value="documentmeta">
            <pre className="max-h-[480px] overflow-auto rounded-md border bg-muted/40 p-3 text-left text-xs font-mono leading-relaxed">
              {docMeta !== null && docMeta !== undefined ? formatJson(docMeta) : '—'}
            </pre>
          </TabsContent>
          <TabsContent value="raw">
            <pre className="max-h-[480px] overflow-auto rounded-md border bg-muted/40 p-3 text-left text-xs font-mono leading-relaxed">
              {typeof raw === 'string' ? raw : formatJson(raw)}
            </pre>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          did:webvh only — same contract as the three resolver microservices
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">WebVH resolver</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Resolve a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">did:webvh</code>{' '}
          identifier against{' '}
          <span className="font-medium text-foreground">didwebvh-rs</span>,{' '}
          <span className="font-medium text-foreground">didwebvh-py</span>, or{' '}
          <span className="font-medium text-foreground">didwebvh-ts</span>. Inspired by the{' '}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://dev.uniresolver.io/"
            rel="noreferrer"
            target="_blank"
          >
            Universal Resolver
          </a>{' '}
          playground, scoped to WebVH implementations in this repo.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GitBranch className="size-5" aria-hidden />
            Resolve
          </CardTitle>
          <CardDescription>
            Run resolvers via the Vite dev proxy (<code className="text-xs">/engine/…</code>) or set{' '}
            <code className="text-xs">VITE_ENGINE_*</code> in <code className="text-xs">.env</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Label htmlFor="mode">Mode</Label>
              <Select
                value={mode}
                onValueChange={(v) => setMode(v as Mode)}
              >
                <SelectTrigger id="mode" className="w-full sm:w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single engine</SelectItem>
                  <SelectItem value="compare">Compare all three</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {mode === 'single' ? (
              <div className="space-y-2">
                <Label htmlFor="engine">Engine</Label>
                <Select
                  value={engine}
                  onValueChange={(v) => setEngine(v as EngineId)}
                >
                  <SelectTrigger id="engine" className="w-full sm:w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINES.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="did">DID</Label>
            <Textarea
              id="did"
              placeholder="did:webvh:…"
              rows={3}
              value={did}
              onChange={(e) => setDid(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Only <span className="font-medium">did:webvh</span> identifiers are accepted by these
              services.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button disabled={!canResolve} onClick={() => void onResolve()} type="button">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Resolving…
                </>
              ) : (
                'Resolve'
              )}
            </Button>
            <Button
              disabled={loading}
              onClick={() => void refreshHealth()}
              type="button"
              variant="outline"
            >
              Ping engines
            </Button>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Engine health
            </p>
            <div className="flex flex-wrap gap-2">
              {health.map((h) => (
                <Badge
                  key={h.engine}
                  className="gap-1 font-mono text-xs"
                  variant={h.ok ? 'default' : 'outline'}
                >
                  {h.engine}
                  {h.ok && h.health ? ` · ${h.health.engine}` : !h.ok ? ` · ${h.detail ?? 'down'}` : null}
                </Badge>
              ))}
            </div>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Separator />

          {mode === 'single' && singleResult ? (
            renderResultTabs(singleResult.status, singleResult.body)
          ) : null}

          {mode === 'compare' && Object.keys(compareResults).length > 0 ? (
            <Tabs defaultValue={ENGINES[0]}>
              <TabsList className="flex h-auto w-full flex-wrap gap-1">
                {ENGINES.map((e) => (
                  <TabsTrigger key={e} className="font-mono text-xs" value={e}>
                    {e}
                  </TabsTrigger>
                ))}
              </TabsList>
              {ENGINES.map((e) => {
                const r = compareResults[e]
                return (
                  <TabsContent key={e} className="mt-4" value={e}>
                    {!r ? (
                      <p className="text-sm text-muted-foreground">No data.</p>
                    ) : 'error' in r ? (
                      <Alert variant="destructive">
                        <AlertTitle>Failed</AlertTitle>
                        <AlertDescription>{r.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="font-mono">
                          {r.ms} ms
                        </Badge>
                        {renderResultTabs(r.status, r.body)}
                      </div>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
          ) : null}
        </CardContent>
      </Card>

      <footer className="pb-8 text-center text-xs text-muted-foreground">
        OpenAPI contract: <code className="rounded bg-muted px-1 py-0.5">contracts/openapi.yaml</code>
      </footer>
    </div>
  )
}
