import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Only Storybook and Vitest use Vite; the package itself is built with tsc.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
