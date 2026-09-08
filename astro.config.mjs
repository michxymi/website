import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import expressiveCode from "astro-expressive-code";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),

  build: {
    format: "file",
  },

  fonts: [
    {
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["monospace"],
      name: "JetBrains Mono",
      provider: fontProviders.fontsource(),
      styles: ["normal"],
      weights: [400, 500, 600],
    },
    {
      cssVariable: "--font-ibm-plex-sans",
      fallbacks: ["sans-serif"],
      name: "IBM Plex Sans",
      provider: fontProviders.fontsource(),
      styles: ["normal"],
      weights: [400, 500, 600],
    },
  ],

  integrations: [
    sitemap(),
    expressiveCode({
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : false),
      themes: ["min-light", "min-dark"],
      useDarkModeMediaQuery: false,
    }),
  ],
  output: "server",

  site: "https://michxymi.com",
  trailingSlash: "never",

  vite: {
    plugins: [
      tailwindcss(),
      visualizer({
        brotliSize: true,
        filename: "bundle-analysis.json",
        gzipSize: true,
        template: "raw-data",
      }),
    ],
  },
});
