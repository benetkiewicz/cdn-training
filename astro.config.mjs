// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact()],
  adapter: vercel()
});