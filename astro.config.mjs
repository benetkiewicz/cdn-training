// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

import auth from 'auth-astro';

import db from '@astrojs/db';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact(), auth(), db()],

  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: '0.0.0.0',
  },
});