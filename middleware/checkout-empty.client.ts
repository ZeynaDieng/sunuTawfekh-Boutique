import type { CartItem } from "~/composables/useCart";
import { CART_LOCAL_STORAGE_KEY } from "~/utils/cart-storage";

export default defineNuxtRouteMiddleware(() => {
  const items = useState<CartItem[]>("cart-items", () => []);

  if (items.value.length) return;

  /* Au premier chargement de /checkout, useState peut être vide avant le plugin : relire le localStorage. */
  if (import.meta.client) {
    try {
      const raw = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed) && parsed.length) {
          items.value = parsed;
          return;
        }
      }
    } catch {
      /* ignore */
    }
  }

  return navigateTo("/panier");
});
