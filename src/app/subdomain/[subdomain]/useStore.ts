import { Customer } from "@/types/customer";
import { create } from "zustand";
import { Store as WebsiteStore } from "@/types/store";

export interface CartItem {
  id: number;
  quantity: number;
  variantId?: number;
}

interface StoreProperties {
  search: string;
  store?: WebsiteStore;
  cart: CartItem[];
  auth: {
    token: string;
    user: Customer;
  } | null;
  authOpen: "none" | "login" | "register";
}

interface Store extends StoreProperties {
  setAuth: (auth: StoreProperties["auth"]) => void;
  setStore: (store: StoreProperties["store"]) => void;
  removeAuth: () => void;
  setSearch: (search: string) => void;
  addToCart: (item: { id: number; variantId?: number }) => void;
  removeFromCart: (item: {
    id: number;
    variantId?: number;
    clear?: boolean;
  }) => void;
  clearCart: () => void;
  setAuthOpen: (authOpen: StoreProperties["authOpen"]) => void;
}

export const useStore = create<Store>((set, get) => ({
  search: "",
  cart: [],
  auth: null,
  authOpen: "none",
  setStore: (store) => {
    set({ store });
  },
  setAuth: (auth) => set({ auth }),
  setAuthOpen: (authOpen) => set({ authOpen }),
  removeAuth: () => set({ auth: null }),
  setSearch: (search: string) => set({ search }),
  addToCart: (item: { id: number; variantId?: number }) => {
    const { cart } = get();
    let existingItem = cart.find(
      (i) => i.id === item.id && i.variantId === item.variantId
    );
    if (!existingItem) {
      existingItem = { ...item, quantity: 1 };
    } else {
      existingItem.quantity++;
    }

    const index = cart.findIndex(
      (i) => i.id === item.id && i.variantId === item.variantId
    );

    if (index !== -1) {
      cart[index] = existingItem;
    } else {
      cart.push(existingItem);
    }

    set({ cart });
  },
  removeFromCart: ({ id, variantId, clear }) => {
    const { cart } = get();
    const index = cart.findIndex(
      (i) => i.id === id && i.variantId === variantId
    );
    if (index !== -1 && !clear) {
      const item = cart[index];
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.splice(index, 1);
      }
    } else if (index !== -1 && clear) {
      cart.splice(index, 1);
    }

    set({ cart });
  },
  clearCart: () => set({ cart: [] }),
}));
