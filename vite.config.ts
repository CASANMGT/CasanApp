import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   port: 5175, // 👈 change to your desired port
  //   host: true, // optional: allows LAN access
  // },
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // Disable unnecessary hooks if they cause errors
        cleanupOutdatedCaches: false,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 5 MB limit
      },
      manifest: {
        name: "Casan Charging station ",
        short_name: "Casan",
        description: "Casan Charging station ",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
