import { askModel, QuotaError, type ChatMessage } from './chat';
import { DEFAULT_MODEL, isModelKey } from './models';

export interface Env {
  OPENROUTER_API_KEY: string;
  // Phase 2 (RAG): AI: Ai; VECTORIZE: VectorizeIndex;
  RATE_LIMIT: KVNamespace;
}

const ALLOWED_ORIGINS = new Set([
  'https://rajatbhagat.github.io'
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

    // Rate limiting: allow 15 requests per user per day (based on IP address)
    const user_ip = request.headers.get("CF-Connecting-IP") ?? 'unknown';
    const current_date = new Date().toISOString().slice(0, 10);
    const key = `rate-limit:${user_ip}:${current_date}`;
    const user_request_count = await env.RATE_LIMIT.get(key) || '0'; // key can be any string of your choosing
    
    if (Number(user_request_count) > 15) {
      return new Response(
        `429 Failure – Rate limit exceeded for user`,
        { status: 429, headers: cors },
      );
    }
    await env.RATE_LIMIT.put(key, Number(user_request_count) + 1 + "", { expirationTtl: 60 * 60 * 48 });

    let question: unknown;
    let model: unknown;
    let messages: unknown;
    try {
      ({ question, model, messages } = (await request.json()) as { question?: unknown; model?: unknown; messages?: unknown });
    } catch {
      return new Response('Body must be JSON: {"question": "..."}', { status: 400, headers: cors });
    }

    if (messages !== undefined && !Array.isArray(messages)) {
      return new Response('messages must be a list of objects', { status: 400, headers: cors });
    }

    const normalizedMessages = Array.isArray(messages)
      ? messages.filter((message): message is ChatMessage => {
          return (
            typeof message === "object" &&
            message !== null &&
            typeof (message as ChatMessage).role === "string" &&
            ((message as ChatMessage).role == "user" || (message as ChatMessage).role == "assistant") &&
            typeof (message as ChatMessage).content === "string"
          );
        })
      : [];

    if (Array.isArray(messages) && normalizedMessages.length !== messages.length) {
      return new Response('Each message must include a string role and content', { status: 400, headers: cors });
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

    // Anything not on the allowlist (including absent) falls back to the
    // default — the client can never name an arbitrary OpenRouter model.
    const modelKey = isModelKey(model) ? model : DEFAULT_MODEL;

    try {
      const stream = await askModel(env, question.trim(), modelKey, normalizedMessages);
      return new Response(stream, {
        headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (err) {
      console.error(err);
      if (err instanceof QuotaError) {
        return new Response('Free AI quota is busy or spent — try again in a few minutes, or tomorrow', {
          status: 429,
          headers: cors,
        });
      }
      return new Response('Something went wrong', { status: 500, headers: cors });
    }
  },
} satisfies ExportedHandler<Env>;
