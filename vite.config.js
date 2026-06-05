import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // GitHub Pages serves a project site from a SUBPATH:
  //   https://USERNAME.github.io/REPO_NAME/
  // so `base` must be '/REPO_NAME/' (with leading and trailing slashes) or
  // asset links 404 and you get a blank page.
  //
  // Change 'heldenarchiv' below to match YOUR repository name exactly.
  // If you deploy to the domain root instead (Netlify, Vercel, a custom domain,
  // or a USERNAME.github.io repo), set this back to '/'.
  base: '/heldenarchiv/',
})
