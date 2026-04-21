import {
  fetchOrionStoreProductsAll,
  findOrionProductById,
} from "~/server/utils/orion-store";
import {
  fetchRemoteProductById,
  fetchRemoteProducts,
} from "~/server/utils/stock-api-client";
import type { H3Event } from "h3";
import type { Product } from "~/utils/data";
import { products as mockProducts } from "~/utils/data";

export async function resolveProductList(
  event: H3Event,
  _remoteQuery: Record<string, string | number | boolean | undefined>,
): Promise<{ products: Product[]; fromApi: boolean; fallback: boolean }> {
  const config = useRuntimeConfig(event);

  if (config.public.dataSource === "orion") {
    const remote = await fetchOrionStoreProductsAll(event);
    /* null = erreur réseau / parse ; [] = boutique vide (pas un fallback mock). */
    if (remote !== null) {
      return { products: remote, fromApi: true, fallback: false };
    }
    return { products: mockProducts, fromApi: false, fallback: true };
  }

  if (config.public.dataSource !== "api") {
    return { products: mockProducts, fromApi: false, fallback: false };
  }
  const remote = await fetchRemoteProducts(event, _remoteQuery);
  if (remote?.products?.length) {
    return { products: remote.products, fromApi: true, fallback: false };
  }
  return { products: mockProducts, fromApi: false, fallback: true };
}

export async function resolveProductById(
  event: H3Event,
  id: string,
): Promise<{ product: Product | null; fromApi: boolean; fallback: boolean }> {
  const config = useRuntimeConfig(event);

  if (config.public.dataSource === "orion") {
    const all = await fetchOrionStoreProductsAll(event);
    if (all !== null) {
      const found = findOrionProductById(all, id);
      if (found) return { product: found, fromApi: true, fallback: false };
      /* Orion OK mais id inconnu : pas de produit mock au même id (évite mélange). */
      return { product: null, fromApi: true, fallback: false };
    }
    const local = mockProducts.find((p) => p.id === id) ?? null;
    return { product: local, fromApi: false, fallback: !!local };
  }

  if (config.public.dataSource === "api") {
    const remote = await fetchRemoteProductById(event, id);
    if (remote) return { product: remote, fromApi: true, fallback: false };
    const local = mockProducts.find((p) => p.id === id) ?? null;
    return { product: local, fromApi: false, fallback: !!local };
  }
  const local = mockProducts.find((p) => p.id === id) ?? null;
  return { product: local, fromApi: false, fallback: false };
}

/** Pour validation panier : jeu cohérent (API ou mock). */
export async function resolveAllProductsForValidation(
  event: H3Event,
): Promise<{ products: Product[]; fallback: boolean }> {
  const { products, fallback } = await resolveProductList(event, { limit: 5000 });
  return { products, fallback };
}
