import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    // The RuleTester tests use their own runner: npm run test:eslint-rules.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
