import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' uses relative asset paths so the build works when served from
// a GitHub Pages project subpath (https://<user>.github.io/<repo>/) without
// having to hardcode the repository name here.
export default defineConfig({
  plugins: [react()],
  base: './',
})
