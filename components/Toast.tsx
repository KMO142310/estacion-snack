"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

export default function ToastStack() {
  const toasts = useCartStore((s) => s.toasts);
  const removeToast = useCartStore((s) => s.removeToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      removeToast(toasts[0].id);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: "fixed",
        bottom: "calc(84px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        pointerEvents: "none",
        width: "calc(100% - 2.5rem)",
        maxWidth: 380,
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              background: "#5A1F1A",
              color: "#F4EADB",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              fontWeight: 500,
              boxShadow: "0 4px 24px rgba(90,31,26,0.25)",
              width: "100%",
              textAlign: "center",
            }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
