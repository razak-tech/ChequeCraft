/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_API_URL?: string
  readonly VITE_AI_API_KEY?: string
  readonly VITE_GEMINI_API_KEY?: string
  readonly VITE_GEMINI_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
