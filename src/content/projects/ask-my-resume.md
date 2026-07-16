---
name: Ask My Resume
tech: [Cloudflare Workers, TypeScript, OpenRouter, LLMs, Astro, Workers KV]
links:
  - label: Try it live
    url: https://rajatbhagat.github.io/ask-my-resume/
  - label: Code
    url: https://github.com/rajatbhagat/rajatbhagat.github.io/tree/main/chatbot
  - label: Design doc
    url: https://rajatbhagat.github.io/blog/ask-my-resume-design/
date: 2026-07-15
---

An AI assistant embedded in this site that answers recruiter questions about my experience, grounded in the site's own content. A Cloudflare Worker proxies requests to an LLM (via OpenRouter) so the API key never reaches the browser — with streamed responses, a model picker, conversation memory, per-IP rate limiting, and prompt-injection defenses. Runs entirely on free tiers with no backend server to operate.
