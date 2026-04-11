"use client";

import { useState, type ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import Announce from "./Announce";
import Header from "./Header";
import Footer from "./Footer";
import Bnav from "./Bnav";
import Drawer from "./Drawer";

interface Props {
  children: ReactNode;
}

/**
 * Layout client-side para páginas sin catálogo de productos (contacto, envíos,
 * sobre nosotros, faq). Provee CartProvider, Header, Footer, Bnav y Drawer
 * con lista de productos vacía — el carrito persistido desde otras páginas
 * sigue visible, pero no se puede agregar desde estas páginas.
 */
export default function StaticLayout({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <CartProvider>
      <Announce />
      <Header onCartOpen={() => setDrawerOpen(true)} />
      {children}
      <Footer />
      <Bnav onCartOpen={() => setDrawerOpen(true)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} products={[]} />
    </CartProvider>
  );
}
