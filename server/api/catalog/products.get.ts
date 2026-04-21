import { resolveProductList } from "~/server/utils/catalog-resolver";
import type { CatalogListQuery } from "~/utils/catalog-filters";
import { applyCatalogFilters, paginate } from "~/utils/catalog-filters";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const q = getQuery(event);

  const category = String(q.cat ?? q.category ?? "");
  const page = Math.max(1, Number(q.page ?? 1));
  const defaultLimit = Number(config.public.catalogPageSize ?? 48);
  const limit = Math.min(200, Math.max(1, Number(q.limit ?? defaultLimit)));

  const qSearch =
    typeof q.q === "string"
      ? q.q.trim()
      : typeof q.search === "string"
        ? q.search.trim()
        : "";

  const listQuery: CatalogListQuery = {
    category: category || undefined,
    page,
    limit,
    stockOnly: q.stockOnly === "1" || q.stockOnly === "true",
    newOnly: q.newOnly === "1" || q.newOnly === "true",
    promoOnly: q.promoOnly === "1" || q.promoOnly === "true",
    priceMin: q.priceMin !== undefined ? Number(q.priceMin) : undefined,
    priceMax: q.priceMax !== undefined ? Number(q.priceMax) : undefined,
    ratingMin: q.ratingMin !== undefined ? Number(q.ratingMin) : undefined,
    filtersJson: typeof q.filters === "string" ? q.filters : undefined,
    search: qSearch || undefined,
  };

  /** Pool élargi puis filtre + pagination locale (même logique que le mock). L’API distante peut ignorer limit élevé et paginer côté serveur métier plus tard. */
  const remoteQuery: Record<string, string | number | boolean | undefined> = {
    category: listQuery.category,
    page: 1,
    limit: 5000,
    stockOnly: listQuery.stockOnly,
    newOnly: listQuery.newOnly,
    promoOnly: listQuery.promoOnly,
    priceMin: listQuery.priceMin,
    priceMax: listQuery.priceMax,
    ratingMin: listQuery.ratingMin,
  };

  const { products: sourceList, fromApi, fallback } = await resolveProductList(event, remoteQuery);

  const filtered = applyCatalogFilters(sourceList, listQuery);
  const { slice, total } = paginate(filtered, page, limit);

  const sourceTag = fallback
    ? "mock-fallback"
    : fromApi
      ? config.public.dataSource === "orion"
        ? "orion"
        : "api"
      : "mock";
  setResponseHeader(event, "x-catalog-source", sourceTag);
  if (config.public.showDemoBanner && fallback) {
    setResponseHeader(event, "x-demo-banner", "1");
  }

  return {
    items: slice,
    total,
    page,
    pageSize: limit,
    source: sourceTag,
    fallback,
    demoMode: Boolean(config.public.showDemoBanner && fallback),
  };
});
