/**
 * Contrat observé : GET /api/products/store/:storeSlug?page=&pageSize=&populate=
 * @see https://api.orionsn.com/api/products/store/sunu-tawfekh-boutique
 */
export interface OrionStoreListResponse {
  statusCode: number;
  data: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    items: OrionProductRaw[];
  };
}

export interface OrionVarieteRaw {
  _id: string;
  prix?: number;
  prix_ttc?: number;
  sale_price_ttc?: number;
  on_sale?: boolean;
  stock?: number;
  stock_available?: number;
  statut?: string;
  deleted?: boolean;
}

export interface OrionProductRaw {
  _id: string;
  store?: string;
  nom?: string;
  description?: string;
  slug?: string;
  type?: string;
  images?: string[];
  /** Prix affiché côté parent (souvent min ou défaut). */
  prix?: number;
  prix_ttc?: number;
  prix_max?: number;
  sale_price_ttc?: number;
  stock?: number;
  stock_available?: number;
  stock_total?: number;
  to_sale?: boolean;
  manage_stock?: boolean;
  statut?: string;
  deleted?: boolean;
  archived?: boolean;
  varietes?: OrionVarieteRaw[];
  categories?: unknown[];
  origin?: string;
  createdAt?: string;
  promos?: unknown[];
}
