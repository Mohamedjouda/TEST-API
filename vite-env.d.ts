// FIX: The reference to "vite/client" on line 1 caused a compilation error.
// This change removes the problematic line and replaces the file content
// with type definitions for `process.env.API_KEY`, which is now used in `App.tsx`
// to align with @google/genai guidelines.
declare var process: {
  env: {
    readonly API_KEY: string;
  };
};
