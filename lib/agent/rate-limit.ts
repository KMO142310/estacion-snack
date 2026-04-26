import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting para el endpoint público /api/agent/chat.
 *
 * Política: 20 requests / 5 minutos por (session_id || ip_hash).
 *
 * - Rationale: una conversación normal son 5-10 turns. 20/5min permite ida
 *   y vuelta razonable y bloquea abuse / flood.
 * - Si Upstash NO está configurado en env, el rate limit se DESACTIVA con
 *   warning — útil para dev local sin cuenta Upstash. NO desactivar en prod.
 */

let _ratelimit: Ratelimit | null = null;
let _disabled = false;

function getRatelimit(): Ratelimit | null {
  if (_disabled) return null;
  if (_ratelimit) return _ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL/_TOKEN no configurados → rate limit DESACTIVADO. Setealos en Vercel para prod.",
    );
    _disabled = true;
    return null;
  }

  const redis = new Redis({ url, token });
  _ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "5 m"),
    analytics: true,
    prefix: "agent_chat",
  });
  return _ratelimit;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Chequea rate limit por identifier (session_id o ip_hash).
 *
 * Si Upstash no está configurado, retorna allowed=true (fail-open en dev).
 * En prod, asegurate de tener las env vars seteadas.
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const rl = getRatelimit();
  if (!rl) {
    return { allowed: true, limit: 20, remaining: 20, reset: 0 };
  }
  const { success, limit, remaining, reset } = await rl.limit(identifier);
  return { allowed: success, limit, remaining, reset };
}
