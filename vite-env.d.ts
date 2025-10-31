// FIX: The original `/// <reference types="vite/client" />` line was removed as it was
// causing a "Cannot find type definition file" error.
// This declaration makes `process.env.API_KEY` available to TypeScript, which is
// required by the Gemini API guidelines for API key handling. It assumes the
// build environment will make this variable available at runtime.
declare var process: {
  env: {
    API_KEY: string;
  };
};
