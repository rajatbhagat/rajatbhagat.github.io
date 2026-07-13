# Plan: "Ask My Resume" RAG Chatbot

A chat widget on the portfolio site that answers recruiter-style questions
about Rajat's experience, grounded in the site's own content. Scaffold lives
in [`../chatbot/`](../chatbot/); study guide in
[`chatbot-learning-plan.md`](./chatbot-learning-plan.md).

## Architecture

```
GitHub Pages (static site)
  └── chat widget (Astro island, streams text)
        └── POST /chat → Cloudflare Worker  (free tier: 100k req/day)
              ├── Phase 1: full corpus in system prompt
              ├── Phase 2: Workers AI embeddings + Vectorize top-k retrieval
              └── OpenRouter API (nvidia/nemotron-3-ultra-550b-a55b:free, streaming)
```

The Worker exists because GitHub Pages can't hold secrets — the OpenRouter
API key lives in a Worker secret and never reaches the browser.

**Design note:** the whole corpus (~8–10K tokens) fits in one prompt, so
Phase 1 (context stuffing + prompt caching) is the pragmatic optimum today.
Phase 2 builds real RAG anyway — as the learning objective, as future-proofing
for a growing blog, and to practice *measuring* whether retrieval helps.

## Phases

### Phase 1 — Worker MVP, context stuffing
- [x] Scaffold: Worker project, routing, CORS, validation, streaming (done)
- [x] Corpus build script reading `src/content/**` + `site.json` (done)
- [ ] **Exercise 1:** `buildSystemPrompt()` — persona, grounding, injection
      defense
- [ ] Deploy (`wrangler secret put OPENROUTER_API_KEY`)
- **Verify:** 10 recruiter questions answered accurately vs. the resume

### Phase 2 — Real RAG
- [ ] **Exercise 2a:** chunking (~300 tokens, semantic boundaries: one chunk
      per role bullet-group / project / blog section, with metadata)
- [ ] Embeddings: Workers AI `@cf/baai/bge-base-en-v1.5` (768 dims, free
      tier) + Vectorize index; indexing script runs at deploy time
- [ ] **Exercise 2b:** retrieval — embed question, top-k=4 cosine, assemble
      prompt with source labels
- [ ] Evaluate Phase 2 vs. Phase 1 on the same question set
- **Verify:** OCC questions retrieve OCC chunks; quality comparison written up
  (would make a great blog post)

### Phase 3 — Widget on the site
- [x] Astro island: chat bubble → panel, `fetch` + streamed rendering —
      `src/components/ChatWidget.astro`. Dormant in production until
      `chatEndpoint` is set in `src/data/site.json`; in dev it talks to the
      local worker automatically. Don't enable before Phase 4.
- [x] CORS locked to the production origin (+ future custom domain)
- **Verify:** works on the live site from a clean browser profile

### Phase 4 — Hardening (before linking it anywhere)
- [ ] **Exercise 3:** per-IP rate limiting via Workers KV (~20 questions/day)
- [ ] **Off-topic gate:** classify questions with a tiny free model (or a
      keyword allowlist) *before* the flagship call, so strangers can't use
      the endpoint as a free general-purpose LLM and drain the daily request
      budget — with the Session-1 prompt rules as the backstop
- [ ] Prompt-injection testing: try to break your own bot; iterate
- [ ] Log Q&A pairs to KV — recruiters' real questions are free market
      research on the resume
- **Verify:** spend cap set; 21st question from one IP gets a 429

## Model and cost

| | |
|---|---|
| Model | `nvidia/nemotron-3-ultra-550b-a55b:free` — best free model on OpenRouter as of July 2026 (550B MoE, 1M context) |
| Per question | **$0** — the budget is requests, not dollars |
| Free-tier limits | ~20 req/min; **50 req/day** account-wide (1,000/day once you've purchased $10 of credits) |
| Upgrade path | `MODEL` is one line; frontier models (e.g. `anthropic/claude-opus-4.8`) are available through the same API when quality is worth paying for |

Notes: the 50/day cap is shared across all your OpenRouter free usage, so a
handful of visitors can exhaust it — the Phase 4 rate limit and off-topic
gate are what make the budget survive contact with the public. Free
endpoints may log/train on prompts depending on your OpenRouter privacy
settings; the corpus is public site content, but visitor questions transit
too. Re-check `openrouter.ai/models?q=free` occasionally — the free lineup
changes monthly.
