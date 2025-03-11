// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

import auth from 'auth-astro';

import db from '@astrojs/db';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact(), auth(), db()],
  adapter: netlify(),
});