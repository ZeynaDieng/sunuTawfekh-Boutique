import { mapStockApiProductList, mapStockApiProductToProduct } from "~/types/stock-api";
import type { Category, Product } from "~/utils/data";
import type { H3Event } from "h3";

function authHeaders(event: H3Event): Record<string, string> {
  const config = useRuntimeConfig(event);
  const headers: Record<string, string> = { Accept: "application/json" };
  if (config.stockApiKey) headers.Authorization = `Bearer ${config.stockApiKey}`;
  return headers;
}

export async function stockFetch<T>(event: H3Event, path: string, init?: RequestInit): Promise<T | null> {
  const config = useRuntimeConfig(event);
  const base = config.stockApiBase?.replace(/\/$/, "") ?? "";
  if (!base) return null;
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    return await $fetch<T>(url, {
      ...init,
      headers: { ...authHeaders(event), ...(init?.headers as Record<string, string>) },
    });
  } catch (e) {
    console.error("[stock-api]", url, e);
    return null;
  }
}

/** Essaie GET /products avec query ; attend un tableau ou { data, meta? }. */
export async function fetchRemoteProducts(
  event: H3Event,
  query: Record<string, string | number | boolean | undefined>,
): Promise<{ products: Product[]; total?: number } | null> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === "") continue;
    qs.set(k, String(v));
  }
  const raw = await stockFetch<unknown>(event, `/products?${qs.toString()}`);
  if (raw === null) return null;
  const products = mapStockApiProductList(raw);
  const meta = raw as { meta?: { total?: number } };
  const total = meta?.meta?.total;
  return { products, total };
}

export async function fetchRemoteProductById(event: H3Event, id: string): Promise<Product | null> {
  const raw = await stockFetch<unknown>(event, `/products/${encodeURIComponent(id)}`);
  if (raw === null) return null;
  const one = Array.isArray(raw) ? raw[0] : (raw as { data?: unknown }).data ?? raw;
  if (!one || typeof one !== "object") return null;
  return mapStockApiProductToProduct(one as Record<string, unknown>);
}

export async function fetchRemoteCategories(event: H3Event): Promise<Category[] | null> {
  const raw = await stockFetch<unknown>(event, "/categories");
  if (raw === null) return null;
  const list = Array.isArray(raw) ? raw : (raw as { data?: unknown }).data;
  if (!Array.isArray(list)) return null;
  return list.map((c) => {
    const o = c as Record<string, unknown>;
    const taglineRaw = o.tagline ?? o.subtitle ?? o.strapline;
    return {
      id: String(o.id ?? ""),
      name: String(o.name ?? o.title ?? ""),
      image: String(o.image ?? o.cover ?? "").trim() || "",
      count: Number(o.count ?? o.product_count ?? 0) || 0,
      tagline: taglineRaw != null && String(taglineRaw).trim() ? String(taglineRaw) : undefined,
    };
  });
}

export async function postRemoteOrder(event: H3Event, body: unknown): Promise<unknown | null> {
  const config = useRuntimeConfig(event);
  const base = config.stockApiBase?.replace(/\/$/, "") ?? "";
  if (!base) return null;
  try {
    return await $fetch(`${base}/orders`, {
      method: "POST",
      body,
      headers: { ...authHeaders(event), "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[stock-api] POST /orders", e);
    return null;
  }
}

export async function postRemoteCartValidate(event: H3Event, body: unknown): Promise<unknown | null> {
  const config = useRuntimeConfig(event);
  const base = config.stockApiBase?.replace(/\/$/, "") ?? "";
  if (!base) return null;
  try {
    return await $fetch(`${base}/cart/validate`, {
      method: "POST",
      body,
      headers: { ...authHeaders(event), "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[stock-api] POST /cart/validate", e);
    return null;
  }
}
