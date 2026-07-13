import { askModel, QuotaError } from './chat';

export interface Env {
  OPENROUTER_API_KEY: string;
  // Phase 2 (RAG): AI: Ai; VECTORIZE: VectorizeIndex;
  // Phase 4 (rate limiting): RATE_LIMIT: KVNamespace;
}

const ALLOWED_ORIGINS = new Set([
  'https://rajatbhagat.github.io',
  'http://localhost:4321', // astro dev server
]);

const MAX_QUESTION_LENGTH = 500;

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin':
      origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://rajatbhagat.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not found', { status: 404, headers: cors });
    }

    // TODO(exercise, Phase 4): rate-limit by IP (request.headers.get('CF-Connecting-IP'))
    // using a counter in Workers KV before doing anything expensive.

    let question: unknown;
    try {
      ({ question } = (await request.json()) as { question?: unknown });
    } catch {
      return new Response('Body must be JSON: {"question": "..."}', { status: 400, headers: cors });
    }
    if (typeof question !== 'string' || question.trim().length === 0) {
      return new Response('Missing "question"', { status: 400, headers: cors });
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      return new Response(`Question too long (max ${MAX_QUESTION_LENGTH} chars)`, {
        status: 400,
        headers: cors,
      });
    }

    try {
      const stream = await askModel(env, question.trim());
      return new Response(stream, {
        headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (err) {
      console.error(err);
      if (err instanceof QuotaError) {
        return new Response('Daily question limit reached — please try again tomorrow', {
          status: 429,
          headers: cors,
        });
      }
      return new Response('Something went wrong', { status: 500, headers: cors });
    }
  },
} satisfies ExportedHandler<Env>;
