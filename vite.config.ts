import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed as a GitHub Pages *user* page (fllcker.github.io), which serves from
// the domain root — so base stays '/'. If this ever moves to a project page,
// base becomes '/<repo>/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
  },
});
