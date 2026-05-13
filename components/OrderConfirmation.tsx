"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { fmt } from "@/lib/cart-utils";
import X from "./icons/X";

const VISIBLE_FOR_MS = 30 * 60 * 1000; // 30 min: ventana razonable para reabrir wa.me si el popup falló.

/**
 * Banner persistente que aparece tras enviar el pedido a WhatsApp.
 * Sirve como red de seguridad: si el popup de WhatsApp no abrió, el cliente
 * puede reabrirlo desde acá. También permite copiar el código del pedido
 * para pegarlo en la conversación.
 */
export default function OrderConfirmation() {
  const lastOrder = useCartStore((s) => s.lastOrder);
  const clearLastOrder = useCartStore((s) => s.clearLastOrder);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!lastOrder) return;
    const elapsed = Date.now() - lastOrder.at;
    if (elapsed > VISIBLE_FOR_MS) {
      clearLastOrder();
      return;
    }
    const remaining = VISIBLE_FOR_MS - elapsed;
    const timer = setTimeout(clearLastOrder, remaining);
    return () => clearTimeout(timer);
  }, [lastOrder, clearLastOrder]);

  const handleCopy = async () => {
    if (!lastOrder) return;
    try {
      await navigator.clipboard.writeText(lastOrder.ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — clipboard puede fallar en contextos sin HTTPS
    }
  };

  return (
    <AnimatePresence>
      {lastOrder ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          role="status"
          aria-live="polite"
          className="oc"
        >
          <div className="oc-icon" aria-hidden="true">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="oc-body">
            <p className="oc-title">Tu pedido ya está listo en WhatsApp</p>
            <p className="oc-copy">Si no se abrió o lo cerraste, puedes volver a abrirlo acá.</p>
            <p className="oc-meta">
              Total {fmt(lastOrder.total)} · referencia
              <button
                type="button"
                onClick={handleCopy}
                className="oc-ref"
                aria-label={copied ? "Copiado" : `Copiar referencia ${lastOrder.ref}`}
              >
                {copied ? "¡Copiado!" : `#${lastOrder.ref}`}
              </button>
            </p>
          </div>
          <a
            href={lastOrder.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="oc-action"
          >
            Abrir de nuevo
          </a>
          <button
            type="button"
            onClick={clearLastOrder}
            className="oc-close"
            aria-label="Cerrar confirmación"
          >
            <X size={14} />
          </button>

          <style>{`
            .oc {
              position: fixed;
              left: 50%;
              transform: translateX(-50%);
              bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
              z-index: var(--z-toast, 600);
              display: flex;
              align-items: center;
              gap: var(--space-3);
              max-width: min(560px, calc(100vw - var(--space-4) * 2));
              width: max-content;
              padding: var(--space-3) var(--space-4);
              background: var(--text);
              color: var(--text-inverse);
              border-radius: var(--radius-lg);
              box-shadow: var(--elev-4);
              font-family: var(--font-body);
              font-size: var(--fs-sm);
              letter-spacing: var(--tracking-normal);
            }
            .oc-icon {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: var(--success);
              flex-shrink: 0;
            }
            .oc-body {
              flex: 1;
              min-width: 0;
            }
            .oc-title {
              font-weight: 500;
              margin: 0;
              line-height: 1.3;
            }
            .oc-meta {
              margin: 2px 0 0;
              color: rgba(255,255,255,0.72);
              font-size: var(--fs-xs);
              display: flex;
              align-items: center;
              gap: 6px;
              flex-wrap: wrap;
            }
            .oc-copy {
              margin: 3px 0 0;
              color: rgba(255,255,255,0.78);
              font-size: var(--fs-xs);
              line-height: 1.4;
            }
            .oc-ref {
              padding: 2px 8px;
              border-radius: var(--radius-full);
              background: rgba(255,255,255,0.12);
              color: var(--text-inverse);
              font-family: ui-monospace, SFMono-Regular, monospace;
              font-size: var(--fs-xs);
              cursor: pointer;
              transition: background var(--dur-fast) var(--ease-standard);
            }
            .oc-ref:hover { background: rgba(255,255,255,0.22); }
            .oc-action {
              white-space: nowrap;
              padding: var(--space-2) var(--space-4);
              border-radius: var(--radius-full);
              background: var(--accent);
              color: var(--text-inverse);
              font-weight: 500;
              font-size: var(--fs-sm);
              transition: background var(--dur-fast) var(--ease-standard),
                          transform var(--dur-fast) var(--ease-standard);
            }
            .oc-action:hover { background: var(--accent-hover); }
            .oc-action:active { transform: scale(0.97); }
            .oc-close {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: rgba(255,255,255,0.08);
              color: rgba(255,255,255,0.7);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background var(--dur-fast) var(--ease-standard);
            }
            .oc-close:hover {
              background: rgba(255,255,255,0.16);
              color: var(--text-inverse);
            }
            @media (max-width: 540px) {
              .oc {
                flex-wrap: wrap;
                gap: var(--space-2) var(--space-3);
              }
              .oc-action { flex: 1; text-align: center; }
            }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
