import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Build em arquivo único (HTML + CSS + JS inline): dist/index.html pode ser colado no Wix
// (elemento "Incorporar código HTML") ou hospedado em qualquer lugar estático.
export default defineConfig({
  plugins: [viteSingleFile()],
  build: { target: 'es2020' },
});
