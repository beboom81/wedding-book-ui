import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` lets the build work under a GitHub Pages project path
// (e.g. https://user.github.io/wedding-book-ui/). Set VITE_BASE in CI.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
