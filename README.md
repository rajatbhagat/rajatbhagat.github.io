# rajatbhagat.github.io

[![Deploy to GitHub Pages](https://github.com/rajatbhagat/rajatbhagat.github.io/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/rajatbhagat/rajatbhagat.github.io/actions/workflows/deploy.yml)

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

**All content is data — you never need to touch `.astro` files to update it.**

| What | Where |
|---|---|
| Name, tagline, contact links, skills, highlights, education, certifications | `src/data/site.json` |
| Work experience | `src/content/experience/*.md` — one file per job; frontmatter = company/title/period, markdown body = the bullets. `order: 1` shows first |
| Projects | `src/content/projects/*.md` — one file per project; frontmatter = name/tech/links, markdown body = description |
| Blog posts | `src/content/blog/*.md` |
| Site-wide layout, nav, footer | `src/layouts/`, `src/components/` |
| Colors & typography | `src/styles/global.css` |
| Profile photo | `public/images/profile.jpg` |

Example: adding a new job = creating one markdown file in `src/content/experience/`:

```markdown
---
company: New Company
location: Chicago, US
title: Staff Engineer
period: Jul 2026 – Present
order: 0
---

- First accomplishment bullet
- Second accomplishment bullet
```

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

## Ask-my-resume chatbot (WIP)

A learning project: a Cloudflare Worker + Claude API chatbot grounded in this
site's content. Scaffold in [`chatbot/`](chatbot/), build plan in
[`docs/chatbot-plan.md`](docs/chatbot-plan.md), study guide in
[`docs/chatbot-learning-plan.md`](docs/chatbot-learning-plan.md).

## Custom domain (later)

When you buy a domain: add a `CNAME` file to `public/`, configure the domain in the repo's Pages settings, and update `site` in `astro.config.mjs`.
