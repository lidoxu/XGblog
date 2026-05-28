import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const normalizeSlug = (value: string) => value.trim().toLowerCase();

const posts = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './blog/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).min(1).transform((items) => items.map(normalizeSlug)),
    tags: z.array(z.string()).default([]).transform((items) => items.map(normalizeSlug)),
    cover: z.string().optional(),
    top: z.number().optional().default(0),
    comments: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
