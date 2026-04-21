import type { Product } from "~/utils/data";
import { filterConfig } from "~/utils/data";

export type FilterFacet = { label: string; key: string; options: string[] };

/** Facettes dérivées des produits (union des valeurs vues par clé de `filters`). */
export function buildFacetsFromProducts(products: Product[]): FilterFacet[] {
  const keyToValues = new Map<string, Set<string>>();
  for (const p of products) {
    for (const [k, v] of Object.entries(p.filters)) {
      if (!keyToValues.has(k)) keyToValues.set(k, new Set());
      keyToValues.get(k)!.add(v);
    }
  }
  const facets: FilterFacet[] = [];
  for (const [key, set] of keyToValues) {
    facets.push({
      key,
      label: key.replace(/_/g, " "),
      options: [...set].sort((a, b) => a.localeCompare(b, "fr")),
    });
  }
  return facets.sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

/** Combine config statique (labels lisibles) avec les options issues des produits. */
export function getCategoryFacets(categoryId: string, productsInCategory: Product[]): FilterFacet[] {
  if (!categoryId) return buildFacetsFromProducts(productsInCategory);
  const staticFacets = filterConfig[categoryId];
  const dynamic = buildFacetsFromProducts(productsInCategory);
  if (!staticFacets?.length) return dynamic;

  const dynByKey = Object.fromEntries(dynamic.map((f) => [f.key, f]));

  return staticFacets.map((sf) => {
    const fromProducts = dynByKey[sf.key]?.options ?? [];
    const merged = new Set([...sf.options, ...fromProducts]);
    return { ...sf, options: [...merged].sort((a, b) => a.localeCompare(b, "fr")) };
  });
}
