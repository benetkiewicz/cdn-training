import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
const lessons = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/lessons" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
});

export const collections = {
  lessons,
};