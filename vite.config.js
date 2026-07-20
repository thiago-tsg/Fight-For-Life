import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [react()],
    base: isDev ? "/" : "/Fight-For-Life/",

    server: {
      proxy: {
        "/events": "http://localhost:3001",
        "/create-payment": "http://localhost:3001",
        "/payment": "http://localhost:3001",
        "/webhook": "http://localhost:3001",
      },
    },
  };
});