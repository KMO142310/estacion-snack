import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/actions";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estacionsnack.cl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/contacto`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/envios`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/faq`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/sobre-nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE}/producto/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
