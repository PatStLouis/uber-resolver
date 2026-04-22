/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENGINE_DIDWEBVH_RS?: string
  readonly VITE_ENGINE_DIDWEBVH_PY?: string
  readonly VITE_ENGINE_DIDWEBVH_TS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
