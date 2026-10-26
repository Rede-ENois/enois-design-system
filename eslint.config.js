import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

import jsxContentSpacing from "./eslint/rules/jsx-content-spacing.js";
import typeBoundaries from "./eslint/rules/type-boundaries.js";

export default tseslint.config(
  { ignores: ["dist", "storybook-static"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      local: {
        rules: {
          "jsx-content-spacing": jsxContentSpacing,
          "type-boundaries": typeBoundaries,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@tanstack/*", "zustand", "@/*"],
              message:
                "Components receive data through props and navigate through AppLink: no router, query client, stores or app modules here.",
            },
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "local/jsx-content-spacing": "error",
      "local/type-boundaries": "error",
    },
  },
  {
    // Package entrypoints are the public API: they must re-export the component prop types.
    files: ["src/index.ts", "src/*/index.ts", "src/*/*/index.ts"],
    rules: { "local/type-boundaries": "off" },
  },
  eslintPluginPrettier,
);
