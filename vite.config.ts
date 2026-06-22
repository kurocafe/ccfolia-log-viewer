/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // DOMParser を使うパーサーのテスト向けにブラウザ相当の環境を用意する
    environment: 'happy-dom',
    globals: true,
  },
})
