# Ask My Resume — chatbot Worker

A Cloudflare Worker that answers questions about Rajat's experience using a
free model via OpenRouter (`nvidia/nemotron-3-ultra-550b-a55b:free`),
grounded in the same content files that render the portfolio site.

**This is a learning scaffold.** The plumbing (routing, CORS, validation,
streaming, corpus generation) is done; the parts worth learning are left as
exercises marked `EXERCISE` in the code. The full plan lives in
[`../docs/chatbot-plan.md`](../docs/chatbot-plan.md) and the study guide in
[`../docs/chatbot-learning-plan.md`](../docs/chatbot-learning-plan.md).

## Setup

```bash
cd chatbot
npm install
npm run build:corpus        # regenerates src/corpus.generated.ts from ../src/content
npx wrangler login          # once
npx wrangler secret put OPENROUTER_API_KEY   # free key from openrouter.ai/keys
```

The model is free ($0/token) but the request budget isn't infinite:
~20 req/min and 50 req/day account-wide (1,000/day after purchasing $10 of
credits). Exercise 3's rate limit + off-topic gate protect that budget.

## Develop

```bash
npm run dev                 # terminal 1: local worker at localhost:8787
# For local secrets, create .dev.vars: OPENROUTER_API_KEY=sk-or-...

npm run chat                # terminal 2: interactive chat REPL against the worker
npm run chat -- "What did Rajat do at Discover?"          # one-shot
CHAT_URL=https://<worker>.workers.dev/chat npm run chat   # against the deployed worker
```

Or raw curl (`-N` disables buffering so you see the stream arrive):

```bash
curl -N localhost:8787/chat \   # 8787 = the worker; 4321 is the Astro site
  -H 'Content-Type: application/json' \
  -d '{"question": "What did Rajat do at Discover?"}'
```

`npm run typecheck` must pass; `npm run deploy` ships it.

## Exercises

| # | Where | What | Done when |
|---|---|---|---|
| 1 | `src/chat.ts` → `buildSystemPrompt()` | **Done.** Persona, grounding, injection defense; resume requests get the download link | ✅ Verified in production — accurate grounded answers; prompt-extraction and override attempts politely refused |
| 2 | Phase 2, new `src/retrieval.ts` | Chunking + Workers AI embeddings + Vectorize top-k retrieval | OCC questions retrieve OCC chunks, not JPMC ones; compare answer quality vs. Exercise 1 |
| 3 | `src/index.ts` (marked TODO) | KV-based per-IP rate limiting **+ off-topic gate** (tiny free model or keyword pre-filter before the flagship call) | 21st question of the day from one IP gets a 429; "what's the capital of France?" is refused without a flagship-model call |
| 4 | `src/components/ChatWidget.astro` (site) | **Done.** Chat widget that streams from this Worker; renders only when `chatEndpoint` is set in `src/data/site.json` (dev: uses localhost:8787 automatically). Enable after Exercise 3. | Works on the live site with CORS locked down |

## After changing site content

Nothing — merging to `main` rebuilds the corpus and redeploys the worker via
GitHub Actions (needs the `CLOUDFLARE_API_TOKEN` repo secret). For local
testing, `npm run build:corpus && npm run deploy` still works.
