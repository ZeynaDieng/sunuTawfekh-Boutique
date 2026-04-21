import type { Product } from "~/utils/data";

/**
 * Payload produit côté gestion de stock (souple : adaptez au JSON réel).
 * Le mapper remplit des valeurs par défaut pour les champs manquants.
 */
export type StockApiProductInput = Record<string, unknown> & {
  id?: string | number;
  sku?: string;
  name?: string;
  title?: string;
  label?: string;
  description?: string;
  price?: number;
  unit_price?: number;
  price_fcfa?: number;
  old_price?: number;
  compare_at_price?: number;
  image?: string;
  thumbnail?: string;
  cover?: string;
  images?: unknown;
  category?: string;
  category_id?: string;
  categoryId?: string;
  in_stock?: boolean;
  inStock?: boolean;
  stock_quantity?: number;
  is_new?: boolean;
  isNew?: boolean;
  is_promo?: boolean;
  isPromo?: boolean;
  rating?: number;
  reviews?: number;
  reviews_count?: number;
  filters?: Record<string, string>;
  attributes?: Record<string, string>;
};

function pickImages(raw: StockApiProductInput): string[] | undefined {
  const imgs = raw.images;
  if (!Array.isArray(imgs)) return undefined;
  return imgs.map((x) => String(x)).filter(Boolean);
}

export function mapStockApiProductToProduct(raw: StockApiProductInput): Product {
  const id = String(raw.id ?? raw.sku ?? "").trim() || "unknown";
  const name = String(raw.name ?? raw.title ?? raw.label ?? "Produit").trim();
  const price = Number(raw.price ?? raw.unit_price ?? raw.price_fcfa ?? 0);
  const oldRaw = raw.old_price ?? raw.compare_at_price;
  const oldPrice = oldRaw !== undefined && oldRaw !== null ? Number(oldRaw) : undefined;
  const images = pickImages(raw);
  const image = String(raw.image ?? raw.thumbnail ?? raw.cover ?? images?.[0] ?? "").trim();
  const category = String(raw.category ?? raw.category_id ?? raw.categoryId ?? "divers").trim();
  const description = String(raw.description ?? "").trim() || name;
  const stockQty = raw.stock_quantity;
  const inStock =
    typeof raw.in_stock === "boolean"
      ? raw.in_stock
      : typeof raw.inStock === "boolean"
        ? raw.inStock
        : typeof stockQty === "number"
          ? stockQty > 0
          : true;
  const isNew = Boolean(raw.is_new ?? raw.isNew);
  const isPromo = Boolean(raw.is_promo ?? raw.isPromo);
  const rating = Number(raw.rating ?? 0) || 0;
  const reviews = Number(raw.reviews ?? raw.reviews_count ?? 0) || 0;
  const filters: Record<string, string> = {
    ...(typeof raw.filters === "object" && raw.filters !== null ? raw.filters : {}),
    ...(typeof raw.attributes === "object" && raw.attributes !== null ? raw.attributes : {}),
  };

  return {
    id,
    name,
    price,
    oldPrice: oldPrice !== undefined && !Number.isNaN(oldPrice) ? oldPrice : undefined,
    image,
    images: images?.length ? images : undefined,
    category,
    description,
    inStock,
    isNew: isNew || undefined,
    isPromo: isPromo || undefined,
    rating,
    reviews,
    filters,
  };
}

export function mapStockApiProductList(raw: unknown): Product[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (raw as { data?: unknown }).data;
  if (!Array.isArray(list)) return [];
  return list.map((item) => mapStockApiProductToProduct(item as StockApiProductInput));
}
