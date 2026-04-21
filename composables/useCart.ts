import type { Product } from "~/utils/data";

export interface CartItem {
  product: Product;
  quantity: number;
}

export const useCart = () => {
  const items = useState<CartItem[]>("cart-items", () => []);
  const wishlist = useState<string[]>("wishlist", () => []);

  const addItem = (product: Product) => {
    const list = items.value;
    const existing = list.find((i) => i.product.id === product.id);
    if (existing) {
      items.value = list.map((i) =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
      );
    } else {
      items.value = [...list, { product, quantity: 1 }];
    }
  };

  const removeItem = (productId: string) => {
    items.value = items.value.filter((i) => i.product.id !== productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    items.value = items.value.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i,
    );
  };

  const clearCart = () => {
    items.value = [];
  };

  const toggleWishlist = (productId: string) => {
    const w = wishlist.value;
    wishlist.value = w.includes(productId) ? w.filter((id) => id !== productId) : [...w, productId];
  };

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.product.price * i.quantity, 0));

  return {
    items,
    wishlist,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleWishlist,
    totalItems,
    totalPrice,
  };
};
