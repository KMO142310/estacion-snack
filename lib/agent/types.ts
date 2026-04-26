/**
 * Tipos del agente conversacional.
 *
 * Diseño: shapes minimalistas + zod-validated en el boundary del server
 * action / API route. NO se exponen tipos del SDK Anthropic en componentes
 * cliente (encapsulación).
 */
import type Anthropic from "@anthropic-ai/sdk";

/** Mensaje en la conversación. Compatible con Anthropic Messages API. */
export type AgentRole = "user" | "assistant";

export interface AgentMessage {
  role: AgentRole;
  /** Texto plano O lista de bloques (text + tool_use + tool_result). */
  content: string | AgentContentBlock[];
}

export type AgentContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean };

/** Resultado normalizado de una llamada a tool. */
export interface ToolResult {
  /** Contenido textual que el modelo verá. JSON.stringify de objetos complejos. */
  content: string;
  /** Si el tool falló (input inválido, sin permiso, error de DB). */
  is_error?: boolean;
  /**
   * Si el tool requiere confirmación humana antes de ejecutar (mutaciones).
   * El executor responde con esto cuando `confirmed: false`. La UI renderiza
   * un chip + botones Confirmar/Cancelar.
   */
  pending_confirmation?: {
    summary: string;
    next_args: Record<string, unknown>;
  };
}

/** Contexto de quien invoca al agente — define qué tools puede usar. */
export interface AgentContext {
  actor:
    | { kind: "admin"; email: string }
    | { kind: "customer"; phone?: string; access_token?: string };
  /** Para audit log + rate limiting. */
  session_id: string;
  /** Hash de IP (con AUDIT_PEPPER) — solo para audit, nunca raw. */
  ip_hash?: string;
}

/** Definición de una tool — alimenta el array `tools` del SDK. */
export interface ToolDef {
  name: string;
  description: string;
  input_schema: Anthropic.Tool.InputSchema;
  /** Solo admin puede invocar. */
  admin_only?: boolean;
  /** Mutación → require_confirmation pattern (executor revisa args.confirmed). */
  requires_confirmation?: boolean;
}

/** Resultado de una conversación — lo que el server action retorna a la UI. */
export interface AgentTurnResult {
  /** Mensaje completo del agente (texto + tool_calls que ejecutó). */
  reply: AgentMessage;
  /** Tools ejecutadas en este turn (para mostrar en UI tipo "Buscando…"). */
  tool_calls: Array<{ name: string; input: Record<string, unknown>; result: ToolResult }>;
  /** Tokens consumidos (para audit + métricas). */
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  /** Latencia total del turn en ms. */
  latency_ms: number;
}
