import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['node_modules', 'dist', 'public'],
  },
  {
    languageOptions: { globals: globals.browser },
    rules: {
      indent: 'off',
      camelcase: 'off',
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Regular (non-type) imports first
            // Built-in modules (e.g., fs, path, or other Node.js built-ins)
            ['^node:'],
            // External packages (e.g., react, lodash)
            ['^@?\\w'],
            // Parent imports (e.g., ../)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Sibling imports (same directory)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Index imports (e.g., ./index)
            ['^\\./?$'],
            // Type imports last, sorted by the same rules
            // Built-in type imports
            ['^node:.*\\u0000$'],
            // External package type imports (e.g., type imports from npm packages)
            ['^@?\\w.*\\u0000$'],
            // Internal type imports (e.g., type imports from @company or src)
            ['^(@|@company|src|config)(/.*\\u0000$)'],
            // Parent directory type imports (e.g., ../types)
            ['^\\.\\.(?!/?$).*(\\u0000)$', '^\\.\\./?.*(\\u0000)$'],
            // Sibling directory type imports (e.g., ./types)
            ['^\\./(?=.*/)(?!/?$).*(\\u0000)$', '^\\.(?!/?$).*(\\u0000)$'],
            // Index file type imports
            ['^\\./?.*(\\u0000)$'],
          ],
        },
      ],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
];
