import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "./client"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./client/public/assets"),
    },
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === "production" ? false : true,
    minify: "esbuild",
    rollupOptions: {
      input: path.resolve(__dirname, "client/index.html"),
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "wouter"],
          ui: ["lucide-react"],
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "wouter", "lucide-react"],
  },
});