import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
// We always set base:'./' so the app works when opened via file://
// (assets resolve relatively in dist/ without a web server).
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  define: {
    // Vite will inline this at build-time; CI will set VITE_OFFLINE=1
    'import.meta.env.VITE_OFFLINE': JSON.stringify(process.env.VITE_OFFLINE || '')
  },
});
