import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['scripts/**/*.js', 'vite.config.js', 'postcss.config.js', 'tailwind.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
  },
  {
    // One-off Node download scripts, not shipped: report, do not block.
    files: ['scripts/**/*.js'],
    rules: {
      'no-unused-vars': 'warn',
      'no-case-declarations': 'warn',
    },
  },
  {
    // Test helpers run under Jest and Node.
    files: ['src/utils/testUtils.jsx'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
  {
    // The AI modules are being reworked on fix/security-2026-11; left as they are here.
    files: ['src/utils/aiBookChat.js', 'src/utils/aiRecommendations.js'],
    rules: { 'no-unused-vars': 'warn' },
  },
])
