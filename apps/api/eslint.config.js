import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['.vercel']),
  {
    files: ['**/*.{ts,js}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: {
      // Logging goes through src/log.ts, which writes structured lines without personal data.
      'no-console': 'error',
    },
  },
  {
    files: ['src/log.ts', 'src/dev.ts'],
    rules: { 'no-console': 'off' },
  },
])
