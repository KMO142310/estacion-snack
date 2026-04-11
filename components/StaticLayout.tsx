"use client";

import { useState, useEffect, type ReactNode } from "react";
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
      <Header onOrderOpen={() => setOrderOpen(true)} />
      {children}
      <Footer />
      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
