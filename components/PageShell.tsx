"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import Announce from "./Announce";
import Header from "./Header";
import Hero from "./Hero";
import Benefits from "./Benefits";
import Marquee from "./Marquee";
import Combos from "./Combos";
import ProductGrid from "./ProductGrid";
import Testimonials from "./Testimonials";
import About from "./About";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Footer from "./Footer";
import Bnav from "./Bnav";
import Drawer from "./Drawer";

interface Props {
  products: Product[];
}

export default function PageShell({ products }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <a href="#productos" className="skip">Saltar al contenido</a>
      <Announce />
      <Header onCartOpen={() => setDrawerOpen(true)} />
      <main>
        <Hero />
        <Benefits />
        <Marquee />
        <Combos products={products} />
        <ProductGrid products={products} />
        <Testimonials />
        <About />
        <FAQ />
        <CTA onCartOpen={() => setDrawerOpen(true)} />
      </main>
      <Footer />
      <Bnav onCartOpen={() => setDrawerOpen(true)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} products={products} />
    </>
  );
}
