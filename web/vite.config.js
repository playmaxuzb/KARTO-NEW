import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const demo = mode === 'demo';
  return {
    base: demo ? './' : '/',
    build: { outDir: demo ? 'dist-demo' : 'dist', target: 'es2022', assetsInlineLimit: 0 },
    plugins: [react(), demo && { name: 'demo-rel-img', transform(code, id) { if (id.includes('/src/')) return code.replace(/(['"`])\/img\//g, '$1./img/'); } }].filter(Boolean),
    server: { proxy: { '/api': 'http://localhost:4000' } },
  };
});
