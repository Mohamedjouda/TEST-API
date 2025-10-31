// Fix: The original content of this file caused multiple TypeScript errors.
// 1. `/// <reference types="vite/client" />` caused a "Cannot find type definition file" error and was removed.
// 2. `declare var process: ...` caused a "Cannot redeclare block-scoped variable 'process'" error and
//    overrode the native Node.js `process` type, which broke the vite.config.ts build.
// The following code augments the existing `process.env` type, which is the correct way to
// add environment variable types without causing conflicts.

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
