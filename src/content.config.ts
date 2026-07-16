import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts live in src/content/blog/ as markdown files.
// To add a new post: drop a .md file there with the frontmatter below.
// To add a new category: just use a new value in `category` — listing and
// category pages are generated automatically from whatever categories exist.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// One markdown file per job in src/content/experience/.
// Frontmatter holds the facts; the markdown body is the bullet list.
// `order`: 1 = most recent, shown first.
const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    location: z.string(),
    title: z.string(),
    period: z.string(),
    order: z.number(),
  }),
});

// One markdown file per project in src/content/projects/.
// The markdown body is the project description.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    tech: z.array(z.string()),
    links: z.array(z.object({ label: z.string(), url: z.string() })),
    // Projects sort newest-first by date. Add a project -> just give it a
    // date; no need to renumber anything.
    date: z.coerce.date(),
  }),
});

export const collections = { blog, experience, projects };
