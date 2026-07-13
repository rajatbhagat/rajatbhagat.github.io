// Chat models offered in the UI — the single source of truth shared by the
// worker (which validates the requested key against this allowlist) and the
// site (which renders the picker from it), so the two can't drift.
//
// All :free — $0/token, but the ~50 req/day OpenRouter budget is
// account-wide and shared across every model. The free lineup changes
// monthly; re-check https://openrouter.ai/models?q=free before swapping.
// (Gemini itself has no free OpenRouter endpoint — Gemma is Google's
// free offering.)
export const MODELS = {
  nvidia: {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    label: 'NVIDIA Nemotron Ultra 550B',
  },
  openai: {
    id: 'openai/gpt-oss-20b:free',
    label: 'OpenAI GPT-OSS 20B',
  },
  google: {
    // The 31B sibling is chronically saturated upstream (Google AI Studio);
    // the 26B has a provider with capacity.
    id: 'google/gemma-4-26b-a4b-it:free',
    label: 'Google Gemma 4 26B',
  },
} as const;

export type ModelKey = keyof typeof MODELS;

export const DEFAULT_MODEL: ModelKey = 'nvidia';

export function isModelKey(value: unknown): value is ModelKey {
  return typeof value === 'string' && value in MODELS;
}
