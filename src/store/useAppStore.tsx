import { Store } from "@/types";
import { create } from "zustand";

interface AppStoreProps {
  stores: Store[];
}

interface AppStore extends AppStoreProps {
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  stores: [],
  setStores: (stores) => set({ stores }),
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
}));
