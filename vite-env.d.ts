/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** LayerSync Supabase project URL (set once the project exists). */
  readonly VITE_SUPABASE_URL?: string;
  /** LayerSync Supabase publishable/anon key. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
