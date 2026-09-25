import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { envCheck } from './scripts/env-check.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), envCheck()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'eslint/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
})
