"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

export default function ToastStack() {
  const toasts = useCartStore((s) => s.toasts);
  const removeToast = useCartStore((s) => s.removeToast);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      removeToast(toasts[0].id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  const latest = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "calc(70px + env(safe-area-inset-bottom, 0px))",
        left: 12,
        right: 12,
        zIndex: 9000,
      }}
    >
      <AnimatePresence mode="wait">
        {latest && (
          <motion.div
            key={latest.id}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            style={{
              background: "#5A1F1A",
              color: "#F4EADB",
              padding: "12px 14px",
              borderRadius: 14,
              fontFamily: "var(--font-body)",
              boxShadow: "0 8px 32px rgba(90,31,26,0.35)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Checkmark */}
            <span style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#5E6B3E", display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              animation: "scaleIn 0.3s ease",
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#F4EADB" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>

            {/* Message */}
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>
              {latest.message}
            </span>

            {/* CTA */}
            <button
              onClick={() => {
                removeToast(latest.id);
                setOrderOpen(true);
              }}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 13,
                color: "#5A1F1A",
                background: "#F4EADB",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              Ver pedido
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
