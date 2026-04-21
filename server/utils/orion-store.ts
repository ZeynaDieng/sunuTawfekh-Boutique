import type { H3Event } from "h3";
import type { Product } from "~/utils/data";
import type { OrionStoreListResponse } from "~/types/orion-api";
import { mapOrionProductToProduct } from "~/server/utils/orion-mapper";

const CACHE_TTL_MS = 120_000;
let cache: { slug: string; at: number; products: Product[] } | null = null;

function orionBase(event: H3Event): string {
  const config = useRuntimeConfig(event);
  return String(config.orionApiBase ?? "").replace(/\/$/, "");
}

function storeSlug(event: H3Event): string {
  const config = useRuntimeConfig(event);
  return String(config.orionStoreSlug ?? "").trim();
}

async function fetchStorePage(
  event: H3Event,
  slug: string,
  page: number,
  pageSize: number,
): Promise<OrionStoreListResponse["data"] | null> {
  const base = orionBase(event);
  if (!base) return null;
  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    populate: "true",
  });
  const url = `${base}/products/store/${encodeURIComponent(slug)}?${qs.toString()}`;
  try {
    const res = await $fetch<OrionStoreListResponse>(url, {
      headers: { Accept: "application/json" },
      timeout: 25_000,
    });
    const data = res?.data;
    if (!data || !Array.isArray(data.items)) return null;
    const ok =
      res.statusCode === undefined ||
      res.statusCode === 200 ||
      Number(res.statusCode) === 200;
    if (!ok) return null;
    return data;
  } catch (e) {
    console.error("[orion-store]", url, e);
    return null;
  }
}

/**
 * Charge toutes les pages du catalogue boutique Orion et mappe vers `Product`.
 * Détail produit : pas d’endpoint public sans auth (401 sur /products/:id) — on s’appuie sur cette liste.
 */
export async function fetchOrionStoreProductsAll(event: H3Event): Promise<Product[] | null> {
  const slug = storeSlug(event);
  const base = orionBase(event);
  if (!slug || !base) return null;

  const now = Date.now();
  if (cache && cache.slug === slug && now - cache.at < CACHE_TTL_MS) {
    return cache.products;
  }

  const pageSize = 100;
  const first = await fetchStorePage(event, slug, 1, pageSize);
  if (!first) return null;

  const all: Product[] = first.items.map((item) => mapOrionProductToProduct(item));
  const totalPages = Math.max(1, first.totalPages || 1);

  for (let p = 2; p <= totalPages; p++) {
    const chunk = await fetchStorePage(event, slug, p, pageSize);
    if (!chunk?.items?.length) break;
    all.push(...chunk.items.map((item) => mapOrionProductToProduct(item)));
  }

  cache = { slug, at: Date.now(), products: all };
  return all;
}

export function findOrionProductById(products: Product[], id: string): Product | null {
  return products.find((p) => p.id === id) ?? null;
}

/** Tests / invalidation manuelle si besoin. */
export function clearOrionStoreCache(): void {
  cache = null;
}
