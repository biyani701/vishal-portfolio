import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import portfolio from '../web/eslint/plugin.js'

// The hub follows the portfolio's styling rule: tokens only, no arbitrary Tailwind values (apps/web/eslint/plugin.js).
export default defineConfig([
  globalIgnores(['dist', 'dist-ssr', 'test-results', 'playwright-report']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { portfolio },
    rules: { 'portfolio/no-arbitrary-tailwind': 'error' },
  },
])
