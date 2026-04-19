"use client";

import { useState, useEffect, type ReactNode } from "react";
import Announce from "./Announce";
import Header from "./Header";
import Footer from "./Footer";
import OrderSheet from "./OrderSheet";
import { useCartStore } from "@/lib/store";

interface Props {
  children: ReactNode;
}

export default function StaticLayout({ children }: Props) {
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <Announce />
        <Header onOrderOpen={() => setOrderOpen(true)} />
      </div>
      {children}
      <Footer />
      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
