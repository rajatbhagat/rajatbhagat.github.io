// Chat models offered in the UI — the single source of truth shared by the
// worker (which validates the requested key against this allowlist) and the
// site (which renders the picker from it), so the two can't drift.
//
// The default is a PAID model (~$0.0004 worst case per request at 5k prompt
// + 1k output tokens); the :free entries cost $0/token and, with >=$10 of
// credits on the account, share a 1,000 req/day budget. The free lineup
// changes monthly; re-check https://openrouter.ai/models?q=free before
// swapping. The worker's global daily cap (index.ts) bounds paid spend.
// Declaration order matters: it is also the fallback order the worker sends
// to OpenRouter (requested model first, then the rest as declared here).
export const MODELS = {
  openai: {
    id: 'openai/gpt-oss-120b',
    label: 'OpenAI GPT-OSS 120B',
  },
  google: {
    // Checked 2026-08-26: ~4s round trip. (The 26B sibling's free pool was
    // rate-limited that day, and gpt-oss-20b lost its :free endpoint.)
    id: 'google/gemma-4-31b-it:free',
    label: 'Google Gemma 4 31B',
  },
  nvidia: {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    label: 'NVIDIA Nemotron Ultra 550B',
  },
} as const;

export type ModelKey = keyof typeof MODELS;

// Paid gpt-oss-120b: no free-pool queueing or daily-cap failures, first
// token in a couple of seconds; the free Gemma is the fallback and the 550B
// Nemotron (a minute+ of reasoning before its first token) stays opt-in.
export const DEFAULT_MODEL: ModelKey = 'openai';

export function isModelKey(value: unknown): value is ModelKey {
  return typeof value === 'string' && value in MODELS;
}
