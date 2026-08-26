// Chat models offered in the UI — the single source of truth shared by the
// worker (which validates the requested key against this allowlist) and the
// site (which renders the picker from it), so the two can't drift.
//
// All :free — $0/token, but the ~50 req/day OpenRouter budget is
// account-wide and shared across every model. The free lineup changes
// monthly; re-check https://openrouter.ai/models?q=free before swapping.
// (Gemini itself has no free OpenRouter endpoint — Gemma is Google's
// free offering.)
// Declaration order matters: it is also the fallback order the worker sends
// to OpenRouter (requested model first, then the rest as declared here).
export const MODELS = {
  google: {
    // Checked 2026-08-26: ~4s round trip. (The 26B sibling's free pool was
    // rate-limited that day, and gpt-oss-20b lost its :free endpoint.)
    id: 'google/gemma-4-31b-it:free',
    label: 'Google Gemma 4 31B',
  },
  zai: {
    id: 'z-ai/glm-5.2:free',
    label: 'Z.AI GLM 5.2',
  },
  nvidia: {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    label: 'NVIDIA Nemotron Ultra 550B',
  },
} as const;

export type ModelKey = keyof typeof MODELS;

// The 31B Gemma answers in seconds; the 550B Nemotron reasons for a minute+
// before its first token and stays as an opt-in from the picker.
export const DEFAULT_MODEL: ModelKey = 'google';

export function isModelKey(value: unknown): value is ModelKey {
  return typeof value === 'string' && value in MODELS;
}
