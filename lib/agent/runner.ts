import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./system-prompt";
import { toolsForActor } from "./tools";
import { EXECUTORS } from "./executors";
import { logAgentTurn } from "./audit";
import type { AgentContext, AgentMessage, AgentTurnResult, ToolResult } from "./types";

// Modelo por env var para poder rotar sin redeploy si Anthropic deprecia.
// Default: claude-sonnet-4-6 — sweet spot 2026 (precio/inteligencia).
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
const MAX_TOKENS = 2048;
const MAX_TOOL_ITERATIONS = 6; // safety cap — un agente normal usa 1-3 iteraciones

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY no configurada en env. Ver .env.local.example.");
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

/**
 * Convierte AgentMessage[] a Anthropic SDK MessageParam[].
 * Acepta strings o arrays de blocks.
 */
function toAnthropicMessages(messages: AgentMessage[]): Anthropic.MessageParam[] {
  return messages.map((m) => ({
    role: m.role,
    content: typeof m.content === "string"
      ? m.content
      : (m.content as unknown as Anthropic.ContentBlockParam[]),
  }));
}

/**
 * Ejecuta el agente con tool-use loop.
 *
 * Flujo:
 *   1. Llama a Anthropic con messages + tools.
 *   2. Si la respuesta tiene tool_use blocks → ejecuta cada uno → agrega
 *      tool_result blocks → vuelve a llamar.
 *   3. Repite hasta que el modelo responda sin tool_use (mensaje final) o
 *      hasta MAX_TOOL_ITERATIONS (safety).
 *
 * Prompt caching: el system prompt va con cache_control "ephemeral" — la
 * primera llamada lo escribe al cache (5 min TTL), las siguientes lo leen
 * a 10% del costo.
 */
export async function runAgent({
  messages,
  ctx,
  signal,
}: {
  messages: AgentMessage[];
  ctx: AgentContext;
  signal?: AbortSignal;
}): Promise<AgentTurnResult> {
  const startedAt = Date.now();
  const client = getClient();

  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: buildSystemPrompt(ctx.actor.kind),
      cache_control: { type: "ephemeral" },
    },
  ];

  const tools = toolsForActor(ctx.actor).map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema,
  }));

  const conversation: Anthropic.MessageParam[] = toAnthropicMessages(messages);
  const toolCalls: AgentTurnResult["tool_calls"] = [];
  const usage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  };

  for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
    const res = await client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        tools,
        messages: conversation,
      },
      { signal },
    );

    usage.input_tokens += res.usage.input_tokens;
    usage.output_tokens += res.usage.output_tokens;
    usage.cache_creation_input_tokens += res.usage.cache_creation_input_tokens ?? 0;
    usage.cache_read_input_tokens += res.usage.cache_read_input_tokens ?? 0;

    // Si terminó sin tool_use → es la respuesta final.
    if (res.stop_reason !== "tool_use") {
      conversation.push({ role: "assistant", content: res.content });
      const final: AgentTurnResult = {
        reply: {
          role: "assistant",
          content: res.content as unknown as AgentMessage["content"],
        },
        tool_calls: toolCalls,
        usage,
        latency_ms: Date.now() - startedAt,
      };
      logAgentTurn(ctx, final);
      return final;
    }

    // Hubo tool_use → ejecutamos cada uno.
    conversation.push({ role: "assistant", content: res.content });

    const toolUseBlocks = res.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of toolUseBlocks) {
      const executor = EXECUTORS[block.name];
      let result: ToolResult;
      if (!executor) {
        result = { content: `Tool desconocida: ${block.name}`, is_error: true };
      } else {
        try {
          result = await executor(block.input, ctx);
        } catch (e) {
          result = { content: `Error en ${block.name}: ${(e as Error).message}`, is_error: true };
        }
      }

      toolCalls.push({
        name: block.name,
        input: block.input as Record<string, unknown>,
        result,
      });

      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: result.content,
        is_error: result.is_error,
      });
    }

    conversation.push({ role: "user", content: toolResults });
  }

  // Fallback: si excedemos MAX_TOOL_ITERATIONS, devolvemos lo último + warning.
  const fallback: AgentTurnResult = {
    reply: {
      role: "assistant",
      content: `(Excedí ${MAX_TOOL_ITERATIONS} iteraciones de tools sin llegar a respuesta. Reformulá tu pedido más simple.)`,
    },
    tool_calls: toolCalls,
    usage,
    latency_ms: Date.now() - startedAt,
  };
  logAgentTurn(ctx, fallback);
  return fallback;
}
