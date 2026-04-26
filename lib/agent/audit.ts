import "server-only";
import type { AgentContext, AgentTurnResult } from "./types";

/**
 * Audit log de cada interacción con el agente.
 *
 * MVP: structured console.log que Vercel Logs persiste 24h y se puede grep.
 * Futuro: append a tabla `agent_audit_log` con RLS para que el operador
 * vea métricas en /admin/asistente/metrics.
 *
 * Lo que loggeamos:
 *   - Actor (admin email o customer session_id + ip_hash)
 *   - Tools llamadas + success/error
 *   - Tokens consumidos (input + output + cache)
 *   - Latency
 *   - Costo estimado en USD
 *
 * Lo que NO loggeamos:
 *   - Contenido completo de mensajes (PII, demasiado verbose)
 *   - access_token de clientes (secret)
 *   - Phone numbers raw (usar masking)
 */

// Precios claude-sonnet-4-6 (USD por M tokens, 2026-04).
const PRICE_INPUT_PER_M = 3.0;
const PRICE_OUTPUT_PER_M = 15.0;
const PRICE_CACHE_WRITE_PER_M = 3.75; // 25% más caro que input regular
const PRICE_CACHE_READ_PER_M = 0.3; // 90% descuento sobre input

function estimateCostUsd(usage: AgentTurnResult["usage"]): number {
  const inputCost = (usage.input_tokens * PRICE_INPUT_PER_M) / 1_000_000;
  const outputCost = (usage.output_tokens * PRICE_OUTPUT_PER_M) / 1_000_000;
  const cacheWriteCost =
    ((usage.cache_creation_input_tokens ?? 0) * PRICE_CACHE_WRITE_PER_M) / 1_000_000;
  const cacheReadCost =
    ((usage.cache_read_input_tokens ?? 0) * PRICE_CACHE_READ_PER_M) / 1_000_000;
  return Number((inputCost + outputCost + cacheWriteCost + cacheReadCost).toFixed(6));
}

function actorTag(ctx: AgentContext): string {
  if (ctx.actor.kind === "admin") return `admin:${ctx.actor.email}`;
  return `customer:${ctx.session_id.slice(0, 12)}`;
}

export function logAgentTurn(ctx: AgentContext, result: AgentTurnResult): void {
  const cost = estimateCostUsd(result.usage);
  const toolsSummary = result.tool_calls.map((tc) => ({
    name: tc.name,
    ok: !tc.result.is_error,
    pending: !!tc.result.pending_confirmation,
  }));

  // Vercel Logs: una línea estructurada (parseable).
  console.log(
    JSON.stringify({
      tag: "agent_turn",
      actor: actorTag(ctx),
      session: ctx.session_id.slice(0, 12),
      ip_hash: ctx.ip_hash?.slice(0, 12) ?? null,
      tools: toolsSummary,
      tokens: result.usage,
      cost_usd: cost,
      latency_ms: result.latency_ms,
      at: new Date().toISOString(),
    }),
  );
}
