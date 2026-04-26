import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { runAgent } from "@/lib/agent/runner";
import { checkRateLimit } from "@/lib/agent/rate-limit";
import type { AgentMessage, AgentContext } from "@/lib/agent/types";

/**
 * Endpoint público del agente conversacional.
 *
 * Casos de uso:
 *   - Cliente consulta estado de su pedido (con order_id + access_token).
 *   - Visitante anónimo consulta info pública (catálogo, envíos, packs).
 *
 * Autenticación:
 *   - Sin token: solo tools de read-only de info pública (no PII de clientes).
 *   - Con phone + access_token válido: desbloquea get_order_details(self).
 *   - NUNCA expone tools de mutación (esas son admin-only).
 *
 * Rate limit: 20 requests / 5 min por (session_id || ip_hash).
 *   - Excede → 429 con header Retry-After.
 *   - Política definida en lib/agent/rate-limit.ts.
 *
 * Costo techo esperado: $20/día con 1000 sesiones (claude-sonnet-4-6).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        // El cliente público sólo manda strings — los blocks complejos
        // (tool_use/tool_result) los maneja el server entre iteraciones.
        content: z.union([
          z.string(),
          z.array(z.unknown()), // permitido sólo para historial server-roundtrip
        ]),
      }),
    )
    .min(1)
    .max(20), // limite de history (anti-bloat)
  session_id: z.string().min(8).max(128),
  customer_phone: z.string().min(8).max(20).optional(),
  access_token: z.string().min(8).max(64).optional(),
});

function getClientIp(req: Request): string {
  // Vercel: x-forwarded-for / x-real-ip. Fallback "unknown".
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function hashWithPepper(value: string): string {
  const pepper = process.env.AUDIT_PEPPER ?? "no-pepper-set";
  return createHash("sha256").update(pepper).update(value).digest("hex").slice(0, 24);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Args inválidos.", detail: parsed.error.message },
      { status: 400 },
    );
  }
  const { messages, session_id, customer_phone, access_token } = parsed.data;

  const ip = getClientIp(req);
  const ipHash = hashWithPepper(ip);

  // Rate limit por session_id + ip_hash (anti-circumvención de session_id rotation).
  const rl = await checkRateLimit(`${session_id}:${ipHash}`);
  if (!rl.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
    return NextResponse.json(
      {
        error: "Estás haciendo demasiadas consultas. Esperá unos minutos.",
        limit: rl.limit,
        remaining: rl.remaining,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      },
    );
  }

  const ctx: AgentContext = {
    actor: { kind: "customer", phone: customer_phone, access_token },
    session_id,
    ip_hash: ipHash,
  };

  try {
    const result = await runAgent({
      messages: messages as AgentMessage[],
      ctx,
    });
    return NextResponse.json(
      { ok: true, result },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      },
    );
  } catch (e) {
    console.error("[/api/agent/chat] runAgent failed:", (e as Error).message);
    return NextResponse.json(
      { error: "El agente no pudo responder. Intentá de nuevo." },
      { status: 500 },
    );
  }
}
