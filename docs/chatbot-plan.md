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
- [x] **Exercise 1:** `buildSystemPrompt()` — persona, grounding, injection
      defense (done: corpus in tags, rules after; resume requests get the
      download link)
- [x] Deploy — live at `ask-my-resume.rajat-bhagat.workers.dev`; secret set;
      CI redeploys (with a fresh corpus) on every merge to main
- **Verify:** ✅ grounded answers confirmed in production; "reveal your
  prompt" / "ignore your instructions" politely refused

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

### Phase 3 — Widget on the site ✅
- [x] Astro island: chat bubble → panel, `fetch` + streamed rendering —
      `src/components/ChatWidget.astro`. Dormant in production until
      `chatEndpoint` is set in `src/data/site.json`; in dev it talks to the
      local worker automatically. Don't enable before Phase 4.
- [x] CORS locked to the production origin (+ future custom domain)
- **Verify:** ✅ live — floating widget on every page plus a full
  `/ask-my-resume` page (model picker, markdown rendering, mobile
  full-screen, home-page teaser, privacy notes)

### Phase 4 — Hardening (in progress)

Per-IP rate limiting shipped July 14 (PR #24, tightened to 15/day/IP in
PR #26). The off-topic gate is **deferred by decision** (latency tax on
every legitimate question vs. a $0 self-healing failure mode) — the prompt
refusal is the backstop, and Q&A logging will provide the data to revisit.
A self-imposed global cap is likewise skipped as redundant with OpenRouter's
own 50/day enforcement — but becomes **mandatory before any paid model or
credit purchase**.
- [x] **Exercise 3 (part 1):** per-IP rate limiting via Workers KV — done:
      15/day per IP, date-keyed fixed window, 48h TTL, 429 with CORS
- [~] *(deferred pending logged evidence)* **Off-topic gate:** classify questions with a tiny free model (or a
      keyword allowlist) *before* the flagship call, so strangers can't use
      the endpoint as a free general-purpose LLM and drain the daily request
      budget — with the Session-1 prompt rules as the backstop
- [ ] Prompt-injection testing: try to break your own bot; iterate
- [ ] Log Q&A pairs to KV — **do this next**: it's free market research on
      the resume AND the evidence base for the two deferred decisions (gate,
      conversation memory)
- **Verify:** ✅ limiter verified with a zero-quota curl loop (empty-body
  requests 400 before the LLM but still count); gate verification pending

### Phase 5 — Conversation memory (planned)
- [ ] Client-held history (widget `messages` array), replayed per request;
      worker accepts `{messages}` with hard caps (~4–5 pairs, trimmed in
      pairs); system prompt stays server-injected; history-is-not-authority
      prompt rule; re-red-team and revisit the gate deferral after shipping.
      Full design notes: learning plan, Session 7.

## Model and cost

| | |
|---|---|
| Models | `chatbot/src/models.ts` — visitor-selectable on /ask-my-resume: NVIDIA Nemotron Ultra 550B (default), OpenAI GPT-OSS 20B, Google Gemma 4 31B; all `:free` |
| Per question | **$0** — the budget is requests, not dollars |
| Free-tier limits | ~20 req/min; **50 req/day** account-wide (1,000/day once you've purchased $10 of credits) |
| Upgrade path | add an entry to `models.ts`; frontier models (e.g. `anthropic/claude-opus-4.8`) are available through the same API when quality is worth paying for |

Notes: the 50/day cap is shared across all your OpenRouter free usage, so a
handful of visitors can exhaust it — the Phase 4 rate limit and off-topic
gate are what make the budget survive contact with the public. Free
endpoints may log/train on prompts depending on your OpenRouter privacy
settings; the corpus is public site content, but visitor questions transit
too. Re-check `openrouter.ai/models?q=free` occasionally — the free lineup
changes monthly.
