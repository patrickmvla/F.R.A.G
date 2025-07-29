// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // --- START: MODIFICATION ---
      // This rule overrides the default to allow underscore-prefixed variables to be unused.
      '@typescript-eslint/no-unused-vars': [
        'error', // Keep the severity as an error for truly unused variables
        {
          argsIgnorePattern: '^_', // This is the key: ignore arguments starting with '_'
          varsIgnorePattern: '^_', // Good practice to ignore local variables starting with '_' too
          caughtErrorsIgnorePattern: '^_', // And caught error variables
        },
      ],
      // --- END: MODIFICATION ---

      // Your existing rules:
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);