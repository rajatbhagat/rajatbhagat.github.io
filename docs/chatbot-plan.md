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
              ├── Phase 1: full corpus in system prompt (cached)
              ├── Phase 2: Workers AI embeddings + Vectorize top-k retrieval
              └── Claude API (claude-opus-4-8, streaming)
```

The Worker exists because GitHub Pages can't hold secrets — the Anthropic API
key lives in a Worker secret and never reaches the browser.

**Design note:** the whole corpus (~8–10K tokens) fits in one prompt, so
Phase 1 (context stuffing + prompt caching) is the pragmatic optimum today.
Phase 2 builds real RAG anyway — as the learning objective, as future-proofing
for a growing blog, and to practice *measuring* whether retrieval helps.

## Phases

### Phase 1 — Worker MVP, context stuffing
- [x] Scaffold: Worker project, routing, CORS, validation, streaming (done)
- [x] Corpus build script reading `src/content/**` + `site.json` (done)
- [ ] **Exercise 1:** `buildSystemPrompt()` — persona, grounding, injection
      defense, `cache_control` on the corpus block
- [ ] Deploy; set spend cap in Anthropic Console
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
- [ ] Astro island: chat bubble → panel, `fetch` + streamed rendering
- [ ] CORS locked to the production origin (+ future custom domain)
- **Verify:** works on the live site from a clean browser profile

### Phase 4 — Hardening (before linking it anywhere)
- [ ] **Exercise 3:** per-IP rate limiting via Workers KV (~20 questions/day)
- [ ] Prompt-injection testing: try to break your own bot; iterate
- [ ] Log Q&A pairs to KV — recruiters' real questions are free market
      research on the resume
- **Verify:** spend cap set; 21st question from one IP gets a 429

## Model and cost

| | |
|---|---|
| Model | `claude-opus-4-8` ($5/M input, $25/M output) |
| Per question | ~2–3K input (mostly cache reads at ~10% price) + ~400 output ≈ **$0.01–0.02** |
| 100 questions/month | a couple of dollars |
| Cost floor option | Haiku 4.5 ($1/$5) handles corpus-grounded Q&A fine — decide after seeing Opus-quality answers, not before |

Prompt caching note: the corpus block must be ≥4096 tokens for Opus to cache
it. The current corpus measures **~2.7K tokens** (`build:corpus` prints the
estimate), so today caching is a silent no-op — everything works, you just
pay full input price (~$0.015/question, still cheap). Caching starts paying
off automatically once blog posts push the corpus past 4096 tokens; the
`cache_control` field costs nothing to keep in place meanwhile.
