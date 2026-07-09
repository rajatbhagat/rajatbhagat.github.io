---
title: 'Hello World: How This Blog Works'
description: 'The first post — and a living guide to how I add new posts and categories to this site.'
pubDate: 2026-07-09
category: tech
tags: [astro, meta, blogging]
---

Welcome! This is my corner of the internet — part portfolio, part blog. I'll write here about technology I'm working with, movies I've watched, and whatever else earns a category.

This first post doubles as documentation for future me: here's how the blog actually works.

## The stack

The site is built with [Astro](https://astro.build), a static site generator that treats markdown as a first-class citizen. Every page is pre-rendered to plain HTML, so it's fast and hosts for free on GitHub Pages. A GitHub Actions workflow rebuilds and deploys the site on every push to `main`.

## Adding a post

Each post is a single markdown file in `src/content/blog/`. To publish a new one, I add a file like this:

```markdown
---
title: 'My New Post'
description: 'One-line summary shown in listings and search results.'
pubDate: 2026-08-01
category: tech
tags: [optional, tags]
---

The post content, in plain markdown.
```

Commit, push, and it's live a minute later. That's the whole workflow.

## Categories are free

There's no registry of categories. The `category` frontmatter field can be anything — `tech`, `movies`, `books`, `travel` — and the site automatically generates a listing page at `/blog/category/<name>/` for every category that has at least one post. Adding a new category is just using it.

## Drafts

Setting `draft: true` in the frontmatter keeps a post out of the build entirely. I keep half-written posts in the repo without publishing them.

That's it — see you in the next post.
