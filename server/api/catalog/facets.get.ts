import { resolveProductList } from "~/server/utils/catalog-resolver";
import { getCategoryFacets } from "~/utils/filter-facets";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const category = String(q.cat ?? q.category ?? "");
  const { products } = await resolveProductList(event, { category: category || undefined, limit: 5000 });
  const inCat = category ? products.filter((p) => p.category === category) : products;
  const facets = getCategoryFacets(category, inCat);
  return { facets };
});
