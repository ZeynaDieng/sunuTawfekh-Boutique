import type { Product } from "~/utils/data";

export interface CatalogListQuery {
  category?: string;
  page?: number;
  limit?: number;
  stockOnly?: boolean;
  newOnly?: boolean;
  promoOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  /** JSON stringifié Record<string, string[]> */
  filtersJson?: string;
  /** Sous-chaîne : nom, description, filtres (insensible à la casse, tous les mots doivent matcher). */
  search?: string;
}

function productMatchesSearch(product: Product, raw: string): boolean {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return true;
  const terms = trimmed.split(/\s+/).filter(Boolean);
  const hay = [
    product.name,
    product.description,
    product.subcategory ?? "",
    product.category,
    ...Object.values(product.filters ?? {}),
  ]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => hay.includes(t));
}

export function parseFiltersJson(raw: string | undefined): Record<string, string[]> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return {};
    const out: Record<string, string[]> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (Array.isArray(val)) out[k] = val.map(String);
      else if (typeof val === "string") out[k] = [val];
    }
    return out;
  } catch {
    return {};
  }
}

export function applyCatalogFilters(products: Product[], q: CatalogListQuery): Product[] {
  const activeFilters = q.filtersJson ? parseFiltersJson(q.filtersJson) : {};
  const priceMin = q.priceMin ?? 0;
  const priceMax = q.priceMax ?? Number.MAX_SAFE_INTEGER;

  return products.filter((p) => {
    if (q.search && !productMatchesSearch(p, q.search)) return false;
    if (q.category && p.category !== q.category) return false;
    if (q.stockOnly && !p.inStock) return false;
    if (q.newOnly && !p.isNew) return false;
    if (q.promoOnly && !p.isPromo) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    if (q.ratingMin !== undefined && p.rating < q.ratingMin) return false;
    for (const [key, values] of Object.entries(activeFilters)) {
      if (values.length > 0 && !values.includes(p.filters[key])) return false;
    }
    return true;
  });
}

export function paginate<T>(items: T[], page: number, limit: number): { slice: T[]; total: number } {
  const total = items.length;
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  const start = (p - 1) * l;
  return { slice: items.slice(start, start + l), total };
}
