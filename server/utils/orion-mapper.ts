import type { Product } from "~/utils/data";
import type { OrionProductRaw, OrionVarieteRaw } from "~/types/orion-api";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Note publique stable (l’API Orion n’expose pas encore avis / notes). */
function syntheticRating(id: string): number {
  const h = hashString(id);
  return Math.round((4 + (h % 10) / 10) * 10) / 10;
}

function syntheticReviews(id: string): number {
  return 8 + (hashString(id + "r") % 220);
}

function pickPrice(raw: OrionProductRaw): number {
  const direct = Number(raw.prix_ttc) || Number(raw.prix) || 0;
  if (direct > 0) return Math.round(direct);
  const varietes = raw.varietes;
  if (!Array.isArray(varietes) || varietes.length === 0) return 0;
  const prices = varietes
    .map((v) => Number(v.prix_ttc) || Number(v.prix) || 0)
    .filter((p) => p > 0);
  if (!prices.length) return 0;
  return Math.round(Math.min(...prices));
}

function pickOldPrice(raw: OrionProductRaw, current: number): number | undefined {
  const varietes = raw.varietes;
  if (!Array.isArray(varietes)) return undefined;
  let best: number | undefined;
  for (const v of varietes) {
    const sale = Number(v.sale_price_ttc);
    const base = Number(v.prix_ttc) || Number(v.prix);
    if (v.on_sale && sale > 0 && base > sale) {
      if (best === undefined || base > best) best = base;
    }
  }
  if (best !== undefined && best > current) return Math.round(best);
  return undefined;
}

function isInStock(raw: OrionProductRaw): boolean {
  if (raw.deleted || raw.archived) return false;
  if (raw.statut && raw.statut !== "publie") return false;
  const n = Number(raw.stock_available ?? raw.stock ?? raw.stock_total ?? 0);
  if (n > 0) return true;
  if (raw.type === "variable" && Array.isArray(raw.varietes)) {
    return raw.varietes.some(
      (v: OrionVarieteRaw) => !v.deleted && (Number(v.stock_available ?? v.stock ?? 0) > 0),
    );
  }
  return false;
}

function isPromo(raw: OrionProductRaw): boolean {
  if (Array.isArray(raw.promos) && raw.promos.length > 0) return true;
  const varietes = raw.varietes;
  if (!Array.isArray(varietes)) return false;
  return varietes.some((v) => v.on_sale && Number(v.sale_price_ttc) > 0);
}

function isNew(raw: OrionProductRaw): boolean {
  if (!raw.createdAt) return false;
  const t = new Date(raw.createdAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 45 * 24 * 60 * 60 * 1000;
}

function pickCategoryId(raw: OrionProductRaw): string {
  const cats = raw.categories;
  if (Array.isArray(cats) && cats.length > 0) {
    const c = cats[0] as Record<string, unknown>;
    const slug = c.slug ?? c.id ?? c._id;
    if (slug) return String(slug).toLowerCase().replace(/\s+/g, "-");
  }
  return "boutique";
}

export function mapOrionProductToProduct(raw: OrionProductRaw): Product {
  const id = String(raw._id);
  const name = String(raw.nom ?? "Produit").trim() || "Produit";
  const images = Array.isArray(raw.images) ? raw.images.map(String).filter(Boolean) : [];
  /* Pas de /placeholder.svg ici : l’ancien fichier SVG était du texte vectoriel (recadré → « will »). */
  const image = images[0] ?? "";
  const description = String(raw.description ?? "").trim() || name;
  const price = pickPrice(raw);
  const oldPrice = pickOldPrice(raw, price);
  const category = pickCategoryId(raw);
  const idRating = syntheticRating(id);
  const reviews = syntheticReviews(id);

  const filters: Record<string, string> = {
    type: String(raw.type ?? "simple"),
    slug: String(raw.slug ?? ""),
    origin: String(raw.origin ?? "orion"),
  };

  return {
    id,
    name,
    price,
    oldPrice,
    image,
    images: images.length > 1 ? images : undefined,
    category,
    description,
    inStock: isInStock(raw),
    isNew: isNew(raw) ? true : undefined,
    isPromo: isPromo(raw) ? true : undefined,
    rating: idRating,
    reviews,
    filters,
  };
}
