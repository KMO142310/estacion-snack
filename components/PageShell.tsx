"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import Header from "./Header";
import Hero from "./Hero";
import TrustBar from "./TrustBar";
import ProductGrid from "./ProductGrid";
import TopVentas from "./TopVentas";
import PackSection from "./PackSection";
import ComoFunciona from "./ComoFunciona";
import PruebaSocial from "./PruebaSocial";
import DetrasDe from "./DetrasDe";
import CierreCTA from "./CierreCTA";
import Footer from "./Footer";
import OrderSheet from "./OrderSheet";
import ToastStack from "./Toast";

export default function PageShell() {
  const [orderOpen, setOrderOpen] = useState(false);

  // Rehydrate Zustand persisted cart on client
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      <a href="#productos" className="skip">Saltar al contenido</a>
      <Header onOrderOpen={() => setOrderOpen(true)} />
      <main>
        <Hero onOrderOpen={() => setOrderOpen(true)} />
        <TrustBar />
        <ProductGrid />
        <TopVentas />
        <PackSection />
        <ComoFunciona />
        <PruebaSocial />
        <DetrasDe />
        <CierreCTA onOrderOpen={() => setOrderOpen(true)} />
      </main>
      <Footer />

      {/* Sticky CTA mobile — visible mientras no hay sheet abierto */}
      {!orderOpen && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0.75rem 1.25rem",
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
          background: "rgba(244,234,219,0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(90,31,26,0.10)",
        }} aria-hidden="false" className="sticky-cta-mobile">
          <button
            onClick={() => setOrderOpen(true)}
            style={{
              width: "100%",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#F4EADB",
              background: "#D0551F",
              border: "none",
              borderRadius: "12px",
              padding: "0.9375rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 16px rgba(208,85,31,0.32)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pedir por WhatsApp
          </button>
        </div>
      )}

      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
      <ToastStack />

      <style>{`
        @media (min-width: 768px) {
          .sticky-cta-mobile { display: none !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
