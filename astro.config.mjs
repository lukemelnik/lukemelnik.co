import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkCallout from "@r4ai/remark-callout";

export default defineConfig({
  site: "https://lukemelnik.co",
  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: "slack-dark",
      wrap: true,
    },
    gfm: true,
    remarkPlugins: [remarkCallout]
  },
});
