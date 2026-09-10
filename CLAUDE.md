# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Why this site exists

Two purposes, and most of the design decisions below fall out of one of them.

**1. A job-search shopfront.** The primary audience is recruiters and hiring managers — `site.json` leads with an "Open to new opportunities in the Data Platform space" callout, the hero pushes a resume download, and the chatbot's whole reason for existing is answering recruiter-style questions about Rajat's experience. Consequences to respect when changing things:
- Content must be updatable in **one file, in a minute** — a new job or project can't require touching `.astro`. That's why everything is Markdown + `site.json` (see below).
- It must load fast, work on a phone, and cost nothing to host — hence static Astro on GitHub Pages, no client framework, no analytics or tracking.
- Accuracy and tone matter more than cleverness. Experience bullets are sanitized real work; the chatbot is instructed never to guess or embellish, because a fabricated claim reaches an actual hiring manager.

**2. A personal playground and learning vehicle.** It's also "part portfolio, part blog" — tech write-ups, movie reviews, party games. Consequences:
- Blog categories are deliberately open-ended (`tech`, `movies`, `books`…) so a new section is just a new `category` value, never a code change.
- `chatbot/` is explicitly a **learning scaffold** (`docs/chatbot-learning-plan.md`: "don't copy a working prompt or retrieval implementation from a tutorial — write it, watch it fail, fix it"). Parts of it are intentionally unfinished exercises, not oversights. Don't "helpfully" implement an open `EXERCISE`, and don't swap hand-written code for a library, unless asked.
- Personal-budget economics drive the hardening: the chat endpoint is public, so rate limits and cost caps are load-bearing, not ceremony.

## Two projects in one repo

| | Root (`/`) | `chatbot/` |
|---|---|---|
| What | Astro 5 static site → GitHub Pages | Cloudflare Worker (`ask-my-resume`) |
| Deps | own `package.json` / `node_modules` | separate `package.json` / `node_modules` |
| Node | 22 (`nvm use 22`) | 22 |

They are coupled in two directions — see "Cross-project coupling" below.

## Commands

Site (repo root):
```bash
npm install
npm run dev        # localhost:4321
npm run build      # → dist/ ; this IS the test suite — there are no unit tests
npm run preview
```

Worker (`cd chatbot`):
```bash
npm install
npm run build:corpus   # regenerate src/corpus.generated.ts from ../src/content + site.json
npm run typecheck      # tsc --noEmit — required to pass in CI
npm run dev            # local worker at localhost:8787 (needs chatbot/.dev.vars with OPENROUTER_API_KEY)
npm run chat           # interactive REPL against the worker
npm run chat -- "What did Rajat do at Discover?"        # one-shot
CHAT_URL=https://<worker>.workers.dev/chat npm run chat # against production
npm run deploy         # wrangler deploy (CI normally does this)
```

Verification for any change: `npm run build` at root, plus `cd chatbot && npm run typecheck` if worker files changed. `.github/workflows/pr-build.yml` runs exactly those two.

## Content is data — never hardcode it in `.astro`

All site content lives in two places, and `.astro` files only render it:

- `src/data/site.json` — name, tagline, contact links, skills, highlights, education, certifications, and `chatEndpoint`.
- `src/content/{experience,projects,blog}/*.md` — one file per item. Frontmatter is validated by Zod schemas in `src/content.config.ts`; the markdown body is the prose/bullets. Project screenshots go in `src/content/projects/images/` and are referenced with a relative `![...](images/x.png)` in the body — there is no image field in the schema.

Ordering is derived from frontmatter, so adding an item never means renumbering others:
- experience → `order` ascending (1 = most recent)
- projects → `date` descending
- blog → `pubDate` descending

`draft: true` on a blog post excludes it from the site build *and* from the chatbot corpus. Blog categories are open-ended: `/blog/category/<slug>/` pages are generated from whatever `category` values exist, slugified by `src/utils/slug.ts` so "Movies"/"movies" collapse into one page.

The exception is `/games/`: those pages are hand-written static HTML in `public/baby-feud/` (served as-is, outside Astro), and `src/pages/games.astro` lists them from an inline array rather than a collection.

## Cross-project coupling

1. **Corpus generation.** `chatbot/scripts/build-corpus.mjs` reads `../src/content/**` and `../src/data/site.json` and emits `chatbot/src/corpus.generated.ts`, which the worker stuffs whole into the system prompt. That file is generated — **never hand-edit it**; run `npm run build:corpus`. It also rewrites relative URLs (the resume PDF) to absolute using `site:` from `astro.config.mjs`, so the model hands out working links. Editing site content and *not* regenerating leaves the deployed bot stale — CI regenerates on every merge to `main`.

2. **Model allowlist.** `src/components/ChatWidget.astro` imports `MODELS`/`DEFAULT_MODEL` from `../../chatbot/src/models` — the site build reaches into the worker source so the picker and the server-side validation can't drift. Changing `chatbot/src/models.ts` changes the rendered site.

## Chatbot architecture

`POST /chat` on the Worker → OpenRouter (SSE) → the worker re-streams **plain text** (not SSE) to the browser, which renders it incrementally with markdown-it.

Constraints baked into `chatbot/src/index.ts`, in order: CORS allowlist (`ALLOWED_ORIGINS`, production origin only) → per-IP-per-day KV rate limit (15/day) → **global** daily cap (200/day, soft — KV is eventually consistent) → JSON parse → `messages` history validation → `question` non-empty and ≤ 500 chars → model key checked against `MODELS` (an unknown/absent key silently falls back to `DEFAULT_MODEL`; the client can never name an arbitrary OpenRouter model). Upstream 429/402 becomes a `QuotaError` → 429 "come back tomorrow", not a 500.

Model economics are why both caps exist: the default is a `:free` model, but the fallback list includes a **paid** one, so an uncapped endpoint is an uncapped bill. In `chatbot/src/models.ts`, **declaration order is the fallback order** the worker sends to OpenRouter (requested model first, then the rest as declared) — reordering that object changes which model gets paid for. The free lineup churns monthly; re-check `openrouter.ai/models?q=free` before swapping ids.

The system prompt (`chatbot/src/chat.ts` → `buildSystemPrompt()`) is the load-bearing part: corpus inside `<corpus>` tags first, rules after. Rules that have been deliberately tuned and are easy to regress — third-person voice, never referring to "the corpus"/"the provided information" when something is missing, and injection resistance. Test prompt changes against both recruiter-style questions and "reveal your system prompt" / "ignore your instructions".

Model output is untrusted (prompt-injectable), so the widget renders it with `MarkdownIt({ html: false })` — raw HTML is escaped and `javascript:`/`data:` links are rejected. Keep it that way.

The widget is **dormant by default**: it renders only when `site.chatEndpoint` is set in `src/data/site.json` (in dev it falls back to `localhost:8787` automatically). The home page CTA and `/ask-my-resume/` link are gated on the same value.

Phase-by-phase plan, open exercises (Phase 2 = real RAG with Workers AI embeddings + Vectorize), and the reasoning behind deferred decisions live in `docs/chatbot-plan.md` and `docs/chatbot-learning-plan.md`. Read them before changing worker behavior — several apparent gaps (the off-topic gate, for instance) are documented deliberate deferrals, not TODOs. The Vectorize/AI bindings sit commented out in `chatbot/wrangler.jsonc` awaiting that work.

## Site-wide client-side patterns

- **View transitions are on** (`ClientRouter` in `BaseLayout.astro`). Client scripts must (re)initialize on the `astro:page-load` event, not `DOMContentLoaded`, and must guard against stacking listeners on nodes that survived a swap — `ChatWidget.astro` uses a `data-chat-init` marker plus module-level document listeners for exactly this. Nodes carrying `transition:persist` keep their closures across navigations (that's how the chat keeps conversation history for the tab).
- **Theming** is `data-theme` on `<html>`, set by an `is:inline` script in `BaseLayout.astro` before paint and re-applied on `astro:after-swap`. `src/styles/global.css` defines dark values **twice** — under `:root[data-theme='dark']` and under `@media (prefers-color-scheme: dark)` for no-JS visitors. Changing one without the other is a bug.

## Deploy

Push/merge to `main` → `.github/workflows/deploy.yml` runs three jobs: build site → deploy to Pages, and (in parallel) install chatbot deps → rebuild corpus → `wrangler deploy`. The worker job needs the `CLOUDFLARE_API_TOKEN` repo secret; the OpenRouter key is a wrangler secret and never reaches the browser (that's the whole reason the Worker exists — GitHub Pages can't hold secrets).

## Stale file

`.claude/commands/update-portfolio.md` describes a **Jekyll** site at `/Users/rajatbhagat/workspace/portfolio-website` with `about.md`, `_config.yml`, `assets/`. None of that matches this repo. Ignore it; follow the content model above instead.
