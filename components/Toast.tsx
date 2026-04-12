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
    }, 1400);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  const latest = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "calc(70px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9000,
        pointerEvents: "none",
        width: "calc(100% - 2rem)",
        maxWidth: 340,
      }}
    >
      <AnimatePresence mode="wait">
        {latest && (
          <motion.div
            key={latest.id}
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "#5A1F1A",
              color: "#F4EADB",
              padding: "10px 16px",
              borderRadius: 10,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(90,31,26,0.25)",
              textAlign: "center",
            }}
          >
            {latest.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
