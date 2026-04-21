import type { CartItem } from "~/composables/useCart";
import { CART_LOCAL_STORAGE_KEY, WISHLIST_LOCAL_STORAGE_KEY } from "~/utils/cart-storage";

export default defineNuxtPlugin(() => {
  const items = useState<CartItem[]>("cart-items", () => []);
  const wishlist = useState<string[]>("wishlist", () => []);

  /** Restore after hydration so SSR HTML (empty cart) matches the first client render. */
  function restoreFromStorage() {
    try {
      const rawCart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
      if (rawCart) {
        const parsed = JSON.parse(rawCart) as CartItem[];
        if (Array.isArray(parsed) && parsed.length && items.value.length === 0) {
          items.value = parsed;
        }
      }
      const rawWish = localStorage.getItem(WISHLIST_LOCAL_STORAGE_KEY);
      if (rawWish) {
        const parsed = JSON.parse(rawWish) as string[];
        if (Array.isArray(parsed) && parsed.length && wishlist.value.length === 0) {
          wishlist.value = parsed;
        }
      }
    } catch {
      /* ignore */
    }
  }

  setTimeout(restoreFromStorage, 0);

  watch(
    items,
    (v) => {
      try {
        localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(v));
      } catch {
        /* ignore */
      }
    },
    { deep: true },
  );

  watch(
    wishlist,
    (v) => {
      try {
        localStorage.setItem(WISHLIST_LOCAL_STORAGE_KEY, JSON.stringify(v));
      } catch {
        /* ignore */
      }
    },
    { deep: true },
  );
});
