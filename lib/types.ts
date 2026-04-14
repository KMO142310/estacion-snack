export type ProductStatus = "disponible" | "pocas" | "ultimo_kg" | "agotado";
export type ProductColor = "orange" | "green" | "red" | "purple" | "yellow" | "sand";

export interface NutritionInfo {
  energia_kcal?: number;
  proteinas_g?: number;
  grasas_g?: number;
  carbohidratos_g?: number;
  fibra_g?: number;
  sodio_mg?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  cat_label: string;
  price: number;
  unit: string;
  stock_kg: number;
  low_threshold: number;
  status: ProductStatus;
  image_url: string;
  image_webp_url: string;
  image_400_url: string;
  copy: string;
  badge: string | null;
  sort_order: number;
  color: ProductColor;
  long_description?: string | null;
  long_copy?: string | null;
  nutrition?: NutritionInfo | null;
  is_active?: boolean;
  min_unit_kg?: number; // formato de venta: siempre 1 kg mínimo
  occasion?: string | null; // hook editorial — ej "El repetido de todos los jueves."
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Cart {
  sessionId: string;
  items: Record<string, number>; // productId -> kg
}

export type OrderStatus =
  | "pending_whatsapp"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  notes: string | null;
  whatsapp_sent_at: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  qty: number;
  unit_price: number;
  subtotal: number;
}
