// Flat config for a Playwright e2e folder. Merge into the project's existing
// config, or keep it next to the suite and point ESLint at it.
//
//   npm i -D eslint typescript-eslint eslint-plugin-playwright eslint-plugin-unused-imports
//
// The rules below are the ones that catch real defects: a missing await on an
// expect makes a test pass forever, and a committed test.only silently skips
// the rest of the suite.

import playwright from "eslint-plugin-playwright";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts"],
    ...playwright.configs["flat/recommended"],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { "unused-imports": unusedImports },
    rules: {
      ...playwright.configs["flat/recommended"].rules,

      // A floating expect is an assertion that never runs.
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",

      // Clean code: dead imports and variables never reach main.
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",

      // Playwright specifics.
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": ["warn", { allowConditional: true }],
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-networkidle": "error",
      "playwright/no-element-handle": "error",
      "playwright/no-eval": "error",
      "playwright/no-force-option": "warn",
      "playwright/no-conditional-in-test": "error",
      "playwright/no-conditional-expect": "error",
      "playwright/no-useless-await": "error",
      "playwright/no-nested-step": "error",
      "playwright/expect-expect": ["error", { assertFunctionNames: ["expect*"] }],
      "playwright/prefer-web-first-assertions": "error",
      "playwright/prefer-to-be": "error",
      "playwright/prefer-to-have-length": "error",
      "playwright/prefer-strict-equal": "error",
      "playwright/require-top-level-describe": "error",
      "playwright/valid-title": "error",
    },
  },
);
