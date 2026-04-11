export interface PackItem {
  name: string;
  productId: string;
  kg: number;
  pricePerKg: number;
}

export interface Pack {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  badge: string | null;
  price: number;
  image_url: string;
  image_webp_url: string;
  image_400_url: string;
  items: PackItem[];
}

/** Compute what each item costs individually and the total savings. */
export function computeSavings(pack: Pack): {
  sueltoTotal: number;
  savings: number;
  savingsPct: number;
} {
  const sueltoTotal = pack.items.reduce(
    (sum, item) => sum + item.pricePerKg * item.kg,
    0
  );
  const savings = sueltoTotal - pack.price;
  const savingsPct = Math.round((savings / sueltoTotal) * 100);
  return { sueltoTotal: Math.round(sueltoTotal), savings: Math.round(savings), savingsPct };
}

/** Total kg in a pack */
export function totalKg(pack: Pack): number {
  return +pack.items.reduce((sum, i) => sum + i.kg, 0).toFixed(2);
}
