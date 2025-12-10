import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Disable set-state-in-effect - it's valid for client-side initialization
      "react-hooks/set-state-in-effect": "off",
      // Using <img> is fine since we have images.unoptimized: true
      "@next/next/no-img-element": "off",
      // Allow underscore-prefixed unused vars and common error handling patterns
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_|^error$|^err$|^e$",
        "caughtErrorsIgnorePattern": ".*"
      }],
      // Disable exhaustive-deps - intentional patterns
      "react-hooks/exhaustive-deps": "off",
    },
  },
]);

export default eslintConfig;
