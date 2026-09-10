import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    devSourcemap: true
  },
  build: {
    rollupOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true
          }
        },
        manualChunks(id) {
          if (id.includes("@ant-design/icons")) return "antd-icons";
          if (id.includes("recharts") || id.includes("d3")) return "charts-vendor";
          if (id.includes("file-saver")) return "file-tools-vendor";
          if (id.includes("excel")) return "exceljs-vendor";
          if (
            id.includes("react/") ||
            id.includes("react-dom/") ||
            id.includes("react-router-dom") ||
            id.includes("@reduxjs")
          )
            return "core-vendor";
        },
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]"
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src")
    }
  }
});
