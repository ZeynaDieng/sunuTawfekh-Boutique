import { fetchOrionStoreProductsAll } from "~/server/utils/orion-store";
import { fetchRemoteCategories } from "~/server/utils/stock-api-client";
import type { Category } from "~/utils/data";
import { categories as mockCategories } from "~/utils/data";

const ORION_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-e647996988d3?w=600&h=750&fit=crop&q=80";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  let fallback = false;
  let categories: Category[] = mockCategories;

  if (config.public.dataSource === "orion") {
    const products = await fetchOrionStoreProductsAll(event);
    if (products !== null) {
      const byCat = new Map<string, number>();
      for (const p of products) {
        const id = p.category || "boutique";
        byCat.set(id, (byCat.get(id) ?? 0) + 1);
      }
      if (byCat.size === 0) {
        categories = [
          {
            id: "boutique",
            name: "Sunu Tawfekh",
            image: ORION_CATEGORY_IMAGE,
            count: 0,
            tagline: "CATALOGUE",
          },
        ];
      } else {
        categories = [...byCat.entries()].map(([id, count]) => ({
          id,
          name: id === "boutique" ? "Sunu Tawfekh" : id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          image: ORION_CATEGORY_IMAGE,
          count,
          tagline: id === "boutique" ? "CATALOGUE" : undefined,
        }));
      }
    } else {
      fallback = true;
    }
  } else if (config.public.dataSource === "api") {
    const remote = await fetchRemoteCategories(event);
    if (remote?.length) {
      categories = remote;
    } else {
      fallback = true;
    }
  }

  if (fallback) {
    setResponseHeader(event, "x-catalog-source", "mock-fallback");
  } else if (config.public.dataSource === "orion") {
    setResponseHeader(event, "x-catalog-source", "orion");
  } else if (config.public.dataSource === "api" && !fallback) {
    setResponseHeader(event, "x-catalog-source", "api");
  } else {
    setResponseHeader(event, "x-catalog-source", "mock");
  }

  if (config.public.showDemoBanner && fallback) {
    setResponseHeader(event, "x-demo-banner", "1");
  }

  return {
    categories,
    demoMode: Boolean(config.public.showDemoBanner && fallback),
  };
});
