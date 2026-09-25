import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import portfolio from './eslint/plugin.js'

// UF-3 (design/exploration/09-primitive-foundation.md): banned everywhere in app code.
const forbiddenPackages = [
  { group: ['@radix-ui/*', 'radix-ui', 'radix-ui/*'], message: 'Radix is not used; primitives come from Base UI via src/ui.' },
  { group: ['vaul', 'vaul/*'], message: 'Use the src/ui Drawer (Base UI) instead of vaul.' },
  { group: ['cmdk', 'cmdk/*'], message: 'Use the src/ui Autocomplete in a Dialog instead of cmdk.' },
  { group: ['@base-ui-components/react', '@base-ui-components/react/*'], message: 'Old package name; src/ui uses @base-ui/react.' },
]
const baseUi = {
  group: ['@base-ui/react', '@base-ui/react/*'],
  message: 'Only src/ui may import @base-ui/react; import the src/ui component instead.',
}

export default defineConfig([
  globalIgnores(['dist', 'eslint/fixtures']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
    ],
    languageOptions: { globals: globals.browser },
    plugins: { portfolio },
    rules: {
      'no-restricted-imports': ['error', { patterns: [...forbiddenPackages, baseUi] }],
      'portfolio/no-as-child': 'error',
      'portfolio/no-arbitrary-tailwind': 'error',
    },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: forbiddenPackages }],
      // shadcn components export their cva variants and hooks next to the components.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/design/**/*.{ts,tsx}', 'src/ui/**/*.{ts,tsx}'],
    rules: {
      'portfolio/no-arbitrary-tailwind': 'off',
    },
  },
  {
    files: ['*.{js,ts}', 'eslint/**/*.{js,ts}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
])
