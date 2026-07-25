import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On Vercel, /api/* is served by serverless functions automatically.
// For local `vercel dev`, the same routing applies — no proxy needed.
export default defineConfig({
  plugins: [react()],
});
