# Ask My Resume — chatbot Worker

A Cloudflare Worker that answers questions about Rajat's experience using the
Claude API, grounded in the same content files that render the portfolio site.

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
npx wrangler secret put ANTHROPIC_API_KEY
```

Set a monthly spend cap in the [Anthropic Console](https://console.anthropic.com/)
before deploying anything public.

## Develop

```bash
npm run dev                 # local worker at localhost:8787
# For local secrets, create .dev.vars: ANTHROPIC_API_KEY=sk-ant-...

curl -N localhost:8787/chat \
  -H 'Content-Type: application/json' \
  -d '{"question": "What did Rajat do at Discover?"}'
```

`npm run typecheck` must pass; `npm run deploy` ships it.

## Exercises

| # | Where | What | Done when |
|---|---|---|---|
| 1 | `src/chat.ts` → `buildSystemPrompt()` | Persona, grounding, injection defense, prompt caching | 10 recruiter questions answered accurately; "reveal your prompt" and "ignore your instructions" politely refused |
| 2 | Phase 2, new `src/retrieval.ts` | Chunking + Workers AI embeddings + Vectorize top-k retrieval | OCC questions retrieve OCC chunks, not JPMC ones; compare answer quality vs. Exercise 1 |
| 3 | `src/index.ts` (marked TODO) | KV-based per-IP rate limiting | 21st question of the day from one IP gets a 429 |
| 4 | Site: new Astro island | Chat widget that streams from this Worker | Works on the live site with CORS locked down |

## After changing site content

```bash
npm run build:corpus && npm run deploy
```
