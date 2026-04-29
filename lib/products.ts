import productsData from "@/data/products.json";
import type { Product } from "./types";

const CAT_LABEL: Record<string, string> = {
  frutos: "Frutos secos",
  dulces: "Dulces",
};

function withCatLabel(row: Record<string, unknown>): Product {
  return {
    ...row,
    cat_label: CAT_LABEL[row.category as string] ?? String(row.category ?? ""),
  } as Product;
}

const PRODUCTS: Product[] = productsData.map((p) =>
  withCatLabel(p as unknown as Record<string, unknown>),
);

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | null {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}
