import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // base: "/fightforlife/",

  server: {
    proxy: {
      "/events": "http://localhost:3001",
      "/create-payment": "http://localhost:3001",
    },
  },
});