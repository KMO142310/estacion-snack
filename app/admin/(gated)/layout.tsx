import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || user.email !== adminEmail) {
    redirect("/admin/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "var(--font-outfit), system-ui, sans-serif" }}>
      <nav style={{
        background: "#1A1816",
        color: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        height: 56,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 18, marginRight: 16 }}>
          Estación Snack
        </span>
        <a href="/admin"           style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", padding: "4px 12px", borderRadius: 8 }}>Inicio</a>
        <a href="/admin/productos" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", padding: "4px 12px", borderRadius: 8 }}>Productos</a>
        <a href="/admin/pedidos"   style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", padding: "4px 12px", borderRadius: 8 }}>Pedidos</a>
        <a href="/admin/clientes"  style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", padding: "4px 12px", borderRadius: 8 }}>Clientes</a>
        <a href="/admin/contacto"  style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", padding: "4px 12px", borderRadius: 8 }}>Contacto</a>
        <a href="/admin/asistente" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", padding: "4px 12px", borderRadius: 8 }}>Asistente ✨</a>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{user.email}</span>
        <form action="/admin/logout" method="POST">
          <button style={{ fontSize: 12, color: "rgba(255,255,255,.5)", background: "none", border: "none", cursor: "pointer" }}>
            Salir
          </button>
        </form>
      </nav>
      <main style={{ padding: "24px 24px 48px" }}>
        {children}
      </main>
    </div>
  );
}
