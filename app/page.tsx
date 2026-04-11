import PageShell from "@/components/PageShell";

// Sin Supabase. Sin revalidación. Datos servidos desde data/products.json (build time).
export const dynamic = "force-static";

export default function HomePage() {
  return <PageShell />;
}
