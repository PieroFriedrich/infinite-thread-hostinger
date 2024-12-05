import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/likes": "http://localhost:3000", // match your backend port
      "/users": "http://localhost:3000",
      "/posts": "http://localhost:3000",
      "/tags": "http://localhost:3000",
    },
  },
});
