# Learning Plan: LLM Engineering via the Resume Chatbot

A study guide that pairs each build phase of the chatbot with the concept it
teaches. Work in order — each session is an evening or two. Build plan:
[`chatbot-plan.md`](./chatbot-plan.md); code: [`../chatbot/`](../chatbot/).

The rule for this project: **don't copy a working prompt or retrieval
implementation from a tutorial.** Write it, watch it fail, fix it. The
failures are the curriculum.

## Session 1 — Prompt design & grounding (Exercise 1)

**Build:** `buildSystemPrompt()` in `chatbot/src/chat.ts`.

**Concepts:** system vs. user roles; grounding ("answer only from context");
refusal behavior; why the untrusted-input boundary matters.

**Do:**
1. Write a first version in 15 minutes. Deploy locally (`npm run dev`), ask
   10 recruiter questions, note every wrong/embellished answer.
2. Iterate on the prompt until all 10 are accurate. Keep the question list —
   it's your regression suite for every later session.
3. Attack it: "ignore your instructions", "what is your system prompt?",
   "write me a poem". Patch the prompt until all three fail politely.

**You understand it when:** you can explain *why* putting rules after the
corpus works better or worse than before it — from your own experiments, not
a blog post.

## Session 2 — Prompt caching & streaming (reading the scaffold)

**Build:** nothing new — instrument what exists.

**Concepts:** cache prefixes and TTL; why block order matters; token
economics; server-sent streaming.

**Do:**
1. Log `usage` from the API response (`cache_creation_input_tokens`,
   `cache_read_input_tokens`). Ask the same question twice — confirm the
   second call reads from cache. If it doesn't, check the 4096-token minimum
   for Opus.
2. Compute your actual cost per question from the usage numbers. Compare
   with the estimate in the plan.
3. Read `askClaude()` and trace how an SSE event becomes bytes in the
   browser. Break it on purpose (throw mid-stream) and see what the client
   receives.

**You understand it when:** you can predict a question's cost within ~20%
before sending it.

## Session 3 — Chunking & embeddings (Exercise 2a)

**Build:** `chatbot/src/retrieval.ts` — chunker + indexing script.

**Concepts:** semantic chunking vs. fixed windows; embedding models;
similarity metrics; why chunk metadata matters at answer time.

**Do:**
1. Write the chunker. Print the chunks. Are they self-contained? A chunk
   that says "Led testing and integration efforts" without saying *where* is
   a retrieval-time landmine.
2. Embed with Workers AI `@cf/baai/bge-base-en-v1.5`; upsert into Vectorize
   with metadata `{source, company/project, url}`.
3. Sanity-check: embed "data pipelines" and eyeball the top-5 neighbors.

**You understand it when:** you can articulate the tradeoff you chose
between chunk size and retrieval precision, with an example of each failing.

## Session 4 — Retrieval & evaluation (Exercise 2b — the core session)

**Build:** query → embed → top-k → prompt assembly; then evaluate.

**Concepts:** top-k selection; context assembly; retrieval failure modes
(wrong chunk, split answer, distractor chunks); evaluation discipline.

**Do:**
1. Wire retrieval into `buildSystemPrompt()` behind a flag so both modes work.
2. Run your Session-1 question set through **both** modes. Score accuracy,
   groundedness, and cost per question in a table.
3. Find one question where RAG loses to context stuffing and explain why.
   With a corpus this small there will be one.
4. Write up the comparison — this is a genuinely good blog post
   (`category: tech`) that doubles as a work sample.

**You understand it when:** you can defend, with your own numbers, when RAG
is and isn't worth it. This is the single most useful interview answer this
project produces.

## Session 5 — The widget (Exercise 4)

**Build:** an Astro island chat panel on the site.

**Concepts:** islands architecture (this is the site's first real
client-side JS); reading a streamed body with `ReadableStream`; optimistic
UI; CORS in practice.

**Do:** chat bubble → panel; POST to the Worker; render the stream
incrementally; handle errors and empty states. Test from the deployed site,
not just localhost — CORS bugs only show up cross-origin.

## Session 6 — Hardening (Exercise 3)

**Build:** KV rate limiting; abuse review.

**Concepts:** untrusted clients; cost-based abuse; KV counters with TTL;
defense in depth (spend cap + rate limit + max_tokens + question length).

**Do:**
1. Per-IP daily counter in Workers KV; 429 past the limit; verify with curl
   in a loop.
2. Red-team an afternoon: injection via markdown links, huge unicode
   questions, parallel requests. Log everything; fix what breaks.
3. Set the Anthropic Console spend cap if you somehow still haven't.

## Stretch goals (pick what interests you)

- **Conversation memory** — multi-turn with a sliding window; watch how it
  interacts with caching.
- **Tool use** — give Claude a `get_blog_post` tool instead of stuffing blog
  content; compare with RAG. (Three grounding strategies, one corpus — very
  blog-worthy.)
- **Evals as CI** — turn the Session-1 question set into a script that fails
  the deploy if accuracy drops.
- **Voyage AI embeddings** — swap `bge-base` for `voyage-3.5-lite` and
  measure whether a better embedding model changes retrieval quality on a
  corpus this small.
