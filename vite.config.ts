import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    devSourcemap: true
  },
  build: {
    rollupOptions: {
      output: {
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
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
