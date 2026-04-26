"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { chatAdmin } from "@/lib/admin-actions";
import type { AgentMessage, AgentTurnResult } from "@/lib/agent/types";

/**
 * UI conversacional para /admin/asistente.
 *
 * - Lista de mensajes con scroll auto al final.
 * - Tool calls renderizadas con prefijo (✓/⚠️/⏳ confirmación).
 * - Pending confirmation: chip amarillo con botones Confirmar / Cancelar.
 * - Input multi-line con Cmd+Enter para enviar.
 *
 * Estilo: Apple-clean (mismo lenguaje del sitio público).
 */

type UiMessage = {
  role: "user" | "assistant";
  text: string;
  tool_calls?: AgentTurnResult["tool_calls"];
  pending?: { tool_name: string; summary: string; next_args: Record<string, unknown> };
};

const SEED_PROMPTS = [
  "¿Cuántos pedidos pendientes hay?",
  "¿Qué pidió el cliente con teléfono +56953743338?",
  "Muéstrame los pedidos confirmados de la semana",
];

export default function AssistantChat() {
  const [history, setHistory] = useState<AgentMessage[]>([]);
  const [ui, setUi] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [ui, loading]);

  const send = useCallback(
    async (userText: string, autoConfirm?: { tool_name: string; next_args: Record<string, unknown> }) => {
      if (!userText.trim() && !autoConfirm) return;
      setError(null);
      setLoading(true);

      // Construimos messages para el agente.
      // Si autoConfirm: el último user message es el "confirmo" + el agente
      // ya tiene memoria de qué tool quería ejecutar.
      const newUserMessage: AgentMessage = {
        role: "user",
        content: autoConfirm
          ? `Confirmo. Ejecutá ${autoConfirm.tool_name} con args: ${JSON.stringify(autoConfirm.next_args)}.`
          : userText,
      };
      const nextHistory = [...history, newUserMessage];
      setHistory(nextHistory);
      setUi((prev) => [...prev, { role: "user", text: autoConfirm ? "✓ Confirmado" : userText }]);
      setInput("");

      try {
        const res = await chatAdmin(nextHistory);
        if (!res.ok) {
          setError(res.error);
          setLoading(false);
          return;
        }
        // Extraer texto de la reply (assistant content puede ser string o array de blocks).
        const reply = res.result.reply;
        let assistantText = "";
        if (typeof reply.content === "string") {
          assistantText = reply.content;
        } else {
          assistantText = reply.content
            .filter((b) => b.type === "text")
            .map((b) => (b as { text: string }).text)
            .join("\n");
        }

        // Pending confirmation: tomar el último tool_call con pending_confirmation.
        const lastPending = res.result.tool_calls
          .slice()
          .reverse()
          .find((tc) => tc.result.pending_confirmation);

        const pending = lastPending && lastPending.result.pending_confirmation
          ? {
              tool_name: lastPending.name,
              summary: lastPending.result.pending_confirmation.summary,
              next_args: lastPending.result.pending_confirmation.next_args,
            }
          : undefined;

        setUi((prev) => [
          ...prev,
          {
            role: "assistant",
            text: assistantText,
            tool_calls: res.result.tool_calls,
            pending,
          },
        ]);

        // Persistir en history del agente para next turn.
        setHistory((h) => [...h, { role: "assistant", content: reply.content }]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [history],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <div className="ac">
      <div ref={scrollRef} className="ac-scroll">
        {ui.length === 0 && (
          <div className="ac-empty">
            <p className="ac-empty-title">Asistente de Estación Snack</p>
            <p className="ac-empty-sub">
              Preguntá lo que necesités sobre pedidos, clientes y stock. El agente confirma cualquier
              cambio antes de ejecutarlo.
            </p>
            <div className="ac-seeds">
              {SEED_PROMPTS.map((p) => (
                <button key={p} type="button" className="ac-seed" onClick={() => void send(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {ui.map((m, i) => (
          <div key={i} className={`ac-msg ac-msg--${m.role}`}>
            <p className="ac-msg-role">{m.role === "user" ? "Vos" : "Asistente"}</p>
            <div className="ac-msg-text">{m.text || <em>(sin respuesta textual)</em>}</div>

            {m.tool_calls && m.tool_calls.length > 0 && (
              <ul className="ac-tools">
                {m.tool_calls.map((tc, j) => (
                  <li key={j} className={`ac-tool ${tc.result.is_error ? "ac-tool--error" : ""}`}>
                    <span className="ac-tool-name">{tc.name}</span>
                    {tc.result.pending_confirmation ? (
                      <span className="ac-tool-status">⏳ esperando confirmación</span>
                    ) : tc.result.is_error ? (
                      <span className="ac-tool-status">⚠️ error</span>
                    ) : (
                      <span className="ac-tool-status">✓ ejecutada</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {m.pending && (
              <div className="ac-confirm">
                <p className="ac-confirm-summary">{m.pending.summary}</p>
                <div className="ac-confirm-btns">
                  <button
                    type="button"
                    className="ac-btn-primary"
                    disabled={loading}
                    onClick={() =>
                      void send("Confirmo, dale.", {
                        tool_name: m.pending!.tool_name,
                        next_args: m.pending!.next_args,
                      })
                    }
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="ac-btn-secondary"
                    disabled={loading}
                    onClick={() => void send("Cancelo, no hagas el cambio.")}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="ac-msg ac-msg--assistant">
            <p className="ac-msg-role">Asistente</p>
            <div className="ac-msg-text ac-loading">Pensando…</div>
          </div>
        )}

        {error && <div className="ac-error">⚠️ {error}</div>}
      </div>

      <form className="ac-form" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregunta lo que quieras… (Cmd/Ctrl + Enter para enviar)"
          rows={2}
          disabled={loading}
          className="ac-input"
        />
        <button type="submit" disabled={loading || !input.trim()} className="ac-send">
          Enviar
        </button>
      </form>

      <style>{`
        .ac {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          max-width: 920px;
          margin: 0 auto;
          background: #ffffff;
        }
        .ac-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ac-empty {
          margin: auto;
          text-align: center;
          max-width: 520px;
          padding: 2rem;
        }
        .ac-empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.022em;
          margin: 0 0 0.5rem;
        }
        .ac-empty-sub {
          font-size: 0.9375rem;
          color: #6e6e73;
          margin: 0 0 1.5rem;
          line-height: 1.5;
        }
        .ac-seeds {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }
        .ac-seed {
          padding: 10px 16px;
          background: #f5f5f7;
          color: #1d1d1f;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .ac-seed:hover { background: #e6e6e8; }

        .ac-msg {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ac-msg--user { align-items: flex-end; }
        .ac-msg-role {
          font-size: 11px;
          font-weight: 600;
          color: #86868b;
          letter-spacing: 0.02em;
          margin: 0;
          text-transform: uppercase;
        }
        .ac-msg-text {
          font-size: 0.9375rem;
          line-height: 1.55;
          color: #1d1d1f;
          padding: 12px 16px;
          background: #f5f5f7;
          border-radius: 16px;
          max-width: 78%;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .ac-msg--user .ac-msg-text {
          background: #1d1d1f;
          color: #ffffff;
        }

        .ac-tools {
          list-style: none;
          margin: 4px 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 78%;
        }
        .ac-tool {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 12px;
          color: #6e6e73;
          padding: 4px 12px;
          background: #fafafa;
          border-radius: 999px;
          border: 1px solid #e6e6e6;
        }
        .ac-tool--error { background: #ffeded; border-color: #ffd0d0; color: #b74432; }
        .ac-tool-name {
          font-weight: 500;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 11.5px;
          color: #1d1d1f;
        }

        .ac-confirm {
          margin-top: 8px;
          padding: 14px 16px;
          background: #FFFBEA;
          border: 1px solid #EFD200;
          border-radius: 12px;
          max-width: 78%;
        }
        .ac-confirm-summary {
          font-size: 0.875rem;
          color: #1d1d1f;
          margin: 0 0 10px;
          line-height: 1.5;
        }
        .ac-confirm-btns {
          display: flex;
          gap: 8px;
        }
        .ac-btn-primary {
          padding: 8px 16px;
          background: #1d1d1f;
          color: #ffffff;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        .ac-btn-primary:hover { background: #424245; }
        .ac-btn-primary:disabled { opacity: 0.5; cursor: wait; }
        .ac-btn-secondary {
          padding: 8px 16px;
          background: transparent;
          color: #1d1d1f;
          border: 1px solid #d2d2d7;
          border-radius: 999px;
          font-size: 13px;
          cursor: pointer;
        }
        .ac-btn-secondary:hover { background: #f5f5f7; }

        .ac-loading {
          opacity: 0.6;
          animation: ac-pulse 1.4s ease-in-out infinite;
        }
        @keyframes ac-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        .ac-error {
          padding: 12px 16px;
          background: #ffeded;
          color: #b74432;
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .ac-form {
          display: flex;
          gap: 8px;
          padding: 1rem 1.25rem;
          border-top: 1px solid #e6e6e6;
          background: #ffffff;
        }
        .ac-input {
          flex: 1;
          font-family: inherit;
          font-size: 0.9375rem;
          color: #1d1d1f;
          background: #f5f5f7;
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 12px 14px;
          resize: none;
          outline: none;
          line-height: 1.4;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .ac-input:focus {
          background: #ffffff;
          border-color: #0071e3;
        }
        .ac-send {
          padding: 12px 24px;
          background: #1d1d1f;
          color: #ffffff;
          border: none;
          border-radius: 999px;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          align-self: flex-end;
        }
        .ac-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .ac-send:hover:not(:disabled) { background: #424245; }
      `}</style>
    </div>
  );
}
