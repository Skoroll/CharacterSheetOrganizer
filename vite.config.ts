/// <reference types="node" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = Number(process.env.PORT) || 4173;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: PORT,
    allowedHosts: ["charactersheetorganizer-1.onrender.com"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/style/variables" as *; @use "src/style/mixins" as *;`,
      },
    },
  },
  
});
