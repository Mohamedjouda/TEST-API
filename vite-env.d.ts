/// <reference types="vite/client" />

// FIX: Replaced the conflicting `declare var process` with a namespace augmentation.
// This correctly adds the API_KEY type to `process.env` for TypeScript without
// overwriting the full `process` object type, which is needed by vite.config.ts.
// This resolves both the "Cannot redeclare" error in this file and the "Property 'cwd' does not exist"
// error in vite.config.ts.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
