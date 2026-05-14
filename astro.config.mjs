import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE === "true";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      ...(shouldAnalyze
        ? [
            visualizer({
              emitFile: true,
              filename: "stats.html",
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
  },
  site: "https://michxymi.com",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: [400, 500, 600],
      styles: ["normal"],
      fallbacks: ["monospace"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "IBM Plex Sans",
      cssVariable: "--font-ibm-plex-sans",
      weights: [400, 500, 600],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
  ],
  integrations: [sitemap()],
});
