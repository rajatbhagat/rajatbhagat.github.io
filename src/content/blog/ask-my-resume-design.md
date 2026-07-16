---
title: 'Designing "Ask My Resume": A Serverless RAG-ready Chatbot on a Static Site'
description: 'A design walkthrough of the AI assistant on this site — how a GitHub Pages static site talks to an LLM safely, cheaply, and without a backend server.'
pubDate: 2026-07-16
category: tech
tags: [ai, llm, cloudflare-workers, astro, architecture, design-doc]
draft: true
---

<!--
  SKELETON — fill in each section. Notes to self are in HTML comments and
  won't render. Delete them as you go. Keep it concrete: real numbers,
  real tradeoffs, real bugs you hit. That's what makes a design doc worth
  reading (and a good interview artifact).
-->

## TL;DR

<!-- 3–4 sentences: what the feature is, the one hard constraint (static
     site + secrets can't live in the browser), and the shape of the
     solution (widget → Worker → OpenRouter). A reader should get the whole
     picture here before any detail. -->

## The problem

<!-- What does the feature do for a visitor? Who's the user (recruiters)?
     Why a chatbot over a plain resume page? What made it non-trivial:
     GitHub Pages is static (no server, no secrets), the LLM budget is
     tiny, and the endpoint is public. -->

## Goals and non-goals

**Goals**

<!-- e.g. answer recruiter questions grounded in site content; $0 running
     cost; no backend to operate; safe to expose publicly. -->

**Non-goals**

<!-- e.g. general-purpose chat; authenticated/per-user history; perfect
     accuracy. Being explicit about non-goals is half the value of a
     design doc. -->

## Architecture overview

<!-- Drop the request-flow diagram here. Reuse/refresh the ASCII diagram
     from docs/chatbot-plan.md. One paragraph walking a single question
     end-to-end: browser widget → POST /chat → Worker → OpenRouter →
     streamed back → rendered. -->

```
<!-- diagram goes here -->
```

## Components

<!-- One subsection per component. For each: what it does, why it exists,
     the key decision. -->

### The static site & chat widget (Astro island)

<!-- Where the UI lives; the floating widget vs. the /ask-my-resume page
     from one component + a variant prop; streaming render; escape-first
     markdown (and the later move to markdown-it — link to that story). -->

### The Cloudflare Worker (the edge proxy)

<!-- Why the Worker exists at all: the browser can't hold the API key.
     Serverless / edge model. What it validates: CORS, method, question
     length, model allowlist. -->

### The LLM via OpenRouter

<!-- Why OpenRouter (one API, many models, a free tier). The model picker
     and the shared models.ts allowlist. Reasoning-model latency. -->

### The corpus (grounding)

<!-- How site content (experience, projects, blog, site.json) becomes the
     system-prompt corpus at build time; the build-corpus script; why it's
     baked into the Worker bundle today, and how RAG would change that. -->

### Conversation memory

<!-- Client-held history replayed per request; why not server/KV/IP-keyed;
     "session = the tab"; the trailing-question ownership decision. -->

## Key design decisions & tradeoffs

<!-- The meat. A short subsection or table per decision: the options, what
     you chose, and why. Candidates:
       - Static site + edge Worker vs. a real backend
       - Context-stuffing (Phase 1) vs. RAG (Phase 2) for a ~3k-token corpus
       - Free model vs. paid; the request-budget economics
       - Per-IP rate limiting vs. an off-topic gate (and why the gate was
         deferred) -->

## Security & abuse model

<!-- Trust boundaries: everything from the browser is untrusted. The API
     key never leaves the Worker. Prompt-injection defense (grounding rules
     + role whitelist on replayed history). Escape-first rendering — a
     prompt-injected model is an untrusted content source in your page.
     Rate limiting to protect the budget. What's still open (the gate,
     the history-is-context prompt rule). -->

## Cost & scaling

<!-- The real bottleneck isn't Cloudflare (100k req/day free) — it's the
     ~50 req/day OpenRouter free budget. How the design protects it. What
     changes at each paid tier. -->

## What I'd do differently / future work

<!-- RAG (Phase 2), Q&A logging as the decision engine, the off-topic gate,
     conversation-memory hardening. Honest "if I rebuilt it" reflections. -->

## Lessons learned

<!-- The transferable ones. e.g. TypeScript types are a compile-time
     promise, not a runtime check — validate untrusted input at the
     boundary. Knowing when to stop hand-rolling (markdown). Measuring
     before building (logging before the gate). -->

## Appendix / links

<!-- Links: the live feature, the repo, docs/chatbot-plan.md, the learning
     plan, relevant PRs. -->
