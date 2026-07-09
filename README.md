# rajatbhagat.github.io

Personal portfolio + blog, built with [Astro](https://astro.build) and deployed to GitHub Pages.

Live at **https://rajatbhagat.github.io**

## Local development

Requires Node 20+ (`nvm use 22`).

```bash
npm install
npm run dev        # dev server at localhost:4321
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## How to update things

| What | Where |
|---|---|
| Home page intro / skills / highlights | `src/pages/index.astro` |
| Work experience & certifications | `src/data/experience.ts` |
| Projects | `src/data/projects.ts` |
| Blog posts | `src/content/blog/*.md` |
| Site-wide layout, nav, footer | `src/layouts/`, `src/components/` |
| Colors & typography | `src/styles/global.css` |
| Profile photo | `public/images/profile.jpg` |

## Writing a blog post

Create a markdown file in `src/content/blog/`:

```markdown
---
title: 'Post Title'
description: 'One-line summary for listings and SEO.'
pubDate: 2026-08-01
category: tech        # any string — new categories just work
tags: [optional, tags]
draft: false          # true = excluded from the build
---

Content in markdown.
```

Push to `main` and GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys automatically.

**Categories are extensible by design**: category pages (`/blog/category/<name>/`) are generated from whatever `category` values exist in published posts. To start a `books` or `travel` section, just write a post with that category.

A movie-review starter lives at `src/content/blog/movie-review-template.md` (kept as `draft: true`); copy it to write a review.

## Custom domain (later)

When you buy a domain: add a `CNAME` file to `public/`, configure the domain in the repo's Pages settings, and update `site` in `astro.config.mjs`.
