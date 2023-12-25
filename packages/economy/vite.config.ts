/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { doctest } from 'vite-plugin-doctest'

export default defineConfig({
  plugins: [doctest()],
})
