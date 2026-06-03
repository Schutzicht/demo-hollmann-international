import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://hollmann-demo.vercel.app",
  server: { port: 4337, host: true },
  vite: {
    plugins: [tailwindcss()],
  },
});
