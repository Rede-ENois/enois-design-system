import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Bundle só da prova visual do card do Papo Reto (#397): monta o componente real com o
// stylesheet real (Tailwind + design system) para medir overflow em 1280 e 390.
export default defineConfig({
  root: "docs/proof/papo-card",
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "saida",
    emptyOutDir: true,
  },
});
