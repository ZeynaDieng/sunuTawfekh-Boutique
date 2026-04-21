import type { Category, Product } from "~/utils/data";

export interface CatalogProductsResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  source: string;
  fallback: boolean;
  demoMode?: boolean;
}

export interface CatalogCategoriesResponse {
  categories: Category[];
  demoMode?: boolean;
}

export interface CatalogFacetsResponse {
  facets: { label: string; key: string; options: string[] }[];
}

export function useCatalogCategories() {
  return useFetch<CatalogCategoriesResponse>("/api/catalog/categories", {
    key: "catalog-categories",
  });
}
