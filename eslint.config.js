import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

import jsxContentSpacing from "./eslint/rules/jsx-content-spacing.js";
import noJsxLiteralText from "./eslint/rules/no-jsx-literal-text.js";
import styleOnlyCssVars from "./eslint/rules/style-only-css-vars.js";
import typeBoundaries from "./eslint/rules/type-boundaries.js";

const HEX_COLOR = "(^|[^\\w&])#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b";
const HEX_COLORS = [
  {
    selector: `Literal[value=/${HEX_COLOR}/]`,
    message: "No hardcoded colors in views: use theme tokens from src/styles.css.",
  },
  {
    selector: `TemplateElement[value.raw=/${HEX_COLOR}/]`,
    message: "No hardcoded colors in views: use theme tokens from src/styles.css.",
  },
];
const NO_INNER_HTML = {
  selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
  message:
    "User content renders as React elements: RichText for text, patterns/html-frame for HTML.",
};

export default tseslint.config(
  { ignores: ["dist", "storybook-static"] },
  {
    // `eslint-disable` comments are ignored: a rule that is wrong gets fixed in this file, in a
    // reviewed PR, never silenced at the call site.
    linterOptions: { noInlineConfig: true, reportUnusedInlineConfigs: "off" },
  },
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
          "no-jsx-literal-text": noJsxLiteralText,
          "style-only-css-vars": styleOnlyCssVars,
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
      "no-console": ["error", { allow: ["warn", "error"] }],
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
  {
    // Views: copy through useMessages(), colors through tokens, style only for CSS variables.
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
    rules: {
      "local/no-jsx-literal-text": "error",
      "local/style-only-css-vars": "error",
      "no-restricted-syntax": ["error", ...HEX_COLORS, NO_INNER_HTML],
    },
  },
  {
    // Illustrations (avatar frames, cosmetic art) paint a fixed palette by design.
    files: [
      "src/domain/avatar/frames/**/*.tsx",
      "src/domain/cosmetics/cosmetic-icons.tsx",
      "src/domain/cosmetics/official-banners.tsx",
    ],
    rules: { "no-restricted-syntax": ["error", NO_INNER_HTML] },
  },
  {
    // Command-line scripts report through the console.
    files: ["scripts/**"],
    rules: { "no-console": "off" },
  },
  eslintPluginPrettier,
);
