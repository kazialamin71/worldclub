// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The live domain. Used for the sitemap, canonical URLs and social-share tags.
// Keep this in sync with SITE.url in src/consts.ts and public/robots.txt.
const SITE = 'https://arisa-worldclub.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
