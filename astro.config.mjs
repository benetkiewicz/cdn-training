// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

import vercel from '@astrojs/vercel';

import auth from 'auth-astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact(), auth()],
  adapter: vercel()
});